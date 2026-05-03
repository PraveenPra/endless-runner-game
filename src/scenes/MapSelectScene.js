import { GameState } from "../GameState.js";
import { getMapList } from "../config/maps.js";
import {
  createBitmapLabel,
  createButton,
  createPanel,
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
  fontSize: 23,
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
    this.createNavigation(width, height);
  }

  createHeader(width) {
    createPanel(this, width / 2, 62, 580, 92, { ...PANEL, depth: 4, alpha: 0.96 });
    this.add.image(width / 2 - 108, 58, "icons", "icon-layers").setScale(1.45).setDepth(7);
    createBitmapLabel(this, width / 2, 58, "MAPS", {
      font: UI_FONT,
      size: 42,
      tint: 0xf7ffe8,
    }).setDepth(6);
    this.add.image(width / 2 + 108, 58, "icons", "icon-flag").setScale(1.45).setDepth(7);

    createBitmapLabel(this, width / 2, 118, "CHOOSE YOUR RUN", {
      font: UI_FONT,
      size: 22,
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
      ...PANEL,
      depth: 4,
      alpha: selected ? 1 : 0.88,
    });

    if (selected) {
      this.add
        .rectangle(x, y, width + 8, height + 8)
        .setStrokeStyle(3, 0xffdf72)
        .setDepth(5);
    }

    this.createMapPreview(x, y - 56, width - 32, 118, map);

    createBitmapLabel(this, x, y + 54, map.name.toUpperCase(), {
      font: UI_FONT,
      size: 23,
      tint: 0xf7ffe8,
    }).setDepth(7);

    this.add
      .image(x - 50, y + 88, "icons", selected ? "icon-tick" : "icon-flag")
      .setScale(1)
      .setDepth(7);

    createBitmapLabel(this, x + 8, y + 88, selected ? "SELECTED" : "READY", {
      font: UI_FONT,
      size: 19,
      tint: selected ? 0xffdf72 : 0x9dffb2,
    }).setDepth(7);

    createButton(this, x, y + 126, 156, 42, selected ? "ENTER" : "PLAY", () => {
      GameState.selectedMapKey = map.key;
      this.scene.start("CharacterSelect");
    }, {
      ...buttonStyle(selected ? "lime" : "yellow", {
        icon: selected ? "icon-right-arrow" : "icon-flag",
        iconSize: 18,
        textX: 14,
      }),
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

  createNavigation(width, height) {
    createButton(this, 132, height - 34, 54, 42, "", () =>
      this.scene.start("MainMenuScene"),
      { ...iconButtonStyle("gray", "icon-left-arrow"), depth: 8 },
    );

    createBitmapLabel(this, width / 2, height - 34, "SELECT A MAP TO CONTINUE", {
      font: UI_FONT,
      size: 20,
      tint: 0xf7ffe8,
    }).setDepth(8);
  }
}
