import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";

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
    this.add
      .text(480, 30, `EDIT BODY: ${this.digimon.toUpperCase()}`, {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add.text(480, 55, "Adjust body parameters to match sprite", {
      fontSize: "12px",
      color: "#aaaaaa",
    }).setOrigin(0.5);

    this.previewX = 250;
    this.groundY = 250;

    this.sprite = this.physics.add.sprite(this.previewX, this.groundY, this.digimon);
    this.sprite.setOrigin(0.5, 1);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.moves = false;
    const idleKey = `${this.digimon}_idle`;
    const flyKey = `${this.digimon}_fly`;
    const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;
    this.sprite.anims.play(animKey || `${this.digimon}_run`, true);

    this.bodyBox = this.add.rectangle(this.previewX, this.groundY, this.body.width, this.body.height, 0xff0000, 0.3);
    this.bodyBox.setOrigin(0, 0);
    this.bodyBox.setStrokeStyle(2, 0xff0000);

    this.add.text(250, 30, "SPRITE", { fontSize: "14px", color: "#ffffff" }).setOrigin(0.5);
    this.add.text(450, 30, "HITBOX (red)", { fontSize: "14px", color: "#ff0000" }).setOrigin(0.5);

    const ground = this.add.rectangle(350, this.groundY, 400, 4, 0x666666);
    this.add.text(350, 265, "GROUND", { fontSize: "12px", color: "#666666" }).setOrigin(0.5);
  }

  createUI() {
    this.labels = {};
    const startY = 320;
    const startX = 180;
    const spacing = 28;

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

      this.add.text(startX - 70, y, param.name + ":", {
        fontSize: "14px",
        color: "#ffffff",
      }).setOrigin(0, 0.5);

      const valueText = this.add.text(startX + 70, y, String(this.body[param.key]), {
        fontSize: "14px",
        color: "#ffff00",
      }).setOrigin(0.5, 0.5);

      this.labels[param.key] = valueText;
    });

    this.add.text(350, 490, "↑↓ select  ←→ adjust", {
      fontSize: "12px",
      color: "#888888",
    }).setOrigin(0.5);
    this.updateBodyBox();
  }

  createControls() {
    this.paramIndex = 0;
    this.currentParam = this.paramConfig[0];
    this.adjustHoldDelay = 220;
    this.adjustHoldInterval = 90;
    this.nextAdjustAt = 0;
    this.activeAdjustDirection = 0;

    this.highlight = this.add.rectangle(180, 320 - 8, 150, 22, 0xffff00, 0.2);
    this.highlight.setStrokeStyle(1, 0xffff00);
  }

  createButtons() {
    const btnY = 530;

    this.add
      .text(250, btnY, "← BACK", {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.back());

    this.add
      .text(370, btnY, "RESET", {
        fontSize: "16px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 15, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.reset());
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
    const y = 320 - 8 + this.paramIndex * 28;
    this.highlight.setPosition(180, y);
    this.currentParam = this.paramConfig[this.paramIndex];
  }

  adjustValue(delta) {
    const param = this.currentParam;
    let newValue = this.body[param.key] + delta * param.step;
    newValue = Math.max(param.min, Math.min(param.max, newValue));
    this.body[param.key] = newValue;
    this.updateBodyBox();
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
    this.msg = this.add
      .text(480, 460, text, {
        fontSize: "20px",
        color: color === 0x00ff00 ? "#00ff00" : color === 0xffff00 ? "#ffff00" : "#ff0000",
      })
      .setOrigin(0.5);
    this.time.delayedCall(1500, () => {
      if (this.msg) this.msg.destroy();
    });
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
