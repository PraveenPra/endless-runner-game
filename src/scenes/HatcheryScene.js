import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";

export class HatcheryScene extends Phaser.Scene {
  constructor() {
    super("HatcheryScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    this.add
      .text(width / 2, 64, "HATCHERY", {
        fontSize: "34px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.eggSprite = this.add
      .sprite(width / 2, 190, "collectible-eggs")
      .setScale(1.7)
      .setVisible(false);

    this.messageText = this.add
      .text(width / 2, 300, "", {
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

    this.hatchButton = this.createButton(width / 2, 510, "HATCH", () =>
      this.hatchEgg(),
    );
    this.createButton(260, 510, "MAIN MENU", () =>
      this.scene.start("MainMenuScene"),
    );
    this.createButton(700, 510, "CHARACTER SELECT", () =>
      this.scene.start("CharacterSelect"),
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
    const egg = GameState.hatchery.pendingEgg;

    this.resultSprite.setVisible(false);
    this.resultNameText.setVisible(false);

    if (!egg) {
      this.eggSprite.setVisible(false);
      this.hatchButton.setAlpha(0.35);
      this.messageText.setText("No egg waiting. Bring one back from a run.");
      return;
    }

    this.eggSprite.setFrame(egg.frameIndex || 0).setVisible(true);
    this.hatchButton.setAlpha(1);
    this.messageText.setText("This egg is ready.");
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

    const idleKey = `${digimonKey}_idle`;
    const flyKey = `${digimonKey}_fly`;
    const runKey = `${digimonKey}_run`;
    const animKey = this.anims.exists(idleKey)
      ? idleKey
      : this.anims.exists(flyKey)
        ? flyKey
        : runKey;

    this.eggSprite.setVisible(false);
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
