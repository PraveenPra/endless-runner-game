import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";

export class HatcheryScene extends Phaser.Scene {
  constructor() {
    super("HatcheryScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    this.slotSprites = [];
    this.slotLabels = [];
    this.discardButtons = [];

    this.add
      .text(width / 2, 64, "HATCHERY", {
        fontSize: "34px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.messageText = this.add
      .text(width / 2, 280, "", {
        fontSize: "18px",
        color: "#ffdcaa",
        align: "center",
      })
      .setOrigin(0.5);

    this.resultSprite = this.add.sprite(width / 2, 365, "agumon").setVisible(false);
    this.resultNameText = this.add
      .text(width / 2, 455, "", {
        fontSize: "22px",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.hatchButton = this.createButton(width / 2, 510, "HATCH FIRST EGG", () =>
      this.hatchEgg(),
    );
    this.createButton(220, 510, "MAIN MENU", () =>
      this.scene.start("MainMenuScene"),
    );
    this.createButton(740, 510, "CHARACTER SELECT", () =>
      this.scene.start("CharacterSelect"),
    );
    this.createButton(width / 2, 470, "SHOP", () =>
      this.scene.start("ShopScene"),
    );

    this.refreshEgg();
  }

  createButton(x, y, label, onClick) {
    const button = this.add
      .text(x, y, label, {
        fontSize: "18px",
        color: "#000000",
        backgroundColor: "#ffdcaa",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    button.on("pointerover", () => button.setScale(1.08));
    button.on("pointerout", () => button.setScale(1));
    button.on("pointerdown", onClick);
    return button;
  }

  refreshEgg() {
    const eggs = GameState.hatchery.eggs;

    this.resultSprite.setVisible(false);
    this.resultNameText.setVisible(false);
    this.slotSprites.forEach((slot) => slot.destroy());
    this.slotLabels.forEach((label) => label.destroy());
    this.discardButtons.forEach((button) => button.destroy());
    this.slotSprites = [];
    this.slotLabels = [];
    this.discardButtons = [];

    const startX = this.cameras.main.centerX - (GameState.hatchery.capacity - 1) * 72;
    for (let i = 0; i < GameState.hatchery.capacity; i += 1) {
      const x = startX + i * 144;
      const egg = eggs[i];

      const slot = this.add
        .rectangle(x, 185, 96, 110, 0x111a2e, 0.9)
        .setStrokeStyle(2, egg ? 0xffdcaa : 0x516178);
      this.slotSprites.push(slot);

      const label = this.add
        .text(x, 248, egg ? egg.rarity || "egg" : "empty", {
          fontSize: "13px",
          color: egg ? "#ffdcaa" : "#7d8ca3",
        })
        .setOrigin(0.5);
      this.slotLabels.push(label);

      if (egg) {
        const eggSprite = this.add
          .sprite(x, 181, "collectible-eggs")
          .setFrame(egg.frameIndex || 0)
          .setScale(1.15);
        this.slotSprites.push(eggSprite);

        const discard = this.createButton(x, 300, "DISCARD", () => {
          GameState.hatchery.discardEgg(i);
          this.refreshEgg();
        });
        discard.setFontSize("13px");
        this.discardButtons.push(discard);
      }
    }

    if (!eggs.length) {
      this.hatchButton.setAlpha(0.35);
      this.messageText.setText("No egg waiting. Bring one back from a run or buy one in the shop.");
      return;
    }

    this.hatchButton.setAlpha(1);
    this.messageText.setText(`${eggs.length}/${GameState.hatchery.capacity} hatchery slots filled.`);
  }

  hatchEgg() {
    if (!GameState.hatchery.pendingEgg) {
      this.messageText.setText("No egg waiting. Bring one back from a run.");
      return;
    }

    const digimonKey = GameState.hatchery.hatchPendingEgg();
    if (!digimonKey) {
      this.refreshEgg();
      this.messageText.setText("Every Digimon is already unlocked.");
      return;
    }

    createAnimations(this, digimonKey);
    this.refreshEgg();

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
    this.resultNameText
      .setText(this.formatName(digimonKey))
      .setVisible(true);
    this.hatchButton.setAlpha(0.35);
    this.messageText.setText("Unlocked!");

    this.cameras.main.flash(220, 255, 245, 180);
    this.cameras.main.shake(180, 0.006);
    if (this.sound.get("sfx-evolution")) {
      this.sound.play("sfx-evolution", { volume: 0.35 });
    }
  }

  formatName(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/^\w/, (char) => char.toUpperCase());
  }
}
