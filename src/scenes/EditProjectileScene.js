import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";
import * as DIGIMON_PROFILES from "../entities/digimon/DigimonProfiles/index.js";

export class EditProjectileScene extends Phaser.Scene {
  constructor() {
    super("EditProjectileScene");
  }

  init(data) {
    this.digimon = data.digimon || GameState.selectedDigimon || "agumon";
    this.profile = resolveProfile(this.digimon);
    this.baseProfile = DIGIMON_PROFILES[this.digimon] || {};
    this.attacks = this.getProjectileAttacks(this.profile.attacks);
    this.baseAttacks = this.getProjectileAttacks(this.baseProfile.attacks || {});
    this.attackIndex = 0;
    this.paramIndex = 0;
  }

  create() {
    createAnimations(this, this.digimon);

    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      q: Phaser.Input.Keyboard.KeyCodes.Q,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      save: Phaser.Input.Keyboard.KeyCodes.S,
      reset: Phaser.Input.Keyboard.KeyCodes.R,
      escape: Phaser.Input.Keyboard.KeyCodes.ESC,
    });

    this.createLayout();

    if (this.attacks.length === 0) {
      this.createEmptyState();
      return;
    }

    this.createPreview();
    this.createAttackTabs();
    this.createOffsetControls();
    this.createButtons();
    this.updateSelection();
  }

  getProjectileAttacks(attacks) {
    return Object.entries(attacks || {})
      .filter(([, attack]) => attack?.type === "projectile" && attack.projectile)
      .map(([key, attack]) => ({
        key,
        attack,
      }));
  }

  createLayout() {
    this.add.rectangle(480, 272, 960, 544, 0x10141c);
    this.add.rectangle(480, 58, 960, 116, 0x171d29);

    this.add
      .text(480, 28, `EDIT PROJECTILES: ${this.digimon.toUpperCase()}`, {
        fontSize: "24px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 58, "Offsets are measured from the red body box top-left", {
        fontSize: "12px",
        color: "#aeb8c8",
      })
      .setOrigin(0.5);
  }

  createEmptyState() {
    this.add
      .text(480, 250, "No projectile attacks found for this Digimon.", {
        fontSize: "18px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.add
      .text(480, 292, "Add a projectile attack in its profile to edit offsets here.", {
        fontSize: "13px",
        color: "#aeb8c8",
      })
      .setOrigin(0.5);

    this.createBackButton(480, 500);
  }

  createPreview() {
    this.previewX = 310;
    this.groundY = 335;

    this.add.rectangle(310, 338, 420, 4, 0x566070);
    this.add
      .text(310, 124, "BODY-RELATIVE SPAWN PREVIEW", {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.sprite = this.physics.add.sprite(
      this.previewX,
      this.groundY,
      this.digimon,
    );
    this.sprite.setOrigin(0.5, 1);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.moves = false;

    this.bodyBox = this.add.rectangle(0, 0, 1, 1, 0xff3b30, 0.22);
    this.bodyBox.setOrigin(0, 0);
    this.bodyBox.setStrokeStyle(2, 0xff3b30);

    this.spawnMarker = this.add.circle(0, 0, 5, 0x35d0ff, 1);
    this.spawnMarker.setStrokeStyle(2, 0xffffff);
    this.spawnLine = this.add.line(0, 0, 0, 0, 56, 0, 0x35d0ff, 0.8);
    this.spawnLine.setOrigin(0, 0.5);

    this.projectilePreview = this.add.sprite(0, 0, "fireball");
    this.projectilePreview.setOrigin(0.5);

    this.frameText = this.add
      .text(310, 370, "", {
        fontSize: "13px",
        color: "#dce6f5",
      })
      .setOrigin(0.5);
  }

  createAttackTabs() {
    this.attackTabTexts = [];
    const startX = 480 - (this.attacks.length - 1) * 54;

    this.attacks.forEach(({ key }, index) => {
      const tab = this.add
        .text(startX + index * 108, 88, this.formatAttackName(key), {
          fontSize: "14px",
          color: "#dce6f5",
          backgroundColor: "#263145",
          padding: { x: 12, y: 7 },
        })
        .setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on("pointerdown", () => {
          this.attackIndex = index;
          this.updateSelection();
        });

      this.attackTabTexts.push(tab);
    });
  }

  createOffsetControls() {
    this.paramConfig = [
      { key: "offsetX", name: "Offset X", min: -80, max: 160, step: 1 },
      { key: "offsetY", name: "Offset Y", min: -80, max: 160, step: 1 },
      { key: "fireFrame", name: "Fire Frame", min: 1, max: 99, step: 1 },
    ];

    this.valueLabels = {};
    this.paramRows = [];
    const startX = 630;
    const startY = 185;

    this.add
      .text(startX, 128, "SPAWN POSITION", {
        fontSize: "14px",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    this.attackInfoText = this.add.text(startX, 150, "", {
      fontSize: "12px",
      color: "#aeb8c8",
    });

    this.paramConfig.forEach((param, index) => {
      const y = startY + index * 58;
      const row = this.add.rectangle(startX + 105, y, 270, 40, 0x1d2636, 0.9);
      row.setStrokeStyle(1, 0x2f3b52);
      this.paramRows.push(row);

      this.add.text(startX, y, param.name, {
        fontSize: "15px",
        color: "#ffffff",
      }).setOrigin(0, 0.5);

      this.valueLabels[param.key] = this.add
        .text(startX + 142, y, "0", {
          fontSize: "16px",
          color: "#35d0ff",
        })
        .setOrigin(0.5);

      this.createAdjustButton(startX + 205, y, "-", () =>
        this.adjustParam(index, -1),
      );
      this.createAdjustButton(startX + 245, y, "+", () =>
        this.adjustParam(index, 1),
      );
    });

    this.add
      .text(
        startX,
        372,
        "A/D attack  |  Up/Down field  |  Left/Right adjust  |  Q/E frame",
        {
          fontSize: "11px",
          color: "#7f8da3",
        },
      )
      .setOrigin(0, 0.5);

    this.createAdjustButton(startX + 46, 330, "PREV FRAME", () =>
      this.adjustFireFrame(-1),
    );
    this.createAdjustButton(startX + 184, 330, "NEXT FRAME", () =>
      this.adjustFireFrame(1),
    );
  }

  createAdjustButton(x, y, label, onClick) {
    return this.add
      .text(x, y, label, {
        fontSize: "18px",
        color: "#ffffff",
        backgroundColor: "#33425c",
        padding: { x: 11, y: 4 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", onClick);
  }

  createButtons() {
    this.createBackButton(300, 500);

    this.add
      .text(450, 500, "RESET ATTACK", {
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.resetCurrentAttack());

    this.add
      .text(620, 500, "SAVE OFFSETS", {
        fontSize: "15px",
        color: "#001014",
        backgroundColor: "#35d0ff",
        padding: { x: 14, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.save());
  }

  createBackButton(x, y) {
    return this.add
      .text(x, y, "BACK", {
        fontSize: "15px",
        color: "#ffffff",
        backgroundColor: "#333333",
        padding: { x: 16, y: 8 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => this.back());
  }

  formatAttackName(key) {
    if (key === "main") return "MAIN";
    return key.replace("skill", "SKILL ");
  }

  getCurrentAttackEntry() {
    return this.attacks[this.attackIndex];
  }

  updateSelection() {
    const entry = this.getCurrentAttackEntry();
    if (!entry) return;

    this.attackTabTexts.forEach((tab, index) => {
      tab.setStyle({
        color: index === this.attackIndex ? "#001014" : "#dce6f5",
        backgroundColor: index === this.attackIndex ? "#35d0ff" : "#263145",
      });
    });

    this.paramRows.forEach((row, index) => {
      row.setFillStyle(index === this.paramIndex ? 0x263955 : 0x1d2636, 0.95);
      row.setStrokeStyle(1, index === this.paramIndex ? 0x35d0ff : 0x2f3b52);
    });

    this.clampCurrentFireFrame();
    this.updatePreview();
  }

  updatePreview() {
    const entry = this.getCurrentAttackEntry();
    if (!entry) return;

    const projectile = entry.attack.projectile;
    const { width, height, offsetX, offsetY, gravityY } = this.profile.body;
    this.showAttackFrame(entry.attack);

    const frameWidth = this.sprite.frame.width;
    const frameHeight = this.sprite.frame.height;

    this.sprite.body.setSize(width, height);
    this.sprite.body.setOffset(
      frameWidth / 2 - width / 2 + offsetX,
      frameHeight - height + offsetY,
    );
    this.sprite.body.setGravityY(gravityY);

    const bodyRect = this.getBodyRect();
    this.bodyBox.setPosition(bodyRect.x, bodyRect.y);
    this.bodyBox.setSize(bodyRect.width, bodyRect.height);

    const spawnX = bodyRect.x + (projectile.offsetX ?? 0);
    const spawnY = bodyRect.y + (projectile.offsetY ?? 0);
    this.spawnMarker.setPosition(spawnX, spawnY);
    this.spawnLine.setPosition(spawnX, spawnY);

    const texture = this.getExistingTextureKey(projectile.texture) || "fireball";
    this.projectilePreview.setTexture(texture);
    this.projectilePreview.setScale(projectile.scale || 1);
    this.projectilePreview.setPosition(spawnX, spawnY);

    this.valueLabels.offsetX.setText(String(projectile.offsetX ?? 0));
    this.valueLabels.offsetY.setText(String(projectile.offsetY ?? 0));
    this.valueLabels.fireFrame.setText(String(entry.attack.fireFrame ?? 1));

    this.attackInfoText.setText(
      `${this.formatAttackName(entry.key)}  anim: ${entry.attack.anim || "-"}  projectile: ${
        projectile.anim || projectile.texture || "-"
      }`,
    );
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

  adjustParam(paramIndex, direction) {
    this.paramIndex = paramIndex;
    const entry = this.getCurrentAttackEntry();
    if (!entry) return;

    const param = this.paramConfig[paramIndex];
    if (param.key === "fireFrame") {
      this.adjustFireFrame(direction);
      return;
    }

    const projectile = entry.attack.projectile;
    const current = projectile[param.key] ?? 0;
    projectile[param.key] = Phaser.Math.Clamp(
      current + direction * param.step,
      param.min,
      param.max,
    );
    this.updateSelection();
  }

  adjustFireFrame(direction) {
    const entry = this.getCurrentAttackEntry();
    if (!entry) return;

    const maxFrame = this.getAttackFrameCount(entry.attack);
    const current = entry.attack.fireFrame ?? 1;
    entry.attack.fireFrame = Phaser.Math.Clamp(current + direction, 1, maxFrame);
    this.paramIndex = 2;
    this.updateSelection();
  }

  clampCurrentFireFrame() {
    const entry = this.getCurrentAttackEntry();
    if (!entry) return;

    const maxFrame = this.getAttackFrameCount(entry.attack);
    entry.attack.fireFrame = Phaser.Math.Clamp(
      entry.attack.fireFrame ?? 1,
      1,
      maxFrame,
    );
  }

  getAttackFrameNames(attack) {
    if (!attack?.anim || !this.textures.exists(this.digimon)) return [];

    return this.textures
      .get(this.digimon)
      .getFrameNames()
      .filter((name) => name.startsWith(`${attack.anim}-`))
      .sort((a, b) => this.getFrameNumber(a) - this.getFrameNumber(b));
  }

  getFrameNumber(frameName) {
    const number = Number(frameName.split("-").pop());
    return Number.isFinite(number) ? number : 0;
  }

  getAttackFrameCount(attack) {
    return Math.max(1, this.getAttackFrameNames(attack).length);
  }

  showAttackFrame(attack) {
    const frameNames = this.getAttackFrameNames(attack);
    const frameIndex =
      Phaser.Math.Clamp(attack.fireFrame ?? 1, 1, frameNames.length) - 1;
    const frameName = frameNames[frameIndex];

    if (frameName) {
      this.sprite.anims.stop();
      this.sprite.setTexture(this.digimon, frameName);
      this.frameText.setText(`Attack frame ${frameIndex + 1}/${frameNames.length}`);
    } else {
      this.frameText.setText("Attack frame unavailable");
    }
  }

  resetCurrentAttack() {
    const entry = this.getCurrentAttackEntry();
    const baseEntry = this.baseAttacks.find((attack) => attack.key === entry?.key);
    if (!entry || !baseEntry) return;

    entry.attack.projectile.offsetX = baseEntry.attack.projectile.offsetX ?? 0;
    entry.attack.projectile.offsetY = baseEntry.attack.projectile.offsetY ?? 0;
    entry.attack.fireFrame = baseEntry.attack.fireFrame ?? 1;
    this.updateSelection();
    this.showMessage("Attack spawn data reset", "#ffff00");
  }

  save() {
    const saved = {};
    this.attacks.forEach(({ key, attack }) => {
      saved[key] = {
        offsetX: attack.projectile.offsetX ?? 0,
        offsetY: attack.projectile.offsetY ?? 0,
        fireFrame: attack.fireFrame ?? 1,
      };
    });

    localStorage.setItem(
      `digimon_${this.digimon}_projectiles`,
      JSON.stringify(saved),
    );
    this.showMessage("Projectile spawn data saved", "#35d0ff");
  }

  back() {
    this.scene.start("CharacterSelect");
  }

  showMessage(text, color = "#ffffff") {
    if (this.msg) this.msg.destroy();
    this.msg = this.add
      .text(480, 458, text, {
        fontSize: "15px",
        color,
      })
      .setOrigin(0.5);
    this.time.delayedCall(1400, () => {
      if (this.msg) this.msg.destroy();
    });
  }

  getExistingTextureKey(key) {
    if (!key) return null;
    if (this.textures.exists(key)) return key;
    if (key === "leafball" && this.textures.exists("vfx-leafball")) {
      return "vfx-leafball";
    }
    return null;
  }

  update() {
    if (!this.cursors || this.attacks.length === 0) return;

    if (Phaser.Input.Keyboard.JustDown(this.keys.escape)) {
      this.back();
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.save)) {
      this.save();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.reset)) {
      this.resetCurrentAttack();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.q)) {
      this.adjustFireFrame(-1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.e)) {
      this.adjustFireFrame(1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.a)) {
      this.attackIndex =
        (this.attackIndex - 1 + this.attacks.length) % this.attacks.length;
      this.updateSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys.d)) {
      this.attackIndex = (this.attackIndex + 1) % this.attacks.length;
      this.updateSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up)) {
      this.paramIndex = Math.max(0, this.paramIndex - 1);
      this.updateSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.down)) {
      this.paramIndex = Math.min(this.paramConfig.length - 1, this.paramIndex + 1);
      this.updateSelection();
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.adjustParam(this.paramIndex, -1);
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.adjustParam(this.paramIndex, 1);
    }
  }
}
