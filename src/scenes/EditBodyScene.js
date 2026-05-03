import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";
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
  fontSize: 22,
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
    iconSize: 18,
    ...options,
  };
}

export class EditBodyScene extends Phaser.Scene {
  constructor() {
    super("EditBodyScene");
  }

  init(data) {
    this.digimon = data.digimon || GameState.selectedDigimon || "agumon";
    this.originalProfile = resolveProfile(this.digimon);
    this.body = { ...this.originalProfile.body };
  }

  create() {
    createAnimations(this, this.digimon);
    this.cursors = this.input.keyboard.createCursorKeys();

    this.createVisuals();
    this.createUI();
    this.createControls();
    this.createButtons();
  }

  createVisuals() {
    this.add.rectangle(480, 272, 960, 544, 0x08111f);
    createPanel(this, 480, 54, 700, 88, { ...PANEL, depth: 3, alpha: 0.96 });
    this.add.image(218, 38, "icons", "icon-fine-tune").setScale(1.35).setDepth(6);
    createBitmapLabel(this, 480, 38, `EDIT BODY: ${this.formatName(this.digimon)}`, {
      font: UI_FONT,
      size: 28,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, 480, 68, "MATCH BODY BOX TO SPRITE", {
      font: UI_FONT,
      size: 18,
      tint: 0x9fd8ff,
    }).setDepth(6);

    createPanel(this, 300, 285, 500, 330, { ...PANEL, depth: 2, alpha: 0.9 });

    this.previewX = 285;
    this.groundY = 335;

    this.sprite = this.physics.add.sprite(this.previewX, this.groundY, this.digimon);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(8);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.moves = false;
    const idleKey = `${this.digimon}_idle`;
    const flyKey = `${this.digimon}_fly`;
    const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;
    this.sprite.anims.play(animKey || `${this.digimon}_run`, true);

    this.bodyBox = this.add.rectangle(this.previewX, this.groundY, this.body.width, this.body.height, 0xff0000, 0.3);
    this.bodyBox.setOrigin(0, 0);
    this.bodyBox.setStrokeStyle(2, 0xff0000);
    this.bodyBox.setDepth(9);

    createBitmapLabel(this, 300, 142, "SPRITE AND BODY BOX", {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
    }).setDepth(6);
    const ground = this.add.rectangle(300, this.groundY, 430, 4, 0x566070);
    ground.setDepth(7);
    createBitmapLabel(this, 300, 354, "GROUND", {
      font: UI_FONT,
      size: 15,
      tint: 0x9aa9b8,
    }).setDepth(6);
  }

  createUI() {
    this.labels = {};
    const startY = 185;
    const startX = 610;
    const spacing = 48;

    createPanel(this, 720, 300, 370, 330, { ...PANEL, depth: 2, alpha: 0.94 });
    this.add.image(startX - 24, 132, "icons", "icon-fine-tune").setScale(1).setDepth(6);
    createBitmapLabel(this, startX + 8, 132, "BODY PARAMETERS", {
      font: UI_FONT,
      size: 19,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(6);

    const params = [
      { key: "width", name: "Width", min: 1, max: 100, step: 1 },
      { key: "height", name: "Height", min: 1, max: 100, step: 1 },
      { key: "offsetX", name: "Offset X", min: -50, max: 50, step: 1 },
      { key: "offsetY", name: "Offset Y", min: -50, max: 50, step: 1 },
      { key: "gravityY", name: "Gravity", min: 0, max: 2000, step: 50 },
    ];

    this.paramConfig = params;

    params.forEach((param, index) => {
      const y = startY + index * spacing;

      const row = this.add.rectangle(startX + 122, y, 305, 36, 0x1d2636, 0.86);
      row.setStrokeStyle(1, 0x2f3b52);
      row.setDepth(4);

      createBitmapLabel(this, startX, y, `${param.name.toUpperCase()}:`, {
        font: UI_FONT,
        size: 16,
        tint: 0xf7ffe8,
        originX: 0,
      }).setDepth(6);

      const valueText = createBitmapLabel(this, startX + 160, y, String(this.body[param.key]), {
        font: UI_FONT,
        size: 17,
        tint: 0xffdf72,
      }).setDepth(6);

      this.labels[param.key] = valueText;

      this.createAdjustButton(startX + 238, y, "-", () =>
        this.adjustParam(index, -1),
      );
      this.createAdjustButton(startX + 282, y, "+", () =>
        this.adjustParam(index, 1),
      );
    });

    createBitmapLabel(this, 720, 438, "UP/DOWN SELECT", {
      font: UI_FONT,
      size: 15,
      tint: 0x9aa9b8,
    }).setDepth(6);
    createBitmapLabel(this, 720, 462, "LEFT/RIGHT ADJUST", {
      font: UI_FONT,
      size: 15,
      tint: 0x9aa9b8,
    }).setDepth(6);
    this.updateBodyBox();
  }

  createControls() {
    this.paramIndex = 0;
    this.currentParam = this.paramConfig[0];
    this.adjustHoldDelay = 220;
    this.adjustHoldInterval = 90;
    this.nextAdjustAt = 0;
    this.activeAdjustDirection = 0;

    this.highlight = this.add.rectangle(725, 185, 302, 40, 0xffdf72, 0.16);
    this.highlight.setStrokeStyle(1, 0xffdf72);
    this.highlight.setDepth(5);
  }

  createButtons() {
    const btnY = 508;

    createButton(this, 360, btnY, 140, 42, "BACK", () => this.back(), {
      ...buttonStyle("gray", {
        icon: "icon-left-arrow",
        iconSize: 18,
        textX: 14,
      }),
      depth: 8,
    });

    createButton(this, 530, btnY, 150, 42, "RESET", () => this.reset(), {
      ...buttonStyle("red", {
        icon: "icon-multiply",
        iconSize: 18,
        textX: 14,
      }),
      depth: 8,
    });
  }

  createAdjustButton(x, y, label, onClick) {
    return createButton(this, x, y, 34, 32, "", onClick, {
      ...iconButtonStyle("yellow", label === "+" ? "icon-plus" : "icon-minus", {
        iconSize: 17,
      }),
      repeat: true,
      repeatDelay: 85,
      depth: 8,
    });
  }

  updateBodyBox() {
    const { width, height, offsetX, offsetY, gravityY } = this.body;
    const frameWidth = this.sprite.frame.width;
    const frameHeight = this.sprite.frame.height;

    this.sprite.body.setSize(width, height);
    this.sprite.body.setOffset(
      frameWidth / 2 - width / 2 + offsetX,
      frameHeight - height + offsetY
    );
    this.sprite.body.setGravityY(gravityY);

    const bodyRect = this.getBodyRect();
    this.bodyBox.setPosition(bodyRect.x, bodyRect.y);
    this.bodyBox.setSize(bodyRect.width, bodyRect.height);

    this.labels.width.setText(String(width));
    this.labels.height.setText(String(height));
    this.labels.offsetX.setText(String(offsetX));
    this.labels.offsetY.setText(String(offsetY));
    this.labels.gravityY.setText(String(gravityY));
  }

  getBodyRect() {
    const body = this.sprite.body;
    const displayOriginX = this.sprite.displayOriginX * this.sprite.scaleX;
    const displayOriginY = this.sprite.displayOriginY * this.sprite.scaleY;

    return {
      x: this.sprite.x + body.offset.x * this.sprite.scaleX - displayOriginX,
      y: this.sprite.y + body.offset.y * this.sprite.scaleY - displayOriginY,
      width: body.width,
      height: body.height,
    };
  }

  updateHighlight() {
    const y = 185 + this.paramIndex * 48;
    this.highlight.setPosition(725, y);
    this.currentParam = this.paramConfig[this.paramIndex];
  }

  adjustValue(delta) {
    const param = this.currentParam;
    let newValue = this.body[param.key] + delta * param.step;
    newValue = Math.max(param.min, Math.min(param.max, newValue));
    this.body[param.key] = newValue;
    this.updateBodyBox();
  }

  adjustParam(paramIndex, direction) {
    this.paramIndex = paramIndex;
    this.updateHighlight();
    this.adjustValue(direction);
  }

  back() {
    this.scene.start("CharacterSelect");
  }

  reset() {
    this.body = { ...this.originalProfile.body };
    this.updateBodyBox();
  }

  showMessage(text, color) {
    if (this.msg) this.msg.destroy();
    const tint = color === 0x00ff00 ? 0x9dffb2 : color === 0xffff00 ? 0xffdf72 : 0xff7777;
    this.msg = createBitmapLabel(this, 480, 460, text.toUpperCase(), {
      font: UI_FONT,
      size: 22,
      tint,
    }).setDepth(9);
    this.time.delayedCall(1500, () => {
      if (this.msg) this.msg.destroy();
    });
  }

  formatName(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/-/g, " ")
      .toUpperCase();
  }

  update() {
    if (!this.cursors) return;

    this.handleAdjustInput();
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.paramIndex = Math.max(0, this.paramIndex - 1);
      this.updateHighlight();
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.paramIndex = Math.min(this.paramConfig.length - 1, this.paramIndex + 1);
      this.updateHighlight();
    }
  }

  handleAdjustInput() {
    const now = this.time.now;
    const leftDown = this.cursors.left.isDown;
    const rightDown = this.cursors.right.isDown;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.adjustValue(-1);
      this.activeAdjustDirection = -1;
      this.nextAdjustAt = now + this.adjustHoldDelay;
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.adjustValue(1);
      this.activeAdjustDirection = 1;
      this.nextAdjustAt = now + this.adjustHoldDelay;
      return;
    }

    if (leftDown && !rightDown) {
      if (this.activeAdjustDirection !== -1) {
        this.activeAdjustDirection = -1;
        this.nextAdjustAt = now + this.adjustHoldDelay;
      } else if (now >= this.nextAdjustAt) {
        this.adjustValue(-1);
        this.nextAdjustAt = now + this.adjustHoldInterval;
      }
      return;
    }

    if (rightDown && !leftDown) {
      if (this.activeAdjustDirection !== 1) {
        this.activeAdjustDirection = 1;
        this.nextAdjustAt = now + this.adjustHoldDelay;
      } else if (now >= this.nextAdjustAt) {
        this.adjustValue(1);
        this.nextAdjustAt = now + this.adjustHoldInterval;
      }
      return;
    }

    this.activeAdjustDirection = 0;
  }
}
