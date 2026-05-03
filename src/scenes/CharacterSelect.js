import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { DEV_MODE } from "../config/dev.js";
import { getMapConfig } from "../config/maps.js";
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
  fontSize: 22,
  tint: 0x162032,
};

function buttonStyle(color, options = {}) {
  return {
    ...BUTTON_BASE,
    prefix: `button-${color}-v`,
    ...options,
  };
}

export class CharacterSelect extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    this.characters = GameState.allPlayableDigimon;
    this.selectedKey = null;
    this.cards = [];

    const { width, height } = this.cameras.main;
    this.add.rectangle(width / 2, height / 2, width, height, 0x08111f);
    this.createHeader(width);
    this.createCharacterGrid();
    this.createNavigation(width, height);
  }

  createHeader(width) {
    const map = getMapConfig(GameState.selectedMapKey);

    createPanel(this, width / 2, 62, 640, 92, { ...PANEL, depth: 4, alpha: 0.96 });
    this.add.image(width / 2 - 138, 58, "icons", "icon-login").setScale(1.45).setDepth(7);
    createBitmapLabel(this, width / 2, 58, "DIGIMON", {
      font: UI_FONT,
      size: 42,
      tint: 0xf7ffe8,
    }).setDepth(6);
    this.add.image(width / 2 + 138, 58, "icons", "icon-star").setScale(1.45).setDepth(7);

    createBitmapLabel(this, width / 2, 118, `MAP: ${map.name.toUpperCase()}`, {
      font: UI_FONT,
      size: 22,
      tint: 0xf7ffe8,
    }).setDepth(6);
  }

  createCharacterGrid() {
    const columns = 6;
    const cardWidth = 126;
    const cardHeight = 116;
    const gapX = 20;
    const gapY = 24;
    const startX = this.cameras.main.centerX - ((columns - 1) * (cardWidth + gapX)) / 2;
    const startY = 202;

    this.characters.forEach((key, index) => {
      const col = index % columns;
      const row = Math.floor(index / columns);
      const x = startX + col * (cardWidth + gapX);
      const y = startY + row * (cardHeight + gapY);
      this.createCharacterCard(x, y, cardWidth, cardHeight, key);
    });
  }

  createCharacterCard(x, y, width, height, key) {
    createAnimations(this, key);

    const unlocked = GameState.unlockedBaseForms.has(key);
    const panel = createPanel(this, x, y, width, height, {
      ...PANEL,
      depth: 4,
      alpha: unlocked ? 0.96 : 0.58,
    });

    const outline = this.add
      .rectangle(x, y, width + 8, height + 8)
      .setStrokeStyle(3, 0xffdf72)
      .setDepth(5)
      .setVisible(false);

    const sprite = this.add
      .sprite(x, y - 18, key)
      .setDepth(6)
      .setAlpha(unlocked ? 1 : 0.28);

    const idleKey = `${key}_idle`;
    const flyKey = `${key}_fly`;
    const runKey = `${key}_run`;
    const animKey = this.anims.exists(idleKey)
      ? idleKey
      : this.anims.exists(flyKey)
        ? flyKey
        : runKey;

    if (this.anims.exists(animKey)) {
      sprite.play(animKey, true);
    }

    const statusIcon = this.add
      .image(x - 42, y + 42, "icons", unlocked ? "icon-tick" : "icon-lock")
      .setScale(0.9)
      .setDepth(7)
      .setAlpha(unlocked ? 1 : 0.55);

    const label = createBitmapLabel(this, x + 8, y + 42, unlocked ? this.formatName(key) : "LOCKED", {
      font: UI_FONT,
      size: 16,
      tint: unlocked ? 0xf7ffe8 : 0x9aa9b8,
    }).setDepth(6);

    const hitArea = this.add
      .zone(x, y, width, height)
      .setDepth(9)
      .setInteractive({ useHandCursor: true });
    hitArea.on("pointerdown", () => this.select(key));

    this.cards.push({
      key,
      unlocked,
      panel,
      outline,
      sprite,
      statusIcon,
      label,
    });
  }

  createNavigation(width, height) {
    this.messageText = createBitmapLabel(this, width / 2, height - 84, "SELECT DIGIMON", {
      font: UI_FONT,
      size: 22,
      tint: 0xf7ffe8,
    }).setDepth(8);

    createButton(this, DEV_MODE ? 120 : 230, height - 34, 170, 42, "MAP", () =>
      this.scene.start("MapSelectScene"),
      {
        ...buttonStyle("yellow", {
          icon: "icon-layers",
          iconSize: 18,
          textX: 14,
        }),
        depth: 8,
      },
    );
    if (DEV_MODE) {
      createButton(this, 315, height - 34, 190, 42, "BODY", () => this.editBody(), {
        ...buttonStyle("gray", {
          icon: "icon-fine-tune",
          iconSize: 18,
          textX: 14,
        }),
        depth: 8,
      });
      createButton(this, 540, height - 34, 230, 42, "PROJECTILE", () =>
        this.editProjectiles(),
        {
          ...buttonStyle("gray", {
            icon: "icon-circle",
            iconSize: 18,
            textX: 17,
            fontSize: 20,
          }),
          depth: 8,
        },
      );
    }
    createButton(this, DEV_MODE ? 815 : 730, height - 34, 190, 42, "START", () =>
      this.startGame(),
      {
        ...buttonStyle("lime", {
          icon: "icon-right-arrow",
          iconSize: 18,
          textX: 15,
        }),
        depth: 8,
      },
    );
  }

  select(key) {
    if (!GameState.unlockedBaseForms.has(key)) {
      this.showMessage("HATCH FIRST", 0xff7777);
      return;
    }

    this.selectedKey = key;
    GameState.selectedDigimon = key;

    this.cards.forEach((card) => {
      const selected = card.key === key;
      card.outline.setVisible(selected);
      card.sprite.setAlpha(selected ? 1 : card.unlocked ? 0.62 : 0.22);
      card.panel.setAlpha(selected ? 1 : card.unlocked ? 0.86 : 0.52);
      card.statusIcon.setAlpha(selected ? 1 : card.unlocked ? 0.72 : 0.45);
    });

    this.showMessage(this.formatName(key), 0xf7ffe8);
  }

  editBody() {
    if (!DEV_MODE) return;
    if (!this.selectedKey) {
      this.showMessage("SELECT FIRST", 0xff7777);
      return;
    }
    this.scene.start("EditBodyScene", { digimon: this.selectedKey });
  }

  editProjectiles() {
    if (!DEV_MODE) return;
    if (!this.selectedKey) {
      this.showMessage("SELECT FIRST", 0xff7777);
      return;
    }
    this.scene.start("EditProjectileScene", { digimon: this.selectedKey });
  }

  startGame() {
    if (!this.selectedKey) {
      this.showMessage("SELECT FIRST", 0xff7777);
      return;
    }
    this.scene.start("Start");
  }

  showMessage(text, tint = 0xf7ffe8) {
    this.messageText.setTint(tint);
    setBitmapLabelText(this.messageText, text, UI_FONT);
  }

  formatName(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/-/g, " ")
      .toUpperCase();
  }
}
