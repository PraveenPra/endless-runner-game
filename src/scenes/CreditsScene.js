import { createBitmapLabel, createButton, createPanel } from "../ui/PixelUI.js";

const CREDITS_FONT = "allFont";
const CREDITS_PANEL = {
  atlas: "panel-blue",
  prefix: "panel-blue",
  slice: 32,
};
const CREDITS_BUTTON = {
  atlas: "simple-buttons",
  layout: "horizontal",
  slice: 32,
  font: CREDITS_FONT,
  fontSize: 24,
  tint: 0x162032,
};

function buttonStyle(color, options = {}) {
  return {
    ...CREDITS_BUTTON,
    prefix: `button-${color}-v`,
    ...options,
  };
}

export class CreditsScene extends Phaser.Scene {
  constructor() {
    super("CreditsScene");
  }

  create() {
    const { width, height } = this.cameras.main;

    this.createBackdrop(width, height);
    this.createCreditsPanel(width, height);
  }

  createBackdrop(width, height) {
    this.add.rectangle(width / 2, height / 2, width, height, 0x07101b, 1);

    for (let i = 0; i < 34; i += 1) {
      this.add
        .rectangle(
          Phaser.Math.Between(16, width - 16),
          Phaser.Math.Between(16, height - 16),
          Phaser.Math.Between(2, 5),
          Phaser.Math.Between(2, 5),
          Phaser.Utils.Array.GetRandom([0x9fd8ff, 0xf7ffe8, 0xfff28f]),
          Phaser.Math.FloatBetween(0.24, 0.62),
        )
        .setDepth(0);
    }
  }

  createCreditsPanel(width, height) {
    createPanel(this, width / 2, height / 2, 720, 430, {
      ...CREDITS_PANEL,
      depth: 4,
      alpha: 0.96,
    });

    createBitmapLabel(this, width / 2, 76, "CREDITS", {
      font: CREDITS_FONT,
      size: 44,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, width / 2, 116, "DIGIMON ENDLESS RUNNER", {
      font: CREDITS_FONT,
      size: 22,
      tint: 0x9fd8ff,
    }).setDepth(6);

    const sections = [
      ["GAME DESIGN", "Your Name / Studio Name"],
      ["PROGRAMMING", "Your Name"],
      ["PIXEL ART", "Artist Name, Asset Pack Name"],
      ["MUSIC AND SFX", "Composer Name, Sound Library Name"],
      ["SPECIAL THANKS", "Friends, Testers, Community"],
      ["TOOLS", "Phaser, Aseprite, Tiled, Audacity"],
    ];

    sections.forEach(([title, names], index) => {
      const y = 168 + index * 42;
      createBitmapLabel(this, width / 2 - 280, y, title, {
        font: CREDITS_FONT,
        size: 19,
        tint: 0xfff28f,
        originX: 0,
      }).setDepth(6);

      createBitmapLabel(this, width / 2 - 70, y, names, {
        font: CREDITS_FONT,
        size: 19,
        tint: 0xf7ffe8,
        originX: 0,
      }).setDepth(6);
    });

    createBitmapLabel(this, width / 2, height - 112, "THANK YOU FOR PLAYING", {
      font: CREDITS_FONT,
      size: 24,
      tint: 0x8ff3ff,
    }).setDepth(6);

    createButton(this, width / 2, height - 52, 180, 42, "BACK", () => {
      this.scene.start("MainMenuScene");
    }, {
      ...buttonStyle("gray", {
        icon: "icon-left-arrow",
        iconSize: 18,
        textX: 14,
      }),
      depth: 8,
    });
  }
}
