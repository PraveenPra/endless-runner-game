import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { getMapConfig } from "../config/maps.js";
import {
  createBitmapLabel,
  createButton,
  createPanel,
  setBitmapLabelText,
  SMALL_FONT_SIZE,
} from "../ui/PixelUI.js";

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

    createPanel(this, width / 2, 62, 640, 92, { depth: 4, alpha: 0.96 });
    createBitmapLabel(this, width / 2, 58, "DIGIMON", {
      font: "bigFont",
      size: 50,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, width / 2, 118, `map:${map.name}`, {
      size: SMALL_FONT_SIZE,
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
      depth: 4,
      alpha: unlocked ? 0.96 : 0.58,
    });

    const outline = this.add
      .rectangle(x, y, width + 8, height + 8)
      .setStrokeStyle(3, 0xf7ffe8)
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

    const label = createBitmapLabel(this, x, y + 42, unlocked ? key : "locked", {
      size: SMALL_FONT_SIZE,
      tint: unlocked ? 0xf7ffe8 : 0x386341,
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
      label,
    });
  }

  createNavigation(width, height) {
    this.messageText = createBitmapLabel(this, width / 2, height - 84, "select-digimon", {
      size: SMALL_FONT_SIZE,
      tint: 0xf7ffe8,
    }).setDepth(8);

    createButton(this, 120, height - 34, 170, 42, "map", () =>
      this.scene.start("MapSelectScene"),
    );
    createButton(this, 315, height - 34, 190, 42, "body", () => this.editBody());
    createButton(this, 540, height - 34, 230, 42, "projectile", () =>
      this.editProjectiles(),
    );
    createButton(this, 815, height - 34, 190, 42, "start", () =>
      this.startGame(),
    );
  }

  select(key) {
    if (!GameState.unlockedBaseForms.has(key)) {
      this.showMessage("hatch-first", 0xff7777);
      return;
    }

    this.selectedKey = key;
    GameState.selectedDigimon = key;

    this.cards.forEach((card) => {
      const selected = card.key === key;
      card.outline.setVisible(selected);
      card.sprite.setAlpha(selected ? 1 : card.unlocked ? 0.62 : 0.22);
      card.panel.setAlpha(selected ? 1 : card.unlocked ? 0.86 : 0.52);
    });

    this.showMessage(key, 0xf7ffe8);
  }

  editBody() {
    if (!this.selectedKey) {
      this.showMessage("select-first", 0xff7777);
      return;
    }
    this.scene.start("EditBodyScene", { digimon: this.selectedKey });
  }

  editProjectiles() {
    if (!this.selectedKey) {
      this.showMessage("select-first", 0xff7777);
      return;
    }
    this.scene.start("EditProjectileScene", { digimon: this.selectedKey });
  }

  startGame() {
    if (!this.selectedKey) {
      this.showMessage("select-first", 0xff7777);
      return;
    }
    this.scene.start("Start");
  }

  showMessage(text, tint = 0xf7ffe8) {
    this.messageText.setTint(tint);
    setBitmapLabelText(this.messageText, text);
  }
}
