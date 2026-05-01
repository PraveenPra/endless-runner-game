import { GameState } from "../GameState.js";

const EGG_OFFERS = [
  {
    rarity: "common",
    title: "Common Egg",
    color: 0x8fd18f,
    frameRange: [0, 24],
    cost: { coins: 40 },
  },
  {
    rarity: "rare",
    title: "Rare Egg",
    color: 0x67b7ff,
    frameRange: [25, 39],
    cost: { coins: 120, gems: 3 },
  },
  {
    rarity: "epic",
    title: "Epic Egg",
    color: 0xd78cff,
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

    this.add.rectangle(width / 2, height / 2, width, height, 0x08111f);
    this.add
      .text(width / 2, 46, "SHOP", {
        fontSize: "34px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.currencyText = this.add
      .text(width / 2, 86, "", {
        fontSize: "16px",
        color: "#ffdcaa",
      })
      .setOrigin(0.5);

    this.messageText = this.add
      .text(width / 2, height - 74, "", {
        fontSize: "16px",
        color: "#ffffff",
        align: "center",
      })
      .setOrigin(0.5);

    this.createEggShelf();
    this.createUtilityShelf();
    this.createNavigation();
    this.refreshCurrency();
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
      this.createEggCard(x, 235, cardWidth, offer);
    });
  }

  createEggCard(x, y, width, offer) {
    const card = this.add
      .rectangle(x, y, width, 250, 0x101a2d, 0.96)
      .setStrokeStyle(3, offer.color);

    this.add
      .text(x, y - 100, offer.title.toUpperCase(), {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .sprite(x, y - 28, "collectible-eggs")
      .setFrame(offer.frameIndex)
      .setScale(1.28);

    this.add
      .text(x, y + 42, `${offer.rarity} rarity`, {
        fontSize: "14px",
        color: this.colorToHex(offer.color),
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 72, this.formatCost(offer.cost), {
        fontSize: "15px",
        color: "#ffdcaa",
      })
      .setOrigin(0.5);

    this.createButton(x, y + 108, 136, 34, "BUY", () => {
      this.buyEgg(offer);
    });

    return card;
  }

  createUtilityShelf() {
    this.add
      .text(480, 388, "UPGRADES", {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.createUtilityCard(
      300,
      445,
      "Hatchery Space",
      () =>
        `Slots ${GameState.hatchery.capacity}/${MAX_HATCHERY_CAPACITY} - ${this.formatCost(
          this.getHatcherySpaceCost(),
        )}`,
      () => this.buyHatcherySpace(),
    );

    this.createUtilityCard(
      660,
      445,
      "Buy Gems",
      () => `${GEM_PACK.coins} coins -> ${GEM_PACK.gems} gems`,
      () => this.buyGemsWithCoins(),
    );
  }

  createUtilityCard(x, y, title, detailFactory, onBuy) {
    this.add
      .rectangle(x, y, 300, 74, 0x101a2d, 0.96)
      .setStrokeStyle(2, 0x334763);
    this.add
      .text(x - 128, y - 16, title, {
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    const detailText = this.add
      .text(x - 128, y + 13, detailFactory(), {
        fontSize: "13px",
        color: "#b6c5d8",
      })
      .setOrigin(0, 0.5);

    this.createButton(x + 96, y, 82, 34, "BUY", () => {
      onBuy();
      detailText.setText(detailFactory());
    });
  }

  createNavigation() {
    this.createButton(140, 510, 150, 38, "MAIN MENU", () =>
      this.scene.start("MainMenuScene"),
    );
    this.createButton(480, 510, 150, 38, "HATCHERY", () =>
      this.scene.start("HatcheryScene"),
    );
    this.createButton(820, 510, 150, 38, "REROLL", () => {
      this.scene.restart();
    });
  }

  createButton(x, y, width, height, label, onClick) {
    const bg = this.add
      .rectangle(x, y, width, height, 0xffdcaa)
      .setStrokeStyle(2, 0x4b3422)
      .setInteractive({ useHandCursor: true });
    const text = this.add
      .text(x, y, label, {
        fontSize: "14px",
        color: "#16110b",
      })
      .setOrigin(0.5);

    bg.on("pointerover", () => {
      bg.setFillStyle(0xffefc8);
      text.setScale(1.04);
    });
    bg.on("pointerout", () => {
      bg.setFillStyle(0xffdcaa);
      text.setScale(1);
    });
    bg.on("pointerdown", onClick);
    text.setInteractive({ useHandCursor: true }).on("pointerdown", onClick);
    return bg;
  }

  buyEgg(offer) {
    if (GameState.hatchery.eggs.length >= GameState.hatchery.capacity) {
      this.showMessage(
        "Hatchery is full. Please hatch an egg, discard one, or buy more hatchery space.",
        "#ff7777",
      );
      return;
    }

    if (!GameState.currency.spend(offer.cost)) {
      this.showMessage(`Not enough currency. Need ${this.formatCost(offer.cost)}.`, "#ff7777");
      return;
    }

    GameState.hatchery.addEgg({
      frameIndex: offer.frameIndex,
      rarity: offer.rarity,
      purchasedAt: Date.now(),
    });
    this.refreshCurrency();
    this.showMessage(`${offer.title} sent to the hatchery.`, "#9dffb2");
  }

  buyHatcherySpace() {
    if (GameState.hatchery.capacity >= MAX_HATCHERY_CAPACITY) {
      this.showMessage("Hatchery space is already maxed out.", "#ffdcaa");
      return;
    }

    const cost = this.getHatcherySpaceCost();
    if (!GameState.currency.spend(cost)) {
      this.showMessage(`Not enough currency. Need ${this.formatCost(cost)}.`, "#ff7777");
      return;
    }

    GameState.hatchery.increaseCapacity(1);
    this.refreshCurrency();
    this.showMessage("Hatchery space increased.", "#9dffb2");
  }

  buyGemsWithCoins() {
    const cost = { coins: GEM_PACK.coins };
    if (!GameState.currency.spend(cost)) {
      this.showMessage(`Not enough coins. Need ${GEM_PACK.coins} coins.`, "#ff7777");
      return;
    }

    GameState.currency.addGems(GEM_PACK.gems);
    this.refreshCurrency();
    this.showMessage(`Bought ${GEM_PACK.gems} gems.`, "#9dffb2");
  }

  getHatcherySpaceCost() {
    const multiplier = GameState.hatchery.capacity;
    return {
      coins: HATCHERY_SPACE_BASE_COST.coins * multiplier,
      gems: HATCHERY_SPACE_BASE_COST.gems * multiplier,
    };
  }

  refreshCurrency() {
    this.currencyText.setText(
      `Coins: ${GameState.currency.coins}     Gems: ${GameState.currency.gems}     Hatchery: ${GameState.hatchery.eggs.length}/${GameState.hatchery.capacity}`,
    );
  }

  showMessage(text, color = "#ffffff") {
    this.messageText.setColor(color);
    this.messageText.setText(text);
  }

  formatCost(cost = {}) {
    const parts = [];
    if (cost.coins) parts.push(`${cost.coins} coins`);
    if (cost.gems) parts.push(`${cost.gems} gems`);
    return parts.join(" + ") || "free";
  }

  colorToHex(color) {
    return `#${color.toString(16).padStart(6, "0")}`;
  }
}
