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

  preload() {
    this.load.atlas(
      this.digimon,
      `assets/digimons/${this.digimon}/${this.digimon}.png`,
      `assets/digimons/${this.digimon}/${this.digimon}.json`
    );
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

    this.sprite = this.add.sprite(250, 180, this.digimon);
    const idleKey = `${this.digimon}_idle`;
    const flyKey = `${this.digimon}_fly`;
    const animKey = this.anims.exists(idleKey) ? idleKey : flyKey;
    this.sprite.anims.play(animKey || `${this.digimon}_run`, true);

    this.bodyBox = this.add.rectangle(250, 180, this.body.width, this.body.height, 0xff0000, 0.3);
    this.bodyBox.setStrokeStyle(2, 0xff0000);

    this.add.text(250, 30, "SPRITE", { fontSize: "14px", color: "#ffffff" }).setOrigin(0.5);
    this.add.text(450, 30, "HITBOX (red)", { fontSize: "14px", color: "#ff0000" }).setOrigin(0.5);

    const ground = this.add.rectangle(350, 250, 400, 4, 0x666666);
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
  }

  createControls() {
    this.paramIndex = 0;
    this.currentParam = this.paramConfig[0];

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

    this.add
      .text(500, btnY, "SAVE", {
        fontSize: "16px",
        color: "#000000",
        backgroundColor: "#00ff00",
        padding: { x: 20, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.save());
  }

  updateBodyBox() {
    const { width, height, offsetX, offsetY, gravityY } = this.body;
    this.bodyBox.setPosition(250 + offsetX, 180 + offsetY);
    this.bodyBox.setSize(width, height);

    this.labels.width.setText(String(width));
    this.labels.height.setText(String(height));
    this.labels.offsetX.setText(String(offsetX));
    this.labels.offsetY.setText(String(offsetY));
    this.labels.gravityY.setText(String(gravityY));
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

  save() {
    const profileKey = this.digimon;
    const saveData = {
      width: this.body.width,
      height: this.body.height,
      offsetX: this.body.offsetX,
      offsetY: this.body.offsetY,
      gravityY: this.body.gravityY,
    };

    localStorage.setItem(`digimon_${profileKey}_body`, JSON.stringify(saveData));

    const exportData = {
      body: saveData,
    };
    const content =
      `export const ${profileKey} = ` + JSON.stringify(exportData, null, 2) + ";\n";

    const blob = new Blob([content], { type: "text/javascript" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${profileKey}.js`;
    a.click();
    URL.revokeObjectURL(url);

    this.showMessage("Downloaded!", 0x00ff00);
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

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.adjustValue(-1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.adjustValue(1);
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.paramIndex = Math.max(0, this.paramIndex - 1);
      this.updateHighlight();
    }
    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.paramIndex = Math.min(this.paramConfig.length - 1, this.paramIndex + 1);
      this.updateHighlight();
    }
  }
}