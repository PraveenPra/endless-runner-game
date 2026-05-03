import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";
import * as DIGIMON_PROFILES from "../entities/digimon/DigimonProfiles/index.js";
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
  fontSize: 20,
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
    this.adjustHoldDelay = 220;
    this.adjustHoldInterval = 85;
    this.nextAdjustAt = 0;
    this.activeAdjustDirection = 0;

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
    this.add.rectangle(480, 272, 960, 544, 0x08111f);
    createPanel(this, 480, 54, 720, 88, { ...PANEL, depth: 2, alpha: 0.96 });
    this.add.image(190, 36, "icons", "icon-circle").setScale(1.35).setDepth(6);

    createBitmapLabel(this, 480, 36, `EDIT PROJECTILES: ${this.formatDigimonName(this.digimon)}`, {
      font: UI_FONT,
      size: 27,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, 480, 66, "OFFSETS MEASURE FROM RED BODY BOX", {
      font: UI_FONT,
      size: 18,
      tint: 0x9fd8ff,
    }).setDepth(6);
  }

  createEmptyState() {
    createPanel(this, 480, 270, 560, 150, { ...PANEL, depth: 3, alpha: 0.94 });
    this.add.image(310, 248, "icons", "icon-dialog").setScale(1.4).setDepth(6);
    createBitmapLabel(this, 500, 248, "NO PROJECTILE ATTACKS FOUND", {
      font: UI_FONT,
      size: 22,
      tint: 0xf7ffe8,
    }).setDepth(6);

    createBitmapLabel(this, 480, 292, "ADD A PROJECTILE ATTACK TO EDIT OFFSETS", {
      font: UI_FONT,
      size: 17,
      tint: 0x9aa9b8,
    }).setDepth(6);

    this.createBackButton(480, 500);
  }

  createPreview() {
    this.previewX = 285;
    this.groundY = 345;

    createPanel(this, 300, 302, 500, 342, { ...PANEL, depth: 2, alpha: 0.9 });
    const ground = this.add.rectangle(300, this.groundY, 430, 4, 0x566070);
    ground.setDepth(7);
    createBitmapLabel(this, 300, 144, "BODY-RELATIVE SPAWN PREVIEW", {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
    }).setDepth(6);

    this.sprite = this.physics.add.sprite(
      this.previewX,
      this.groundY,
      this.digimon,
    );
    this.sprite.setOrigin(0.5, 1);
    this.sprite.setDepth(8);
    this.sprite.body.setAllowGravity(false);
    this.sprite.body.moves = false;

    this.bodyBox = this.add.rectangle(0, 0, 1, 1, 0xff3b30, 0.22);
    this.bodyBox.setOrigin(0, 0);
    this.bodyBox.setStrokeStyle(2, 0xff3b30);
    this.bodyBox.setDepth(9);

    this.spawnMarker = this.add.circle(0, 0, 5, 0x35d0ff, 1);
    this.spawnMarker.setStrokeStyle(2, 0xffffff);
    this.spawnMarker.setDepth(11);
    this.spawnLine = this.add.line(0, 0, 0, 0, 56, 0, 0x35d0ff, 0.8);
    this.spawnLine.setOrigin(0, 0.5);
    this.spawnLine.setDepth(10);

    this.projectilePreview = this.add.sprite(0, 0, "fireball");
    this.projectilePreview.setOrigin(0.5);
    this.projectilePreview.setDepth(12);

    this.frameText = createBitmapLabel(this, 300, 392, "", {
      font: UI_FONT,
      size: 16,
      tint: 0xf7ffe8,
    }).setDepth(6);
  }

  createAttackTabs() {
    this.attackTabTexts = [];
    const startX = 480 - (this.attacks.length - 1) * 54;

    this.attacks.forEach(({ key }, index) => {
      const tab = createButton(
        this,
        startX + index * 108,
        106,
        100,
        34,
        this.formatAttackName(key),
        () => {
          this.attackIndex = index;
          this.updateSelection();
        },
        {
          ...buttonStyle("gray", {
            fontSize: 16,
          }),
          depth: 7,
        },
      );

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
    const startX = 600;
    const startY = 188;

    createPanel(this, 735, 302, 390, 342, { ...PANEL, depth: 2, alpha: 0.94 });
    this.add.image(startX - 20, 144, "icons", "icon-fine-tune").setScale(1).setDepth(6);
    createBitmapLabel(this, startX + 12, 144, "SPAWN POSITION", {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(6);

    this.attackInfoText = createBitmapLabel(this, startX, 166, "", {
      font: UI_FONT,
      size: 14,
      tint: 0x9aa9b8,
      originX: 0,
    }).setDepth(6);

    this.paramConfig.forEach((param, index) => {
      const y = startY + index * 58;
      const row = this.add.rectangle(startX + 122, y, 305, 40, 0x1d2636, 0.9);
      row.setStrokeStyle(1, 0x2f3b52);
      this.paramRows.push(row);

      createBitmapLabel(this, startX, y, param.name.toUpperCase(), {
        font: UI_FONT,
        size: 17,
        tint: 0xf7ffe8,
        originX: 0,
      }).setDepth(6);

      this.valueLabels[param.key] = createBitmapLabel(this, startX + 160, y, "0", {
        font: UI_FONT,
        size: 18,
        tint: 0x9fd8ff,
      }).setDepth(6);

      this.createAdjustButton(startX + 238, y, "-", () =>
        this.adjustParam(index, -1),
      );
      this.createAdjustButton(startX + 282, y, "+", () =>
        this.adjustParam(index, 1),
      );
    });

    createBitmapLabel(this, 735, 374, "A/D ATTACK   UP/DOWN FIELD", {
      font: UI_FONT,
      size: 14,
      tint: 0x9aa9b8,
    }).setDepth(6);
    createBitmapLabel(this, 735, 396, "LEFT/RIGHT OR HOLD +/- TO ADJUST", {
      font: UI_FONT,
      size: 14,
      tint: 0x9aa9b8,
    }).setDepth(6);

    this.createAdjustButton(startX + 56, 332, "PREV", () =>
      this.adjustFireFrame(-1),
    );
    this.createAdjustButton(startX + 190, 332, "NEXT", () =>
      this.adjustFireFrame(1),
    );
  }

  createAdjustButton(x, y, label, onClick) {
    const isIcon = label === "-" || label === "+";
    if (isIcon) {
      return createButton(this, x, y, 34, 32, "", onClick, {
        ...iconButtonStyle("yellow", label === "+" ? "icon-plus" : "icon-minus", {
          iconSize: 17,
        }),
        repeat: true,
        repeatDelay: 85,
        depth: 8,
      });
    }

    return createButton(this, x, y, 96, 34, label, onClick, {
      ...buttonStyle("yellow", {
        fontSize: 17,
      }),
      depth: 8,
    });
  }

  createButtons() {
    this.createBackButton(320, 508);

    createButton(this, 500, 508, 176, 42, "RESET ATTACK", () => this.resetCurrentAttack(), {
      ...buttonStyle("red", {
        icon: "icon-multiply",
        iconSize: 18,
        textX: 16,
        fontSize: 18,
      }),
      depth: 8,
    });

    createButton(this, 690, 508, 168, 42, "SAVE OFFSETS", () => this.save(), {
      ...buttonStyle("lime", {
        icon: "icon-tick",
        iconSize: 18,
        textX: 16,
        fontSize: 18,
      }),
      depth: 8,
    });
  }

  createBackButton(x, y) {
    return createButton(this, x, y, 128, 42, "BACK", () => this.back(), {
      ...buttonStyle("gray", {
        icon: "icon-left-arrow",
        iconSize: 18,
        textX: 14,
      }),
      depth: 8,
    });
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
      const selected = index === this.attackIndex;
      tab.setAlpha(selected ? 1 : 0.62);
      tab.setScale(selected ? 1.06 : 1);
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

    setBitmapLabelText(
      this.attackInfoText,
      `${this.formatAttackName(entry.key)}  ANIM: ${this.cleanInfo(entry.attack.anim)}  VFX: ${
        this.cleanInfo(
        projectile.anim || projectile.texture || "-"
        )
      }`,
      UI_FONT,
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
      setBitmapLabelText(this.frameText, `ATTACK FRAME ${frameIndex + 1}/${frameNames.length}`, UI_FONT);
    } else {
      setBitmapLabelText(this.frameText, "ATTACK FRAME UNAVAILABLE", UI_FONT);
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
    this.showMessage("ATTACK SPAWN DATA RESET", 0xffdf72);
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
    this.showMessage("PROJECTILE SPAWN DATA SAVED", 0x9dffb2);
  }

  back() {
    this.scene.start("CharacterSelect");
  }

  showMessage(text, tint = 0xf7ffe8) {
    if (this.msg) this.msg.destroy();
    this.msg = createBitmapLabel(this, 480, 458, text.toUpperCase(), {
      font: UI_FONT,
      size: 20,
      tint,
    }).setDepth(9);
    this.time.delayedCall(1400, () => {
      if (this.msg) this.msg.destroy();
    });
  }

  formatDigimonName(key) {
    return key
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/-/g, " ")
      .toUpperCase();
  }

  cleanInfo(value) {
    return String(value || "-")
      .replace(/[_-]/g, " ")
      .toUpperCase();
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

    this.handleAdjustInput();
  }

  handleAdjustInput() {
    const now = this.time.now;
    const leftDown = this.cursors.left.isDown;
    const rightDown = this.cursors.right.isDown;

    if (Phaser.Input.Keyboard.JustDown(this.cursors.left)) {
      this.adjustParam(this.paramIndex, -1);
      this.activeAdjustDirection = -1;
      this.nextAdjustAt = now + this.adjustHoldDelay;
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.cursors.right)) {
      this.adjustParam(this.paramIndex, 1);
      this.activeAdjustDirection = 1;
      this.nextAdjustAt = now + this.adjustHoldDelay;
      return;
    }

    if (leftDown && !rightDown) {
      if (this.activeAdjustDirection !== -1) {
        this.activeAdjustDirection = -1;
        this.nextAdjustAt = now + this.adjustHoldDelay;
      } else if (now >= this.nextAdjustAt) {
        this.adjustParam(this.paramIndex, -1);
        this.nextAdjustAt = now + this.adjustHoldInterval;
      }
      return;
    }

    if (rightDown && !leftDown) {
      if (this.activeAdjustDirection !== 1) {
        this.activeAdjustDirection = 1;
        this.nextAdjustAt = now + this.adjustHoldDelay;
      } else if (now >= this.nextAdjustAt) {
        this.adjustParam(this.paramIndex, 1);
        this.nextAdjustAt = now + this.adjustHoldInterval;
      }
      return;
    }

    this.activeAdjustDirection = 0;
  }
}
