import { GameState } from "../GameState.js";
import { getMapList } from "../config/maps.js";
import {
  createBitmapLabel,
  createButton,
  createPanel,
  SMALL_FONT_SIZE,
} from "../ui/PixelUI.js";

export class MapSelectScene extends Phaser.Scene {
  constructor() {
    super("MapSelectScene");
  }

  create() {
    const { width, height } = this.cameras.main;
    const maps = getMapList();

    this.add.rectangle(width / 2, height / 2, width, height, 0x08111f);
    this.createHeader(width);
    this.createMapGrid(maps);
    this.createNavigation(height);
  }

  createHeader(width) {
    createPanel(this, width / 2, 62, 580, 92, { depth: 4, alpha: 0.96 });
    createBitmapLabel(this, width / 2, 58, "MAPS", {
      font: "bigFont",
      size: 50,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, width / 2, 118, "choose-your-run", {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(6);
  }

  createMapGrid(maps) {
    const columns = Math.min(4, maps.length);
    const cardWidth = 206;
    const cardHeight = 292;
    const gap = 22;
    const startX = this.cameras.main.centerX - ((columns - 1) * (cardWidth + gap)) / 2;

    maps.forEach((map, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + col * (cardWidth + gap);
      const y = 286 + row * 318;
      this.createMapCard(x, y, cardWidth, cardHeight, map);
    });
  }

  createMapCard(x, y, width, height, map) {
    const selected = GameState.selectedMapKey === map.key;
    createPanel(this, x, y, width, height, {
      depth: 4,
      alpha: selected ? 1 : 0.88,
    });

    if (selected) {
      this.add
        .rectangle(x, y, width + 8, height + 8)
        .setStrokeStyle(3, 0xf7ffe8)
        .setDepth(5);
    }

    this.createMapPreview(x, y - 56, width - 32, 118, map);

    createBitmapLabel(this, x, y + 54, map.name, {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(7);

    createBitmapLabel(this, x, y + 88, selected ? "selected" : "ready", {
      size: SMALL_FONT_SIZE,
      tint: selected ? 0xf7ffe8 : 0x386341,
    }).setDepth(7);

    createButton(this, x, y + 126, 150, 42, "play", () => {
      GameState.selectedMapKey = map.key;
      this.scene.start("CharacterSelect");
    }, {
      depth: 8,
    });
  }

  createMapPreview(x, y, width, height, map) {
    const maskShape = this.add
      .rectangle(x, y, width, height, 0xffffff)
      .setVisible(false);
    const mask = maskShape.createGeometryMask();

    map.backgrounds.slice(0, 5).forEach((layer, index) => {
      if (!this.textures.exists(layer.key)) return;

      const preview = this.add
        .tileSprite(x, y, width, height, layer.key)
        .setDepth(6 + index * 0.01)
        .setAlpha(index === 0 ? 1 : 0.82)
        .setMask(mask);

      preview.tilePositionX = index * 18;
    });

    if (this.textures.exists(map.ground.key)) {
      this.add
        .tileSprite(x, y + height / 2 - 12, width, 24, map.ground.key)
        .setDepth(7)
        .setMask(mask);
    }
  }

  createNavigation(height) {
    createButton(this, 150, height - 34, 210, 42, "menu", () =>
      this.scene.start("MainMenuScene"),
    );
  }
}
