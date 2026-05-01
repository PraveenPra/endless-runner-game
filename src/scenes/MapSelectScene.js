import { GameState } from "../GameState.js";
import { getMapList } from "../config/maps.js";

export class MapSelectScene extends Phaser.Scene {
  constructor() {
    super("MapSelectScene");
  }

  create() {
    const { width } = this.cameras.main;
    const maps = getMapList();

    this.add.rectangle(480, 272, 960, 544, 0x08111f);
    this.add
      .text(width / 2, 58, "SELECT MAP", {
        fontSize: "34px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    maps.forEach((map, index) => {
      const x = width / 2 - (maps.length - 1) * 150 + index * 300;
      this.createMapCard(x, 260, map);
    });

    this.createButton(160, 510, 160, 38, "MAIN MENU", () =>
      this.scene.start("MainMenuScene"),
    );
  }

  createMapCard(x, y, map) {
    const selected = GameState.selectedMapKey === map.key;
    const borderColor = selected ? 0xffdcaa : 0x38516f;

    this.add
      .rectangle(x, y, 240, 260, 0x101a2d, 0.96)
      .setStrokeStyle(3, borderColor);

    const previewLayers = map.backgrounds.slice(0, 5);
    previewLayers.forEach((layer, index) => {
      const preview = this.add
        .image(x, y - 44 + index * 8, layer.key)
        .setDisplaySize(210, 116)
        .setOrigin(0.5);
      preview.setAlpha(0.9);
    });

    this.add
      .tileSprite(x, y + 28, 210, 16, map.ground.key)
      .setScale(1, 1.2);

    this.add
      .text(x, y + 82, map.name.toUpperCase(), {
        fontSize: "20px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 112, selected ? "Selected" : "Ready", {
        fontSize: "13px",
        color: selected ? "#ffdcaa" : "#9ab0ca",
      })
      .setOrigin(0.5);

    this.createButton(x, y + 146, 150, 34, "PLAY HERE", () => {
      GameState.selectedMapKey = map.key;
      this.scene.start("CharacterSelect");
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
  }
}
