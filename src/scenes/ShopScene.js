import { GameState } from "../GameState.js";
import {
  createBitmapLabel,
  createButton,
  createPanel,
  setBitmapLabelText,
} from "../ui/PixelUI.js";

const UI_FONT = "allFont";
const PANEL = {
  atlas: "panel-blue",
  prefix: "panel-blue",
  slice: 32,
};
const BUTTON_BASE = {
  atlas: "simple-buttons",
  layout: "horizontal",
  slice: 32,
  font: UI_FONT,
  fontSize: 24,
  tint: 0x162032,
};
const ICON_BUTTON_BASE = {
  atlas: "simple-buttons",
  layout: "single",
  slice: 32,
};

function buttonStyle(color, options = {}) {
  return {
    ...BUTTON_BASE,
    prefix: `button-${color}-v`,
    ...options,
  };
}

function iconButtonStyle(color, icon, options = {}) {
  return {
    ...ICON_BUTTON_BASE,
    prefix: `button-${color}`,
    icon,
    iconSize: 21,
    ...options,
  };
}

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
    createPanel(this, width / 2, 62, 620, 92, { ...PANEL, depth: 4, alpha: 0.96 });
    this.add.image(width / 2 - 88, 58, "icons", "icon-diamond").setScale(1.55).setDepth(7);
    createBitmapLabel(this, width / 2, 58, "SHOP", {
      font: UI_FONT,
      size: 42,
      tint: 0xf7ffe8,
    }).setDepth(6);
    this.add.image(width / 2 + 88, 58, "icons", "icon-diamond").setScale(1.55).setDepth(7);

    this.currencyText = createBitmapLabel(this, width / 2, 118, "", {
      font: UI_FONT,
      size: 22,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.messageText = createBitmapLabel(this, width / 2, 492, "", {
      font: UI_FONT,
      size: 22,
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
    createPanel(this, x, y, width, 250, { ...PANEL, depth: 4, alpha: 0.96 });

    createBitmapLabel(this, x, y - 94, this.formatTitle(offer.title), {
      font: UI_FONT,
      size: 24,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.add.image(x - 78, y - 94, "icons", "icon-star").setScale(1.15).setDepth(7);
    this.add.image(x + 78, y - 94, "icons", "icon-star").setScale(1.15).setDepth(7);

    this.add
      .sprite(x, y - 26, "collectible-eggs")
      .setFrame(offer.frameIndex)
      .setScale(1.25)
      .setDepth(6);

    createBitmapLabel(this, x, y + 44, offer.rarity.toUpperCase(), {
      font: UI_FONT,
      size: 22,
      tint: this.getRarityTint(offer.rarity),
    }).setDepth(6);

    createBitmapLabel(this, x, y + 76, this.formatCost(offer.cost), {
      font: UI_FONT,
      size: 19,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createButton(this, x, y + 112, 138, 38, "BUY", () => this.buyEgg(offer), {
      ...buttonStyle("yellow", {
        icon: "icon-tick",
        iconSize: 18,
        textX: 13,
      }),
      depth: 7,
    });
  }

  createUpgradeShelf() {
    this.add.image(392, 404, "icons", "icon-up-arrow").setScale(1.25).setDepth(7);
    createBitmapLabel(this, 480, 404, "UPGRADES", {
      font: UI_FONT,
      size: 24,
      tint: 0xf7ffe8,
    }).setDepth(6);
    this.add.image(568, 404, "icons", "icon-up-arrow").setScale(1.25).setDepth(7);

    this.createUpgradeCard(
      288,
      445,
      "SLOTS",
      "icon-layers",
      () =>
        `${GameState.hatchery.capacity}/${MAX_HATCHERY_CAPACITY}: ${this.formatCost(
          this.getHatcherySpaceCost(),
        )}`,
      () => this.buyHatcherySpace(),
    );

    this.createUpgradeCard(
      672,
      445,
      "GEMS",
      "icon-diamond",
      () => `${GEM_PACK.coins} COINS = ${GEM_PACK.gems} GEMS`,
      () => this.buyGemsWithCoins(),
    );
  }

  createUpgradeCard(x, y, title, icon, detailFactory, onBuy) {
    createPanel(this, x, y, 310, 78, { ...PANEL, depth: 4, alpha: 0.96 });

    this.add.image(x - 116, y - 13, "icons", icon).setScale(1.25).setDepth(7);
    createBitmapLabel(this, x - 92, y - 14, title, {
      font: UI_FONT,
      size: 22,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(6);

    const detail = createBitmapLabel(this, x - 92, y + 17, detailFactory(), {
      font: UI_FONT,
      size: 17,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(6);
    this.detailLabels.push({ detail, detailFactory });

    createButton(this, x + 104, y, 86, 36, "BUY", () => {
      onBuy();
      this.refreshUpgradeDetails();
    }, {
      ...buttonStyle("lime", {
        fontSize: 21,
        icon: "icon-plus",
        iconSize: 16,
        textX: 12,
      }),
      depth: 7,
    });
  }

  createNavigation(width, height) {
    createButton(this, 132, height - 34, 54, 42, "", () =>
      this.scene.start("MainMenuScene"),
      { ...iconButtonStyle("gray", "icon-left-arrow"), depth: 8 },
    );
    createButton(this, width / 2, height - 34, 220, 42, "HATCHERY", () =>
      this.scene.start("HatcheryScene"),
      {
        ...buttonStyle("lime", {
          icon: "icon-key",
          iconSize: 18,
          textX: 15,
        }),
        depth: 8,
      },
    );
    createButton(this, 828, height - 34, 54, 42, "", () =>
      this.scene.restart(),
      { ...iconButtonStyle("yellow", "icon-right-arrow"), depth: 8 },
    );
  }

  buyEgg(offer) {
    if (GameState.hatchery.eggs.length >= GameState.hatchery.capacity) {
      this.showMessage("HATCHERY FULL", 0xff7777);
      return;
    }

    if (!GameState.currency.spend(offer.cost)) {
      this.showMessage("NOT ENOUGH", 0xff7777);
      return;
    }

    GameState.hatchery.addEgg({
      frameIndex: offer.frameIndex,
      rarity: offer.rarity,
      purchasedAt: Date.now(),
    });
    this.refreshCurrency();
    this.showMessage("SENT TO HATCHERY", 0x9dffb2);
  }

  buyHatcherySpace() {
    if (GameState.hatchery.capacity >= MAX_HATCHERY_CAPACITY) {
      this.showMessage("SLOTS MAX", 0xf7ffe8);
      return;
    }

    const cost = this.getHatcherySpaceCost();
    if (!GameState.currency.spend(cost)) {
      this.showMessage("NOT ENOUGH", 0xff7777);
      return;
    }

    GameState.hatchery.increaseCapacity(1);
    this.refreshCurrency();
    this.showMessage("SLOTS ADDED", 0x9dffb2);
  }

  buyGemsWithCoins() {
    if (!GameState.currency.spend({ coins: GEM_PACK.coins })) {
      this.showMessage("NOT ENOUGH", 0xff7777);
      return;
    }

    GameState.currency.addGems(GEM_PACK.gems);
    this.refreshCurrency();
    this.showMessage("GEMS ADDED", 0x9dffb2);
  }

  refreshCurrency() {
    setBitmapLabelText(
      this.currencyText,
      `COINS: ${GameState.currency.coins}   GEMS: ${GameState.currency.gems}   EGGS: ${GameState.hatchery.eggs.length}/${GameState.hatchery.capacity}`,
      UI_FONT,
    );
  }

  refreshUpgradeDetails() {
    this.detailLabels.forEach(({ detail, detailFactory }) => {
      setBitmapLabelText(detail, detailFactory(), UI_FONT);
    });
  }

  showMessage(text, tint = 0xf7ffe8) {
    this.messageText.setTint(tint);
    setBitmapLabelText(this.messageText, text, UI_FONT);
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
    if (cost.coins) parts.push(`${cost.coins} COINS`);
    if (cost.gems) parts.push(`${cost.gems} GEMS`);
    return parts.join(" + ") || "FREE";
  }

  formatTitle(title) {
    return title.replace(/-/g, " ").toUpperCase();
  }

  getRarityTint(rarity) {
    if (rarity === "epic") return 0xffdf72;
    if (rarity === "rare") return 0x9fd8ff;
    return 0x9dffb2;
  }
}
