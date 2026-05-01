import { GameState } from "../GameState.js";
import {
  createBitmapLabel,
  createButton,
  createPanel,
  setBitmapLabelText,
  SMALL_FONT_SIZE,
} from "../ui/PixelUI.js";

const EGG_OFFERS = [
  {
    rarity: "common",
    title: "common-egg",
    frameRange: [0, 24],
    cost: { coins: 40 },
  },
  {
    rarity: "rare",
    title: "rare-egg",
    frameRange: [25, 39],
    cost: { coins: 120, gems: 3 },
  },
  {
    rarity: "epic",
    title: "epic-egg",
    frameRange: [40, 49],
    cost: { gems: 12 },
  },
];

const HATCHERY_SPACE_BASE_COST = { coins: 250, gems: 8 };
const MAX_HATCHERY_CAPACITY = 5;
const GEM_PACK = { coins: 100, gems: 5 };

export class ShopScene extends Phaser.Scene {
  constructor() {
    super("ShopScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    this.offers = this.rollEggOffers();
    this.detailLabels = [];

    this.add.rectangle(width / 2, height / 2, width, height, 0x08111f);
    this.createHeader(width);
    this.createEggShelf();
    this.createUpgradeShelf();
    this.createNavigation(width, height);
    this.refreshCurrency();
  }

  createHeader(width) {
    createPanel(this, width / 2, 62, 620, 92, { depth: 4, alpha: 0.96 });
    createBitmapLabel(this, width / 2, 58, "SHOP", {
      font: "bigFont",
      size: 50,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.currencyText = createBitmapLabel(this, width / 2, 118, "", {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.messageText = createBitmapLabel(this, width / 2, 492, "", {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);
  }

  rollEggOffers() {
    return EGG_OFFERS.map((offer) => ({
      ...offer,
      frameIndex: Phaser.Math.Between(offer.frameRange[0], offer.frameRange[1]),
    }));
  }

  createEggShelf() {
    const { width } = this.cameras.main;
    const cardWidth = 230;
    const gap = 34;
    const startX = width / 2 - cardWidth - gap;

    this.offers.forEach((offer, index) => {
      const x = startX + index * (cardWidth + gap);
      this.createEggCard(x, 262, cardWidth, offer);
    });
  }

  createEggCard(x, y, width, offer) {
    createPanel(this, x, y, width, 250, { depth: 4, alpha: 0.96 });

    createBitmapLabel(this, x, y - 94, offer.title, {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.add
      .sprite(x, y - 26, "collectible-eggs")
      .setFrame(offer.frameIndex)
      .setScale(1.25)
      .setDepth(6);

    createBitmapLabel(this, x, y + 44, offer.rarity, {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, x, y + 76, this.formatCost(offer.cost), {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createButton(this, x, y + 112, 126, 38, "buy", () => this.buyEgg(offer), {
      depth: 7,
    });
  }

  createUpgradeShelf() {
    createBitmapLabel(this, 480, 404, "upgrades", {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.createUpgradeCard(
      288,
      445,
      "slots",
      () =>
        `${GameState.hatchery.capacity}/${MAX_HATCHERY_CAPACITY}:${this.formatCost(
          this.getHatcherySpaceCost(),
        )}`,
      () => this.buyHatcherySpace(),
    );

    this.createUpgradeCard(
      672,
      445,
      "gems",
      () => `${GEM_PACK.coins}coins=${GEM_PACK.gems}gems`,
      () => this.buyGemsWithCoins(),
    );
  }

  createUpgradeCard(x, y, title, detailFactory, onBuy) {
    createPanel(this, x, y, 310, 78, { depth: 4, alpha: 0.96 });

    createBitmapLabel(this, x - 92, y - 14, title, {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(6);

    const detail = createBitmapLabel(this, x - 92, y + 17, detailFactory(), {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(6);
    this.detailLabels.push({ detail, detailFactory });

    createButton(this, x + 104, y, 82, 36, "buy", () => {
      onBuy();
      this.refreshUpgradeDetails();
    }, {
      depth: 7,
    });
  }

  createNavigation(width, height) {
    createButton(this, 150, height - 34, 210, 42, "menu", () =>
      this.scene.start("MainMenuScene"),
    );
    createButton(this, width / 2, height - 34, 210, 42, "hatchery", () =>
      this.scene.start("HatcheryScene"),
    );
    createButton(this, 810, height - 34, 210, 42, "reroll", () =>
      this.scene.restart(),
    );
  }

  buyEgg(offer) {
    if (GameState.hatchery.eggs.length >= GameState.hatchery.capacity) {
      this.showMessage("hatchery-full", 0xff7777);
      return;
    }

    if (!GameState.currency.spend(offer.cost)) {
      this.showMessage("not-enough", 0xff7777);
      return;
    }

    GameState.hatchery.addEgg({
      frameIndex: offer.frameIndex,
      rarity: offer.rarity,
      purchasedAt: Date.now(),
    });
    this.refreshCurrency();
    this.showMessage("sent-to-hatchery", 0x9dffb2);
  }

  buyHatcherySpace() {
    if (GameState.hatchery.capacity >= MAX_HATCHERY_CAPACITY) {
      this.showMessage("slots-max", 0xf7ffe8);
      return;
    }

    const cost = this.getHatcherySpaceCost();
    if (!GameState.currency.spend(cost)) {
      this.showMessage("not-enough", 0xff7777);
      return;
    }

    GameState.hatchery.increaseCapacity(1);
    this.refreshCurrency();
    this.showMessage("slots-added", 0x9dffb2);
  }

  buyGemsWithCoins() {
    if (!GameState.currency.spend({ coins: GEM_PACK.coins })) {
      this.showMessage("not-enough", 0xff7777);
      return;
    }

    GameState.currency.addGems(GEM_PACK.gems);
    this.refreshCurrency();
    this.showMessage("gems-added", 0x9dffb2);
  }

  refreshCurrency() {
    setBitmapLabelText(
      this.currencyText,
      `coins:${GameState.currency.coins}-gems:${GameState.currency.gems}-eggs:${GameState.hatchery.eggs.length}/${GameState.hatchery.capacity}`,
    );
  }

  refreshUpgradeDetails() {
    this.detailLabels.forEach(({ detail, detailFactory }) => {
      setBitmapLabelText(detail, detailFactory());
    });
  }

  showMessage(text, tint = 0xf7ffe8) {
    this.messageText.setTint(tint);
    setBitmapLabelText(this.messageText, text);
  }

  getHatcherySpaceCost() {
    const multiplier = GameState.hatchery.capacity;
    return {
      coins: HATCHERY_SPACE_BASE_COST.coins * multiplier,
      gems: HATCHERY_SPACE_BASE_COST.gems * multiplier,
    };
  }

  formatCost(cost = {}) {
    const parts = [];
    if (cost.coins) parts.push(`${cost.coins}coins`);
    if (cost.gems) parts.push(`${cost.gems}gems`);
    return parts.join("+") || "free";
  }
}
