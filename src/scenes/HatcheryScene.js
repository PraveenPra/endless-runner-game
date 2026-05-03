import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
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

export class HatcheryScene extends Phaser.Scene {
  constructor() {
    super("HatcheryScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    this.dynamicItems = [];
    this.add.rectangle(width / 2, height / 2, width, height, 0x08111f);
    this.createHeader(width);
    this.createResult(width);
    this.createNavigation(width, height);
    this.refreshEggs();
  }

  createHeader(width) {
    createPanel(this, width / 2, 66, 560, 96, { ...PANEL, depth: 4, alpha: 0.96 });
    this.add.image(width / 2 - 142, 62, "icons", "icon-key").setScale(1.45).setDepth(7);
    createBitmapLabel(this, width / 2, 62, "HATCHERY", {
      font: UI_FONT,
      size: 40,
      tint: 0xf7ffe8,
    }).setDepth(6);
    this.add.image(width / 2 + 142, 62, "icons", "icon-key").setScale(1.45).setDepth(7);

    this.messageText = createBitmapLabel(this, width / 2, 126, "", {
      font: UI_FONT,
      size: 22,
      tint: 0xf7ffe8,
    }).setDepth(6);
  }

  createResult(width) {
    this.resultSprite = this.add
      .sprite(width / 2, 392, "agumon")
      .setDepth(7)
      .setVisible(false);

    this.resultNameText = createBitmapLabel(this, width / 2, 466, "", {
      font: UI_FONT,
      size: 26,
      tint: 0xf7ffe8,
    })
      .setDepth(7)
      .setVisible(false);
  }

  createNavigation(width, height) {
    this.hatchButton = createButton(
      this,
      width / 2,
      height - 82,
      270,
      48,
      "HATCH",
      () => this.hatchEgg(),
      {
        ...buttonStyle("lime", {
          icon: "icon-star",
          iconSize: 20,
          textX: 15,
          fontSize: 27,
        }),
        depth: 8,
      },
    );

    createButton(this, 132, height - 34, 54, 42, "", () =>
      this.scene.start("MainMenuScene"),
      { ...iconButtonStyle("gray", "icon-left-arrow"), depth: 8 },
    );
    createButton(this, width / 2, height - 34, 210, 42, "SHOP", () =>
      this.scene.start("ShopScene"),
      {
        ...buttonStyle("yellow", {
          icon: "icon-diamond",
          iconSize: 18,
          textX: 13,
        }),
        depth: 8,
      },
    );
    createButton(this, 810, height - 34, 220, 42, "CHARACTER", () =>
      this.scene.start("CharacterSelect"),
      {
        ...buttonStyle("gray", {
          icon: "icon-login",
          iconSize: 18,
          textX: 16,
          fontSize: 21,
        }),
        depth: 8,
      },
    );
  }

  refreshEggs() {
    const eggs = GameState.hatchery.eggs;
    this.clearDynamicItems();
    this.resultSprite.setVisible(false);
    this.resultNameText.setVisible(false);

    this.createSlots(eggs);

    if (!eggs.length) {
      this.hatchButton.setAlpha(0.35);
      setBitmapLabelText(this.messageText, "NO EGGS", UI_FONT);
      return;
    }

    this.hatchButton.setAlpha(1);
    setBitmapLabelText(
      this.messageText,
      `SLOTS: ${eggs.length}/${GameState.hatchery.capacity}`,
      UI_FONT,
    );
  }

  createSlots(eggs) {
    const capacity = GameState.hatchery.capacity;
    const spacing = Math.min(148, 680 / Math.max(1, capacity));
    const startX = this.cameras.main.centerX - ((capacity - 1) * spacing) / 2;

    for (let i = 0; i < capacity; i += 1) {
      this.createSlot(startX + i * spacing, 242, eggs[i], i);
    }
  }

  createSlot(x, y, egg, index) {
    const panel = createPanel(this, x, y, 118, 142, {
      ...PANEL,
      depth: 5,
      alpha: egg ? 0.98 : 0.72,
    });
    this.dynamicItems.push(panel);

    const slotIcon = this.add
      .image(x, y - 44, "icons", egg ? "icon-star" : "icon-circle")
      .setScale(1.05)
      .setDepth(7)
      .setAlpha(egg ? 1 : 0.45);
    this.dynamicItems.push(slotIcon);

    const label = createBitmapLabel(this, x, y + 52, egg ? (egg.rarity || "EGG").toUpperCase() : "EMPTY", {
      font: UI_FONT,
      size: 18,
      tint: egg ? this.getRarityTint(egg.rarity) : 0x9aa9b8,
    }).setDepth(7);
    this.dynamicItems.push(label);

    if (!egg) return;

    const eggSprite = this.add
      .sprite(x, y - 18, "collectible-eggs")
      .setFrame(egg.frameIndex || 0)
      .setScale(1.1)
      .setDepth(7);
    this.dynamicItems.push(eggSprite);

    const discard = createButton(this, x, y + 94, 40, 34, "", () => {
      GameState.hatchery.discardEgg(index);
      this.refreshEggs();
    }, {
      ...iconButtonStyle("red", "icon-delete", {
        iconSize: 18,
      }),
      depth: 8,
    });
    this.dynamicItems.push(discard);
  }

  clearDynamicItems() {
    this.dynamicItems.forEach((item) => item.destroy());
    this.dynamicItems = [];
  }

  hatchEgg() {
    if (!GameState.hatchery.pendingEgg) {
      setBitmapLabelText(this.messageText, "NO EGGS", UI_FONT);
      return;
    }

    const digimonKey = GameState.hatchery.hatchPendingEgg();
    if (!digimonKey) {
      this.refreshEggs();
      setBitmapLabelText(this.messageText, "ALL UNLOCKED", UI_FONT);
      return;
    }

    createAnimations(this, digimonKey);
    this.refreshEggs();

    const idleKey = `${digimonKey}_idle`;
    const flyKey = `${digimonKey}_fly`;
    const runKey = `${digimonKey}_run`;
    const animKey = this.anims.exists(idleKey)
      ? idleKey
      : this.anims.exists(flyKey)
        ? flyKey
        : runKey;

    this.resultSprite
      .setTexture(digimonKey)
      .setVisible(true)
      .setScale(1.25)
      .play(animKey, true);
    setBitmapLabelText(this.resultNameText, this.formatName(digimonKey), UI_FONT);
    this.resultNameText.setVisible(true);
    this.hatchButton.setAlpha(0.35);
    setBitmapLabelText(this.messageText, "UNLOCKED", UI_FONT);

    this.cameras.main.flash(220, 255, 245, 180);
    this.cameras.main.shake(180, 0.006);
    if (this.sound.get("sfx-evolution")) {
      this.sound.play("sfx-evolution", { volume: 0.35 });
    }
  }

  formatName(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .replace(/-/g, " ")
      .toUpperCase();
  }

  getRarityTint(rarity) {
    if (rarity === "epic") return 0xffdf72;
    if (rarity === "rare") return 0x9fd8ff;
    return 0x9dffb2;
  }
}
