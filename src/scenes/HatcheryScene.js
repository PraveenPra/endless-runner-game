import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import {
  createBitmapLabel,
  createButton,
  createPanel,
  setBitmapLabelText,
  SMALL_FONT_SIZE,
} from "../ui/PixelUI.js";

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
    createPanel(this, width / 2, 66, 560, 96, { depth: 4, alpha: 0.96 });
    createBitmapLabel(this, width / 2, 62, "HATCHERY", {
      font: "bigFont",
      size: 48,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.messageText = createBitmapLabel(this, width / 2, 126, "", {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);
  }

  createResult(width) {
    this.resultSprite = this.add
      .sprite(width / 2, 392, "agumon")
      .setDepth(7)
      .setVisible(false);

    this.resultNameText = createBitmapLabel(this, width / 2, 466, "", {
      size: SMALL_FONT_SIZE,
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
      "hatch",
      () => this.hatchEgg(),
      { depth: 8 },
    );

    createButton(this, 160, height - 34, 210, 42, "menu", () =>
      this.scene.start("MainMenuScene"),
    );
    createButton(this, width / 2, height - 34, 210, 42, "shop", () =>
      this.scene.start("ShopScene"),
    );
    createButton(this, 800, height - 34, 210, 42, "character", () =>
      this.scene.start("CharacterSelect"),
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
      setBitmapLabelText(this.messageText, "no-eggs");
      return;
    }

    this.hatchButton.setAlpha(1);
    setBitmapLabelText(
      this.messageText,
      `slots:${eggs.length}/${GameState.hatchery.capacity}`,
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
      depth: 5,
      alpha: egg ? 0.98 : 0.72,
    });
    this.dynamicItems.push(panel);

    const label = createBitmapLabel(this, x, y + 52, egg ? egg.rarity || "egg" : "empty", {
      size: SMALL_FONT_SIZE,
      tint: egg ? 0xf7ffe8 : 0x386341,
    }).setDepth(7);
    this.dynamicItems.push(label);

    if (!egg) return;

    const eggSprite = this.add
      .sprite(x, y - 18, "collectible-eggs")
      .setFrame(egg.frameIndex || 0)
      .setScale(1.1)
      .setDepth(7);
    this.dynamicItems.push(eggSprite);

    const discard = createButton(this, x, y + 94, 112, 34, "discard", () => {
      GameState.hatchery.discardEgg(index);
      this.refreshEggs();
    }, {
      depth: 8,
      fontSize: SMALL_FONT_SIZE,
    });
    this.dynamicItems.push(discard);
  }

  clearDynamicItems() {
    this.dynamicItems.forEach((item) => item.destroy());
    this.dynamicItems = [];
  }

  hatchEgg() {
    if (!GameState.hatchery.pendingEgg) {
      setBitmapLabelText(this.messageText, "no-eggs");
      return;
    }

    const digimonKey = GameState.hatchery.hatchPendingEgg();
    if (!digimonKey) {
      this.refreshEggs();
      setBitmapLabelText(this.messageText, "all-unlocked");
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
    setBitmapLabelText(this.resultNameText, this.formatName(digimonKey));
    this.resultNameText.setVisible(true);
    this.hatchButton.setAlpha(0.35);
    setBitmapLabelText(this.messageText, "unlocked");

    this.cameras.main.flash(220, 255, 245, 180);
    this.cameras.main.shake(180, 0.006);
    if (this.sound.get("sfx-evolution")) {
      this.sound.play("sfx-evolution", { volume: 0.35 });
    }
  }

  formatName(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1-$2")
      .toLowerCase();
  }
}
