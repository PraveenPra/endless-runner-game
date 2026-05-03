import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";
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
  fontSize: 23,
  tint: 0x162032,
};

function buttonStyle(color, options = {}) {
  return {
    ...BUTTON_BASE,
    prefix: `button-${color}-v`,
    ...options,
  };
}

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  /* ───────────────── PRELOAD ───────────────── */

  /* ───────────────── CREATE ───────────────── */

  create() {
    this.initState();
    this.createLayout();
    this.createObstacleConfig();
    this.createCollectibleConfig();
    this.createAnimations();
    this.createBackground();
    this.createGround();
    this.createPlayer();
    this.createObstacles();
    this.createCollectibles();
    this.createUI();
    this.createCollisions();
    this.setupInput();
    this.startBackgroundMusic();
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () =>
      this.stopBackgroundMusic(),
    );
    this.startObstacleSpawner();
    this.startCollectibleSpawner();
  }

  /* ───────────────── STATE ───────────────── */

  initState() {
    // Reset session statistics in GameState for new game
    GameState.session = {
      score: 0,
      coins: 0,
      gems: 0,
      eggs: 0,
      distance: 0,
    };

    this.score = 0;
    this.coins = GameState.currency.coins;
    this.gems = GameState.currency.gems;
    this.eggs = GameState.currency.eggs;
    this.heldEggFrameIndex = GameState.hatchery.pendingEgg?.frameIndex ?? null;
    this.scoreSpeed = 0.01;
    this.gameOver = false;
    this.maxJumps = 2;
    this.jumpCount = 0;
    this.shieldHits = 0;
    this.maxShieldHits = 3;
    this.magnetActive = false;
    this.magnetDuration = 8000;
    this.speedBoostActive = false;
    this.speedBoostDuration = 8000;
    this.nextSpeedTrailAt = 0;
    this.evolutionActive = false;
    this.evolutionIntroActive = false;
    this.evolutionFreezeActive = false;
    this.evolutionDuration = 8000;
    this.evolutionIntroDuration = 1100;
    this.evolutionSpeedMultiplier = 2.2;
    this.evolutionIntroSpeedMultiplier = 0.08;
    this.activeDigimonKey = GameState.selectedDigimon || "agumon";
    this.baseDigimonKey = this.activeDigimonKey;
    this.baseObstacleSpeed = -120;
    this.currentObstacleSpeed = -120;
    this.projectileSpeedBoost = 1;
    this.nextAttackAt = 0;
    this.pendingAttackEvent = null;
    this.evolutionTimer = null;
    this.evolutionIntroTimer = null;
    this.frozenBodies = [];
    this.dustTrailTimer = null;
    this.mapConfig = getMapConfig(GameState.selectedMapKey);
  }

  createLayout() {
    const { width, height } = this.cameras.main;
    const baseWidth = 480;
    const baseHeight = 270;

    this.sceneWidth = width;
    this.sceneHeight = height;
    this.scaleX = width / baseWidth;
    this.scaleY = height / baseHeight;

    this.playerStartX = 100 * this.scaleX;
    this.playerStartY = 100 * this.scaleY;
    const groundConfig = this.mapConfig.ground || {};
    this.groundY = this.resolveMapY(groundConfig.y, 250);
    this.groundHeight = this.resolveMapHeight(groundConfig.height, 25);
    this.groundScaleY = groundConfig.scaleY ?? 1.8;
    this.groundTopY = this.getConfiguredGroundTopY(groundConfig);
    this.gameOverY = 120 * this.scaleY;
    this.restartY = 150 * this.scaleY;
    this.obstacleSpawnX = this.sceneWidth + 40;

    this.physics.world.setBounds(0, 0, width, height);
  }

  resolveMapX(value, fallback = 0) {
    return (value ?? fallback) * this.scaleX;
  }

  resolveMapY(value, fallback = 0) {
    return (value ?? fallback) * this.scaleY;
  }

  resolveMapWidth(value, fallback = 480) {
    return (value ?? fallback) * this.scaleX;
  }

  resolveMapHeight(value, fallback = 270) {
    return (value ?? fallback) * this.scaleY;
  }

  getConfiguredGroundTopY(groundConfig = this.mapConfig.ground || {}) {
    if (groundConfig.body) {
      return (
        this.resolveMapY(groundConfig.y, 250) +
        this.resolveMapY(groundConfig.body.offsetY, 0)
      );
    }

    const y = this.resolveMapY(groundConfig.y, 250);
    const height = this.resolveMapHeight(groundConfig.height, 25);
    const scaleY = groundConfig.scaleY ?? 1.8;
    const originY = groundConfig.originY ?? 0.5;
    return y - height * scaleY * originY;
  }

  /* ───────────────── CONFIG ───────────────── */

  createObstacleConfig() {
    this.obstacleTypes = [
      {
        id: "bala",
        sprite: "obstacle-moving-1",
        anim: "obstacle-moving-1-anim",
        frames: { start: 0, end: 2 },
        frameRate: 3,
        hp: 1,
      },
      {
        id: "bomba",
        sprite: "obstacle-moving-2",
        anim: "obstacle-moving-2-anim",
        frames: { start: 0, end: 4 },
        frameRate: 3,
        hp: 1,
      },
      {
        id: "bomba2",
        sprite: "obstacle-moving-3",
        anim: "obstacle-moving-3-anim",
        frames: { start: 0, end: 3 },
        frameRate: 3,
        hp: 1,
      },
      {
        id: "bombaex",
        sprite: "obstacle-moving-4",
        anim: "obstacle-moving-4-anim",
        frames: { start: 0, end: 2 },
        frameRate: 3,
        hp: 2,
      },
      {
        id: "estrelectra",
        sprite: "obstacle-moving-5",
        anim: "obstacle-moving-5-anim",
        frames: { start: 0, end: 3 },
        frameRate: 3,
        hp: 1,
      },
      {
        id: "mechagoomba",
        sprite: "obstacle-moving-6",
        anim: "obstacle-moving-6-anim",
        frames: { start: 0, end: 4 },
        frameRate: 3,
        hp: 2,
      },
      {
        id: "balota",
        sprite: "obstacle-static-1",
        anim: null,
        hp: 1,
      },
      {
        id: "brick",
        sprite: "obstacle-static-2",
        anim: null,
        hp: 1,
      },
      {
        id: "cactus",
        sprite: "obstacle-static-3",
        anim: null,
        hp: 1,
      },
    ];

    const mapObstacles = this.mapConfig.obstacles;
    if (Array.isArray(mapObstacles)) {
      this.obstacleTypes = this.obstacleTypes.filter((type) =>
        mapObstacles.includes(type.id),
      );
    }
  }

  createCollectibleConfig() {
    this.collectibleTypes = [
      {
        key: "silver-coin",
        sprite: "collectible-silver-coin",
        anim: "silver-coin-spin",
        frames: { start: 0, end: 4 },
        frameRate: 10,
        scale: 1,
        value: 1,
        kind: "coin",
        weight: 5,
      },
      {
        key: "gold-coin",
        sprite: "collectible-gold-coin",
        anim: "gold-coin-spin",
        frames: { start: 0, end: 4 },
        frameRate: 10,
        scale: 1,
        value: 2,
        kind: "coin",
        weight: 3,
      },
      {
        key: "green-gem",
        sprite: "collectible-gem-green",
        anim: "green-gem-spin",
        frames: { start: 0, end: 3 },
        frameRate: 8,
        scale: 1,
        value: 1,
        kind: "gem",
        weight: 2,
      },
      {
        key: "egg",
        sprite: "collectible-eggs",
        anim: null,
        scale: 0.3,
        value: 1,
        kind: "egg",
        weight: 3,
        useRandomFrame: true,
      },
      {
        key: "shield",
        sprite: "shield-powerup",
        anim: null,
        scale: 1,
        value: 1,
        kind: "shield",
        weight: 7,
      },
      {
        key: "magnet",
        sprite: "magnet-powerup",
        anim: null,
        scale: 1,
        value: 1,
        kind: "magnet",
        weight: 5,
      },
      {
        key: "speedboost",
        sprite: "speedboost-powerup",
        anim: null,
        scale: 1,
        value: 1,
        kind: "speedboost",
        weight: 5,
      },
      {
        key: "evolution",
        sprite: "evolution-powerup",
        anim: null,
        scale: 1.15,
        value: 1,
        kind: "evolution",
        weight: 4,
      },
    ];

    const groundTop = this.groundTopY;
    this.collectibleLanes = [
      groundTop - 34 * this.scaleY,
      groundTop - 72 * this.scaleY,
      groundTop - 108 * this.scaleY,
    ];

    this.eggLanes = [
      groundTop - 28 * this.scaleY,
      groundTop - 62 * this.scaleY,
    ];
  }

  /* ───────────────── ANIMATIONS ───────────────── */

  createAnimations() {
    const digimon = GameState.selectedDigimon || "agumon";

    createAnimations(this, digimon);

    this.collectibleTypes.forEach((type) => {
      if (!type.anim || this.anims.exists(type.anim)) return;

      this.anims.create({
        key: type.anim,
        frames: this.anims.generateFrameNumbers(type.sprite, type.frames),
        frameRate: type.frameRate,
        repeat: -1,
      });
    });

    this.obstacleTypes.forEach((o) => {
      if (!o.anim) return;

      this.anims.create({
        key: o.anim,
        frames: this.anims.generateFrameNumbers(o.sprite, o.frames),
        frameRate: o.frameRate,
        repeat: -1,
      });
    });

    this.createVFXAnimations();
  }

  createVFXAnimations() {
    const animations = [
      { key: "fireball_fly", texture: "fireball", frameRate: 12 },
      { key: "fireball", texture: "fireball", frameRate: 12 },
      { key: "impact-hit", texture: "impact-hit", frameRate: 14, repeat: 0 },
      {
        key: "sx-impact-hit",
        texture: "sx-impact-hit",
        frameRate: 14,
        repeat: 0,
      },
      {
        key: "vfx-fireblast",
        texture: "vfx-fireblast",
        frameRate: 12,
        repeat: 0,
      },
      {
        key: "vfx-explosion",
        texture: "vfx-explosion",
        frameRate: 14,
        repeat: 0,
      },
      { key: "vfx-windball", texture: "vfx-windball", frameRate: 12 },
      { key: "vfx-leafball", texture: "vfx-leafball", frameRate: 12 },
      { key: "vfx-rainbowball", texture: "vfx-rainbowball", frameRate: 12 },
      {
        key: "vfx-gnd-blast",
        texture: "vfx-gnd-blast",
        frameRate: 12,
        repeat: 0,
      },
      {
        key: "vfx-tiny-fire-impact",
        texture: "vfx-tiny-fire-impact",
        frameRate: 14,
        repeat: 0,
      },
      {
        key: "vfx-watergun-impact",
        texture: "vfx-watergun-impact",
        frameRate: 14,
        repeat: 0,
      },
      {
        key: "vfx-watergun-body",
        texture: "vfx-watergun-body",
        frameRate: 12,
      },
      {
        key: "vfx-watergun-stream",
        texture: "vfx-watergun-stream",
        frameRate: 12,
      },
      {
        key: "vfx-shield-pickup",
        texture: "vfx-shield-pickup",
        frameRate: 14,
      },
      {
        key: "vfx-shining-shield",
        texture: "vfx-shining-shield",
        frameRate: 14,
      },
      {
        key: "vfx-shining-shield-once",
        texture: "vfx-shining-shield",
        frameRate: 14,
        repeat: 0,
      },
    ];

    animations.forEach(({ key, texture, frameRate, repeat = -1 }) => {
      if (this.anims.exists(key) || !this.textures.exists(texture)) return;

      this.anims.create({
        key,
        frames: this.anims.generateFrameNumbers(texture),
        frameRate,
        repeat,
      });
    });
  }

  /* ───────────────── ENVIRONMENT ───────────────── */

  playSfx(key, config = {}) {
    const soundKey = key.startsWith("sfx-") ? key : `sfx-${key}`;
    if (!GameState.audio.sfxEnabled || !this.cache.audio.exists(soundKey))
      return null;

    const sound = this.sound.add(soundKey, {
      volume: GameState.audio.sfxVolume,
      ...config,
    });
    sound.play();
    sound.once("complete", () => sound.destroy());
    return sound;
  }

  startBackgroundMusic() {
    if (!GameState.audio.musicEnabled || !this.cache.audio.exists("music-bg-1"))
      return;

    const existingMusic = this.sound.get("music-bg-1");
    if (existingMusic?.isPlaying) {
      this.bgMusic = existingMusic;
      return;
    }

    this.bgMusic = this.sound.add("music-bg-1", {
      loop: true,
      volume: GameState.audio.musicVolume,
    });
    this.bgMusic.play();
  }

  stopBackgroundMusic() {
    if (this.bgMusic?.isPlaying) {
      this.bgMusic.stop();
    }
    this.bgMusic = null;
  }

  stopGameplaySfx() {
    [
      "sfx-blast-hit",
      "sfx-collect-shard",
      "sfx-evolution",
      "sfx-hurt",
      "sfx-impact",
      "sfx-jump",
      "sfx-jump1",
    ].forEach((key) => {
      this.sound.stopByKey(key);
    });
  }

  createBackground() {
    this.backgroundLayers = [];

    this.mapConfig.backgrounds.forEach((layer) => {
      if (!this.textures.exists(layer.key)) return;

      const x = this.resolveMapX(layer.x, 0);
      const y = this.resolveMapY(layer.y, 0);
      const width = this.resolveMapWidth(layer.width, 480);
      const height = this.resolveMapHeight(layer.height, 270);
      const sprite = this.add
        .tileSprite(x, y, width, height, layer.key)
        .setOrigin(layer.originX ?? 0, layer.originY ?? 0)
        .setScale(layer.scaleX ?? 1, layer.scaleY ?? 1)
        .setDepth(layer.depth ?? 0)
        .setAlpha(layer.alpha ?? 1);

      sprite.tileScaleX = layer.tileScaleX ?? 1;
      sprite.tileScaleY = layer.tileScaleY ?? 1;
      sprite.tilePositionX = layer.tilePositionX ?? 0;
      sprite.tilePositionY = layer.tilePositionY ?? 0;

      this.backgroundLayers.push({
        sprite,
        scrollSpeed: layer.scrollSpeed || 0,
      });
    });
  }

  createGround() {
    const groundConfig = this.mapConfig.ground || {};
    const groundKey = groundConfig.key || "ground";
    const x = this.resolveMapX(groundConfig.x, 240);
    const y = this.resolveMapY(groundConfig.y, 250);
    const width = this.resolveMapWidth(groundConfig.width, 480);
    const height = this.resolveMapHeight(groundConfig.height, 25);
    const scaleX = groundConfig.scaleX ?? 1;
    const scaleY = groundConfig.scaleY ?? 1.8;

    this.ground = this.add
      .tileSprite(x, y, width, height, groundKey)
      .setOrigin(groundConfig.originX ?? 0.5, groundConfig.originY ?? 0.5)
      .setScale(scaleX, scaleY)
      .setDepth(groundConfig.depth ?? 5);

    this.ground.tileScaleX = groundConfig.tileScaleX ?? 1;
    this.ground.tileScaleY = groundConfig.tileScaleY ?? 1;
    this.ground.tilePositionX = groundConfig.tilePositionX ?? 0;
    this.ground.tilePositionY = groundConfig.tilePositionY ?? 0;
    this.groundScrollSpeed = groundConfig.scrollSpeed ?? 2;

    this.physics.add.existing(this.ground, true);

    if (groundConfig.body) {
      const bodyWidth = this.resolveMapWidth(
        groundConfig.body.width,
        width / this.scaleX,
      );
      const bodyHeight = this.resolveMapHeight(
        groundConfig.body.height,
        height / this.scaleY,
      );
      const offsetX = this.resolveMapX(groundConfig.body.offsetX, 0);
      const offsetY = this.resolveMapY(groundConfig.body.offsetY, 0);

      this.ground.body.setSize(bodyWidth, bodyHeight);
      this.ground.body.setOffset(offsetX, offsetY);
    }

    if (this.ground.body.refreshBody) {
      this.ground.body.refreshBody();
    }

    this.groundTopY = this.ground.body?.top ?? this.ground.getBounds().top;
  }

  /* ───────────────── PLAYER ───────────────── */

  createPlayer() {
    const digimon = this.activeDigimonKey;
    const profile = resolveProfile(digimon);
    this.playerProfile = profile;
    this.playerProjectileAttack = this.resolveProjectileAttack(profile);

    this.player = this.physics.add.sprite(
      this.playerStartX,
      this.playerStartY,
      digimon,
    );
    this.player.setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);
    this.applyPlayerProfile(profile, 1);

    this.player.play(`${digimon}_run`);

    this.player.on("animationcomplete", (anim) => {
      if (
        anim.key === `${this.activeDigimonKey}_jump` ||
        anim.key === this.getAttackAnimationKey()
      ) {
        this.playPlayerRun();
      }
    });
  }

  applyPlayerProfile(profile, visualScale = 1) {
    const { body } = profile;
    const frameWidth = this.player.frame.width;
    const frameHeight = this.player.frame.height;

    this.player.setScale(visualScale);
    this.player.body.setSize(
      body.width * visualScale,
      body.height * visualScale,
    );
    this.player.body.setOffset(
      frameWidth / 2 - (body.width * visualScale) / 2 + body.offsetX,
      frameHeight - body.height * visualScale + body.offsetY,
    );
    this.player.body.setGravityY(body.gravityY);
    this.player.body.setCollideWorldBounds(true);
  }

  playPlayerRun() {
    const runKey = `${this.activeDigimonKey}_run`;
    if (this.anims.exists(runKey)) {
      this.player.play(runKey, true);
    }
  }

  resolveProjectileAttack(profile) {
    return Object.values(profile.attacks || {}).find(
      (attack) => attack && attack.type === "projectile" && attack.projectile,
    );
  }

  getAttackAnimationKey() {
    const anim = this.playerProjectileAttack?.anim;
    return anim ? `${this.activeDigimonKey}_${anim}` : null;
  }

  /* ───────────────── OBSTACLES ───────────────── */

  createObstacles() {
    this.obstacles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
  }

  createProjectiles() {
    this.projectiles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
  }

  createCollectibles() {
    this.collectibles = this.physics.add.group({
      allowGravity: false,
      immovable: true,
    });
  }

  startObstacleSpawner() {
    this.spawnObstacle();
  }

  startCollectibleSpawner() {
    this.spawnCollectible();
  }

  spawnObstacle() {
    if (this.gameOver) return;
    if (this.evolutionFreezeActive) {
      this.time.delayedCall(160, this.spawnObstacle, [], this);
      return;
    }

    const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);
    if (!type) return;

    const obs = this.obstacles.create(this.obstacleSpawnX, 0, type.sprite);

    obs.maxHp = type.hp || 1;
    obs.hp = obs.maxHp;
    obs.obstacleType = type;
    obs.setOrigin(type.originX ?? 0.5, type.originY ?? 0.5);
    obs.setScale(type.scale ?? 1);
    obs.body.setSize(obs.width * 0.7, obs.height * 0.8);
    obs.body.setOffset(obs.width * 0.15, obs.height * 0.2);
    this.placeObstacleOnGround(obs, type);
    obs.setVelocityX(this.currentObstacleSpeed);

    if (type.anim) obs.play(type.anim);

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2200),
      callback: this.spawnObstacle,
      callbackScope: this,
    });
  }

  placeObstacleOnGround(obstacle, type = {}) {
    const groundTop = this.getGroundTopY();
    const offsetY = (type.groundOffsetY || 0) * this.scaleY;
    const bottomOffset = obstacle.displayHeight * (1 - obstacle.originY);

    obstacle.setY(groundTop - bottomOffset + offsetY);
  }

  getGroundTopY() {
    return this.ground?.body?.top ?? this.groundTopY ?? this.groundY;
  }

  spawnCollectible() {
    if (this.gameOver) return;
    if (this.evolutionFreezeActive) {
      this.time.delayedCall(160, this.spawnCollectible, [], this);
      return;
    }

    const weightedTypes = this.collectibleTypes.flatMap((type) =>
      Array(type.weight).fill(type),
    );
    const type = Phaser.Utils.Array.GetRandom(weightedTypes);
    const lanes = type.kind === "egg" ? this.eggLanes : this.collectibleLanes;
    const y = Phaser.Utils.Array.GetRandom(lanes);

    if (type.kind === "coin") {
      this.spawnCoinRow(type, y);
    } else {
      this.createCollectibleInstance(type, this.obstacleSpawnX, y);
    }

    this.time.addEvent({
      delay: Phaser.Math.Between(1100, 2200),
      callback: this.spawnCollectible,
      callbackScope: this,
    });
  }

  spawnCoinRow(type, y) {
    const count = Phaser.Math.Between(5, 9);
    const spacing = 24 * this.scaleX;
    const pattern = Phaser.Utils.Array.GetRandom([
      "line",
      "rise",
      "fall",
      "arc",
    ]);

    for (let i = 0; i < count; i += 1) {
      const x = this.obstacleSpawnX + i * spacing;
      let offsetY = 0;

      if (pattern === "rise") {
        offsetY = -i * 5 * this.scaleY;
      } else if (pattern === "fall") {
        offsetY = i * 5 * this.scaleY;
      } else if (pattern === "arc") {
        const center = (count - 1) / 2;
        offsetY = (Math.abs(i - center) - center) * 9 * this.scaleY;
      }

      this.createCollectibleInstance(type, x, y + offsetY);
    }
  }

  createCollectibleInstance(type, x, y) {
    const collectible = this.collectibles.create(x, y, type.sprite);

    collectible.collectibleType = type;
    collectible.setScale(type.scale);
    collectible.setVelocityX(this.currentObstacleSpeed);

    if (type.useRandomFrame) {
      const frameIndex = Phaser.Math.Between(0, 49);
      collectible.eggFrameIndex = frameIndex;
      collectible.setFrame(frameIndex);
    } else if (type.anim) {
      collectible.play(type.anim);
    }

    this.placeCollectibleAboveGround(collectible);

    collectible.body.setSize(
      collectible.width * 0.55,
      collectible.height * 0.55,
    );
    collectible.body.setOffset(
      collectible.width * 0.225,
      collectible.height * 0.225,
    );

    if (type.kind !== "egg") {
      this.tweens.add({
        targets: collectible,
        y: y - 8 * this.scaleY,
        duration: 450,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    return collectible;
  }

  placeCollectibleAboveGround(collectible) {
    const groundTop = this.getGroundTopY();
    const clearance = 6 * this.scaleY;
    const maxY = groundTop - collectible.displayHeight * 0.5 - clearance;

    if (collectible.y > maxY) {
      collectible.y = maxY;
    }
  }

  /* ───────────────── UI ───────────────── */

  createUI() {
    this.hudPanel = createPanel(this, 176, 58, 330, 104, {
      ...PANEL,
      depth: 50,
      alpha: 0.9,
    });

    this.add.image(34, 23, "icons", "icon-trophy").setScale(0.9).setDepth(52);
    this.scoreText = createBitmapLabel(this, 56, 24, "SCORE: 0", {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(52);

    this.add.image(34, 51, "icons", "icon-circle").setScale(0.9).setDepth(52);
    this.coinText = createBitmapLabel(this, 56, 52, `COINS: ${this.coins}`, {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(52);

    this.add.image(34, 79, "icons", "icon-diamond").setScale(0.9).setDepth(52);
    this.gemText = createBitmapLabel(this, 56, 80, `GEMS: ${this.gems}`, {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(52);

    this.eggText = createBitmapLabel(this, 212, 24, "EGG: NONE", {
      font: UI_FONT,
      size: 18,
      tint: 0xf7ffe8,
      originX: 0,
    }).setDepth(52);
    this.eggSlot = this.add
      .sprite(288, 68, "collectible-eggs")
      .setScale(0.32)
      .setDepth(52)
      .setVisible(false);
    this.updateHeldEggIndicator();

    this.powerPanel = createPanel(this, this.sceneWidth - 138, 56, 250, 100, {
      ...PANEL,
      depth: 50,
      alpha: 0.86,
    });
    this.powerPanel.setVisible(false);

    this.shieldText = createBitmapLabel(
      this,
      this.sceneWidth - 238,
      24,
      "SHIELD: 0",
      {
        font: UI_FONT,
        size: 17,
        tint: 0xf7ffe8,
        originX: 0,
      },
    ).setDepth(52);
    this.shieldText.setVisible(false);

    this.magnetText = createBitmapLabel(
      this,
      this.sceneWidth - 238,
      46,
      "MAGNET",
      {
        font: UI_FONT,
        size: 17,
        tint: 0xf7ffe8,
        originX: 0,
      },
    ).setDepth(52);
    this.magnetText.setVisible(false);

    this.speedBoostText = createBitmapLabel(
      this,
      this.sceneWidth - 238,
      68,
      "SPEED",
      {
        font: UI_FONT,
        size: 17,
        tint: 0xf7ffe8,
        originX: 0,
      },
    ).setDepth(52);
    this.speedBoostText.setVisible(false);

    this.evolutionText = createBitmapLabel(
      this,
      this.sceneWidth - 238,
      90,
      "RAMPAGE",
      {
        font: UI_FONT,
        size: 17,
        tint: 0xf7ffe8,
        originX: 0,
      },
    ).setDepth(52);
    this.evolutionText.setVisible(false);

    this.createGameOverUI();
  }

  createGameOverUI() {
    this.gameOverItems = [];

    this.gameOverOverlay = this.add
      .rectangle(
        this.sceneWidth / 2,
        this.sceneHeight / 2,
        this.sceneWidth,
        this.sceneHeight,
        0x000000,
        0.45,
      )
      .setDepth(90)
      .setVisible(false);

    this.gameOverPanel = createPanel(
      this,
      this.sceneWidth / 2,
      this.sceneHeight / 2,
      560,
      392,
      {
        ...PANEL,
        depth: 91,
        alpha: 0.97,
      },
    );
    this.gameOverPanel.setVisible(false);

    this.gameOverText = createBitmapLabel(
      this,
      this.sceneWidth / 2,
      118,
      "GAME OVER",
      {
        font: UI_FONT,
        size: 44,
        tint: 0xf7ffe8,
      },
    )
      .setDepth(92)
      .setVisible(false);

    const rows = [
      ["finalScoreText", "SCORE: 0", 174, "icon-trophy"],
      ["highScoreText", "BEST: 0", 206, "icon-star"],
      ["coinsEarnedText", "COINS: 0", 238, "icon-circle"],
      ["gemsEarnedText", "GEMS: 0", 270, "icon-diamond"],
      ["eggsEarnedText", "EGGS: 0", 302, "icon-key"],
      ["distanceText", "DISTANCE: 0", 334, "icon-flag"],
    ];
    this.gameOverStatIcons = [];

    rows.forEach(([prop, text, y, icon]) => {
      const statIcon = this.add
        .image(this.sceneWidth / 2 - 125, y, "icons", icon)
        .setScale(1)
        .setDepth(92)
        .setVisible(false);
      this.gameOverStatIcons.push(statIcon);

      this[prop] = createBitmapLabel(this, this.sceneWidth / 2 - 100, y, text, {
        font: UI_FONT,
        size: 22,
        tint: 0xf7ffe8,
        originX: 0,
      })
        .setDepth(92)
        .setVisible(false);
    });

    this.restartText = createButton(
      this,
      this.sceneWidth / 2 - 120,
      422,
      190,
      44,
      "RESTART",
      () => {
        this.scene.restart();
      },
      {
        ...buttonStyle("lime", {
          icon: "icon-right-arrow",
          iconSize: 18,
          textX: 15,
        }),
        depth: 92,
      },
    );
    this.menuText = createButton(
      this,
      this.sceneWidth / 2 + 120,
      422,
      190,
      44,
      "MENU",
      () => {
        this.scene.start("MainMenuScene");
      },
      {
        ...buttonStyle("gray", {
          icon: "icon-left-arrow",
          iconSize: 18,
          textX: 14,
        }),
        depth: 92,
      },
    );

    this.gameOverItems = [
      this.gameOverOverlay,
      this.gameOverPanel,
      this.gameOverText,
      this.finalScoreText,
      this.highScoreText,
      this.coinsEarnedText,
      this.gemsEarnedText,
      this.eggsEarnedText,
      this.distanceText,
      ...this.gameOverStatIcons,
      this.restartText,
      this.menuText,
    ];
    this.gameOverItems.forEach((item) => item.setVisible(false));
  }

  /* ───────────────── COLLISIONS ───────────────── */

  createCollisions() {
    this.physics.add.collider(this.player, this.ground);
    // this.ground.setImmovable(true);

    this.physics.add.collider(
      this.player,
      this.obstacles,
      (player, obstacle) => {
        this.handleObstacleHit(obstacle);
      },
    );

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      (_, collectible) => {
        this.collectCollectible(collectible);
      },
    );

    this.createProjectiles();

    this.physics.add.overlap(
      this.projectiles,
      this.obstacles,
      (projectile, obstacle) => {
        this.handleProjectileObstacleHit(projectile, obstacle);
      },
    );
  }

  collectCollectible(collectible) {
    if (!collectible || !collectible.active || this.gameOver) return;

    const type = collectible.collectibleType;
    if (!type) {
      collectible.destroy();
      return;
    }

    if (type.kind === "coin") {
      this.coins += type.value;
      GameState.currency.addCoins(type.value);
      setBitmapLabelText(this.coinText, `COINS: ${this.coins}`, UI_FONT);
    } else if (type.kind === "gem") {
      this.gems += type.value;
      GameState.currency.addGems(type.value);
      setBitmapLabelText(this.gemText, `GEMS: ${this.gems}`, UI_FONT);
    } else if (type.kind === "egg") {
      this.collectEgg(collectible);
    } else if (type.kind === "shield") {
      this.collectShield();
    } else if (type.kind === "magnet") {
      this.activateMagnet();
    } else if (type.kind === "speedboost") {
      this.activateSpeedBoost();
    } else if (type.kind === "evolution") {
      this.activateEvolution();
    }

    collectible.destroy();

    this.playSfx("collect-shard", { volume: 0.35 });
  }

  collectShield() {
    if (this.shieldHits < this.maxShieldHits) {
      this.shieldHits = this.maxShieldHits;
      this.updateShieldIndicator();
    }
  }

  activateMagnet() {
    this.magnetActive = true;
    this.magnetTimer = this.time.addEvent({
      delay: this.magnetDuration,
      callback: () => {
        this.magnetActive = false;
        if (this.magnetText) {
          this.magnetText.setVisible(false);
        }
      },
      callbackScope: this,
    });
    this.updatePowerUpIndicator();
  }

  activateSpeedBoost() {
    this.speedBoostActive = true;
    this.updateWorldSpeed();
    this.time.addEvent({
      delay: this.speedBoostDuration,
      callback: () => {
        this.speedBoostActive = false;
        this.updateWorldSpeed();
        if (this.speedBoostText) {
          this.speedBoostText.setVisible(false);
        }
      },
      callbackScope: this,
    });
    this.updatePowerUpIndicator();
  }

  collectEgg(collectible) {
    const frameIndex =
      collectible.eggFrameIndex ?? collectible.frame?.name ?? 0;
    const eggFrameIndex = Number(frameIndex) || 0;
    const saved = GameState.hatchery.savePendingEgg({
      frameIndex: eggFrameIndex,
      rarity: "found",
      collectedAt: Date.now(),
    });

    if (!saved) {
      this.showPickupMessage("HATCHERY FULL");
      return;
    }

    this.heldEggFrameIndex = eggFrameIndex;
    GameState.currency.addEggs(1);
    this.updateHeldEggIndicator();
  }

  showPickupMessage(text) {
    const message = createBitmapLabel(
      this,
      this.player.x,
      this.player.y - 70 * this.scaleY,
      text.toUpperCase(),
      {
        font: UI_FONT,
        size: 18,
        tint: 0xff7777,
      },
    ).setDepth(54);

    this.tweens.add({
      targets: message,
      y: message.y - 22 * this.scaleY,
      alpha: 0,
      duration: 850,
      onComplete: () => message.destroy(),
    });
  }

  updateHeldEggIndicator() {
    if (!this.eggText || !this.eggSlot) return;

    const hasEgg = this.heldEggFrameIndex !== null;
    setBitmapLabelText(this.eggText, hasEgg ? "EGG: READY" : "EGG: NONE", UI_FONT);
    this.eggSlot.setVisible(hasEgg);
    if (hasEgg) {
      this.eggSlot.setFrame(this.heldEggFrameIndex);
    }
  }

  updateWorldSpeed() {
    if (this.evolutionFreezeActive) {
      this.obstacles?.children.iterate((o) => {
        if (o && o.active) o.setVelocityX(0);
      });
      this.collectibles?.children.iterate((c) => {
        if (c && c.active) c.setVelocityX(0);
      });
      this.projectiles?.children.iterate((p) => {
        if (p && p.active) p.setVelocityX(0);
      });
      return;
    }

    const speedBoostMultiplier = this.speedBoostActive ? 1.8 : 1;
    const evolutionMultiplier = this.evolutionActive
      ? this.evolutionSpeedMultiplier
      : 1;
    const introMultiplier = this.evolutionIntroActive
      ? this.evolutionIntroSpeedMultiplier
      : 1;

    this.currentObstacleSpeed =
      this.baseObstacleSpeed *
      speedBoostMultiplier *
      evolutionMultiplier *
      introMultiplier;

    this.obstacles.children.iterate((o) => {
      if (o && o.active) {
        o.setVelocityX(this.currentObstacleSpeed);
      }
    });
    this.collectibles.children.iterate((c) => {
      if (c && c.active) {
        c.setVelocityX(this.currentObstacleSpeed);
      }
    });
  }

  activateEvolution() {
    const baseProfile = resolveProfile(this.baseDigimonKey);
    const nextDigimonKey = baseProfile?.evolution?.next;
    const targetDigimonKey =
      nextDigimonKey && this.textures.exists(nextDigimonKey)
        ? nextDigimonKey
        : this.baseDigimonKey;

    if (this.evolutionTimer) {
      this.evolutionTimer.remove(false);
    }
    if (this.evolutionIntroTimer) {
      this.evolutionIntroTimer.remove(false);
    }
    if (this.dustTrailTimer) {
      this.dustTrailTimer.remove(false);
    }

    this.evolutionActive = true;
    this.evolutionIntroActive = true;
    this.pendingEvolutionDigimonKey = targetDigimonKey;
    this.anchorPlayerRunPosition();
    this.beginEvolutionFreeze();
    this.updateWorldSpeed();
    this.playEvolutionVFX(() => this.finishEvolutionIntro());

    this.updatePowerUpIndicator();
  }

  finishEvolutionIntro() {
    if (!this.evolutionActive || this.gameOver) return;

    this.revealEvolutionForm();
    this.endEvolutionFreeze();
    this.evolutionIntroActive = false;
    this.updateWorldSpeed();

    this.dustTrailTimer = this.time.addEvent({
      delay: 90,
      callback: this.spawnDustTrail,
      callbackScope: this,
      loop: true,
    });

    this.evolutionTimer = this.time.addEvent({
      delay: this.evolutionDuration,
      callback: this.deactivateEvolution,
      callbackScope: this,
    });
  }

  revealEvolutionForm() {
    if (!this.pendingEvolutionDigimonKey) return;

    this.switchPlayerForm(this.pendingEvolutionDigimonKey, 1.35);
    this.pendingEvolutionDigimonKey = null;
    this.anchorPlayerRunPosition();
  }

  deactivateEvolution() {
    this.evolutionActive = false;
    this.evolutionIntroActive = false;
    this.endEvolutionFreeze();
    this.switchPlayerForm(this.baseDigimonKey, 1);
    this.anchorPlayerRunPosition();
    this.updateWorldSpeed();

    if (this.evolutionIntroTimer) {
      this.evolutionIntroTimer.remove(false);
      this.evolutionIntroTimer = null;
    }
    if (this.dustTrailTimer) {
      this.dustTrailTimer.remove(false);
      this.dustTrailTimer = null;
    }
    this.pendingEvolutionDigimonKey = null;
    if (this.evolutionText) {
      this.evolutionText.setVisible(false);
    }
  }

  switchPlayerForm(digimonKey, visualScale) {
    if (!this.textures.exists(digimonKey)) return;

    createAnimations(this, digimonKey);

    const wasOnGround =
      this.player.body.blocked.down || this.player.body.touching.down;
    const previousVelocityY = this.player.body.velocity.y;
    const previousX = this.player.x;
    const previousY = this.player.y;
    const profile = resolveProfile(digimonKey);

    this.activeDigimonKey = digimonKey;
    this.playerProfile = profile;
    this.playerProjectileAttack = this.resolveProjectileAttack(profile);
    this.player.setTexture(digimonKey);
    this.player.setPosition(previousX, previousY);
    this.applyPlayerProfile(profile, visualScale);
    this.player.setVelocityY(wasOnGround ? 0 : previousVelocityY);
    this.playPlayerRun();
  }

  anchorPlayerRunPosition() {
    if (!this.player || !this.player.active) return;

    this.player.setVelocityX(0);
    this.player.x = this.playerStartX;
  }

  beginEvolutionFreeze() {
    if (this.evolutionFreezeActive) return;

    this.evolutionFreezeActive = true;
    this.frozenBodies = [];
    this.frozenPlayer = null;

    if (this.player?.body) {
      this.frozenPlayer = {
        velocityX: this.player.body.velocity.x,
        velocityY: this.player.body.velocity.y,
        allowGravity: this.player.body.allowGravity,
      };
      this.player.setVelocity(0, 0);
      this.player.body.setAllowGravity(false);
    }

    [this.obstacles, this.collectibles, this.projectiles].forEach((group) => {
      group?.children.iterate((item) => {
        if (!item?.body) return;

        this.frozenBodies.push({
          item,
          velocityX: item.body.velocity.x,
          velocityY: item.body.velocity.y,
        });
        item.setVelocity(0, 0);
      });
    });
  }

  endEvolutionFreeze() {
    if (!this.evolutionFreezeActive) return;

    this.evolutionFreezeActive = false;
    if (this.player?.body && this.frozenPlayer) {
      this.player.body.setAllowGravity(this.frozenPlayer.allowGravity);
      this.player.setVelocity(this.frozenPlayer.velocityX, this.frozenPlayer.velocityY);
    }
    this.frozenPlayer = null;

    this.frozenBodies.forEach(({ item, velocityX, velocityY }) => {
      if (!item?.active || !item.body) return;
      item.setVelocity(velocityX, velocityY);
    });
    this.frozenBodies = [];
    this.updateWorldSpeed();
  }

  playEvolutionVFX(onComplete) {
    let pending = 1;
    let completed = false;
    const done = () => {
      pending -= 1;
      if (pending > 0 || completed) return;
      completed = true;
      onComplete?.();
    };

    const evolutionSfx = this.playSfx("evolution", { volume: 0.4 });
    if (evolutionSfx) {
      pending += 1;
      evolutionSfx.once("complete", done);
    }

    this.cameras.main.shake(260, 0.012);
    this.cameras.main.flash(160, 255, 245, 130);

    const burst = this.add.sprite(
      this.player.x,
      this.player.y - 35 * this.scaleY,
      "vfx-gnd-blast",
    );
    burst.setDepth(25);
    burst.setScale(2.2);
    if (this.anims.exists("vfx-gnd-blast")) {
      burst.play("vfx-gnd-blast");
      burst.once("animationcomplete", () => burst.destroy());
    } else {
      this.time.delayedCall(180, () => burst.destroy());
    }

    if (this.textures.exists("vfx-shining-shield")) {
      pending += 1;
      const bodyCenter = this.getPlayerBodyCenter();
      const shine = this.add.sprite(
        bodyCenter.x,
        bodyCenter.y,
        "vfx-shining-shield",
      );
      shine.setDepth(26);
      shine.setScale(2.35);

      if (this.anims.exists("vfx-shining-shield-once")) {
        shine.play("vfx-shining-shield-once");
        shine.once("animationcomplete", () => {
          this.revealEvolutionForm();
          shine.destroy();
          done();
        });
      } else {
        this.time.delayedCall(this.evolutionIntroDuration, () => {
          this.revealEvolutionForm();
          shine.destroy();
          done();
        });
      }
    }

    this.time.delayedCall(this.evolutionIntroDuration, done);
  }

  spawnDustTrail() {
    if (!this.evolutionActive || !this.player || !this.player.active) return;

    const dust = this.add.sprite(
      this.player.x - 20 * this.scaleX,
      this.player.y - 8 * this.scaleY,
      "vfx-gnd-blast",
    );
    dust.setDepth(8);
    dust.setAlpha(0.55);
    dust.setScale(0.8);

    if (this.anims.exists("vfx-gnd-blast")) {
      dust.play("vfx-gnd-blast");
      dust.once("animationcomplete", () => dust.destroy());
    } else {
      this.tweens.add({
        targets: dust,
        alpha: 0,
        scale: 1.25,
        x: dust.x - 18 * this.scaleX,
        duration: 220,
        onComplete: () => dust.destroy(),
      });
    }
  }

  updateSpeedBoostTrail() {
    if (
      !this.speedBoostActive ||
      !this.player ||
      !this.player.active ||
      this.time.now < this.nextSpeedTrailAt
    ) {
      return;
    }

    this.nextSpeedTrailAt = this.time.now + 45;
    const bodyRect = this.getPlayerBodyRect();
    const lineCount = Phaser.Math.Between(2, 3);

    for (let i = 0; i < lineCount; i += 1) {
      const y =
        bodyRect.y + Phaser.Math.FloatBetween(0.18, 0.82) * bodyRect.height;
      const length = Phaser.Math.Between(22, 42) * this.scaleX;
      const x = bodyRect.x - Phaser.Math.Between(8, 18) * this.scaleX;
      const line = this.add.graphics();
      const color = Phaser.Utils.Array.GetRandom([0xffffff, 0x8ff3ff, 0xfff28f]);

      line.setDepth(9);
      line.lineStyle(Phaser.Math.Between(1, 2), color, 0.82);
      line.beginPath();
      line.moveTo(x, y);
      line.lineTo(x - length, y + Phaser.Math.Between(-2, 2) * this.scaleY);
      line.strokePath();

      this.tweens.add({
        targets: line,
        x: line.x - 48 * this.scaleX,
        alpha: 0,
        duration: 180,
        ease: "Quad.easeOut",
        onComplete: () => line.destroy(),
      });
    }
  }

  updatePowerUpIndicator() {
    if (this.magnetText) {
      this.magnetText.setVisible(this.magnetActive);
    }

    if (this.speedBoostText) {
      this.speedBoostText.setVisible(this.speedBoostActive);
    }

    if (this.evolutionText) {
      this.evolutionText.setVisible(this.evolutionActive);
    }

    this.updatePowerPanelVisibility();
  }

  updatePowerPanelVisibility() {
    if (!this.powerPanel) return;

    this.powerPanel.setVisible(
      this.shieldHits > 0 ||
        this.magnetActive ||
        this.speedBoostActive ||
        this.evolutionActive,
    );
  }

  updateShieldIndicator() {
    if (this.shieldHits > 0 && !this.shieldSprite) {
      const position = this.getShieldVFXPosition();
      this.shieldSprite = this.add.sprite(
        position.x,
        position.y,
        "vfx-shield-pickup",
      );
      this.shieldSprite.setDepth(22);
      this.shieldSprite.setScale(0.82);

      if (this.anims.exists("vfx-shield-pickup")) {
        this.shieldSprite.play("vfx-shield-pickup");
      }
    }

    if (this.shieldSprite) {
      const position = this.getShieldVFXPosition();
      this.shieldSprite.setVisible(this.shieldHits > 0);
      this.shieldSprite.setPosition(position.x, position.y);
      if (this.shieldSprite.texture.key !== "vfx-shield-pickup") {
        this.shieldSprite.setTexture("vfx-shield-pickup");
      }
      if (
        this.shieldHits > 0 &&
        this.anims.exists("vfx-shield-pickup") &&
        this.shieldSprite.anims.currentAnim?.key !== "vfx-shield-pickup"
      ) {
        this.shieldSprite.play("vfx-shield-pickup");
      }
    }

    if (this.shieldText) {
      setBitmapLabelText(this.shieldText, `SHIELD: ${this.shieldHits}`, UI_FONT);
      this.shieldText.setVisible(this.shieldHits > 0);
    }

    this.updatePowerPanelVisibility();
  }

  getShieldVFXPosition() {
    const bodyRect = this.getPlayerBodyRect();
    return {
      x: bodyRect.x + bodyRect.width + 8 * this.scaleX,
      y: bodyRect.y + bodyRect.height * 0.52,
    };
  }

  getPlayerBodyCenter() {
    const bodyRect = this.getPlayerBodyRect();
    return {
      x: bodyRect.x + bodyRect.width * 0.5,
      y: bodyRect.y + bodyRect.height * 0.5,
    };
  }

  updateMagnetAttraction() {
    const magnetRange = 150 * this.scaleX;
    const target = this.getPlayerMagnetTarget();

    this.collectibles.children.iterate((coin) => {
      if (!coin || !coin.active) return;
      if (coin.collectibleType && coin.collectibleType.kind === "coin") {
        const dist = Phaser.Math.Distance.Between(
          target.x,
          target.y,
          coin.x,
          coin.y,
        );
        if (dist < magnetRange) {
          if (dist < 18 * this.scaleX) {
            this.collectCollectible(coin);
            return;
          }

          const angle = Phaser.Math.Angle.Between(
            coin.x,
            coin.y,
            target.x,
            target.y,
          );
          const speed = 420 + (magnetRange - dist) * 3;
          this.tweens.killTweensOf(coin);
          coin.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
      }
    });
  }

  getPlayerMagnetTarget() {
    if (!this.player?.body) {
      return { x: this.player.x, y: this.player.y };
    }

    return {
      x: this.player.body.center.x,
      y: this.player.body.center.y,
    };
  }

  handleObstacleHit(obstacle) {
    if (!obstacle || !obstacle.active || obstacle.isBreaking) return;

    if (this.evolutionActive) {
      this.anchorPlayerRunPosition();
      this.breakObstacle(obstacle);
      this.anchorPlayerRunPosition();
      return;
    }

    if (this.shieldHits > 0) {
      this.shieldHits--;
      this.updateShieldIndicator();
      this.breakObstacle(obstacle);

      this.anchorPlayerRunPosition();

      this.cameras.main.shake(100, 0.01);
      this.cameras.main.flash(100, 100, 200, 255);
    } else {
      this.triggerGameOver();
    }
  }

  breakObstacle(obstacle) {
    if (!obstacle || !obstacle.active || obstacle.isBreaking) return;
    obstacle.isBreaking = true;

    const x = obstacle.x;
    const y = obstacle.y;
    const impactKey = this.textures.exists("vfx-explosion")
      ? "vfx-explosion"
      : "impact-hit";

    if (obstacle.body) {
      obstacle.body.enable = false;
      obstacle.setVelocity(0, 0);
    }
    obstacle.setActive(false);
    obstacle.setVisible(false);
    this.time.delayedCall(0, () => {
      if (obstacle && !obstacle.destroyed) obstacle.destroy();
    });
    this.spawnImpactVFX(x, y, impactKey);
    this.cameras.main.shake(120, 0.009);

    this.playSfx("impact", { volume: 0.45 });
  }

  handleProjectileObstacleHit(projectile, obstacle) {
    if (
      !projectile ||
      !projectile.active ||
      !obstacle ||
      !obstacle.active ||
      this.gameOver
    ) {
      return;
    }

    obstacle.hp = (obstacle.hp || 1) - (projectile.damage || 1);
    this.spawnImpactVFX(projectile.x, projectile.y, projectile.impactVFX);
    this.playSfx("impact", { volume: 0.35 });
    projectile.destroy();

    if (obstacle.hp <= 0) {
      obstacle.destroy();
    } else {
      obstacle.setTint(0xffdddd);
      this.time.delayedCall(80, () => {
        if (obstacle && obstacle.active) obstacle.clearTint();
      });
    }
  }

  spawnImpactVFX(x, y, key) {
    if (!key || !this.textures.exists(key)) return;

    const impact = this.add.sprite(x, y, key);
    impact.setDepth(20);

    if (this.anims.exists(key)) {
      impact.play(key);
      impact.once("animationcomplete", () => impact.destroy());
    } else {
      this.time.delayedCall(120, () => impact.destroy());
    }
  }

  triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;
    this.stopBackgroundMusic();
    this.stopGameplaySfx();
    this.playSfx("gameover", { volume: 0.55 });

    // Update session statistics in GameState
    GameState.session.score = Math.floor(this.score);
    GameState.session.coins = this.coins;
    GameState.session.gems = this.gems;
    GameState.session.eggs = this.eggs;
    GameState.session.distance = Math.floor(this.score); // Distance based on score

    // Check and update high score
    if (GameState.session.score > GameState.highScore) {
      GameState.highScore = GameState.session.score;
      // Save high score to localStorage
      try {
        localStorage.setItem("highScore", GameState.highScore.toString());
      } catch (e) {
        // Ignore localStorage errors
      }
    }

    this.player.setVelocity(0);
    this.player.anims.pause();

    this.obstacles.children.iterate((o) => {
      if (!o) return;
      o.setVelocityX(0);
      if (o.anims) o.anims.pause();
    });

    if (this.projectiles) {
      this.projectiles.children.iterate((projectile) => {
        if (!projectile) return;
        projectile.setVelocityX(0);
        if (projectile.anims) projectile.anims.pause();
      });
    }

    this.collectibles.children.iterate((coin) => {
      if (!coin) return;
      coin.setVelocityX(0);
      if (coin.anims) coin.anims.pause();
    });

    this.time.removeAllEvents();

    this.gameOverItems.forEach((item) => item.setVisible(true));

    // Display statistics
    setBitmapLabelText(this.finalScoreText, `SCORE: ${GameState.session.score}`, UI_FONT);
    setBitmapLabelText(this.highScoreText, `BEST: ${GameState.highScore}`, UI_FONT);
    setBitmapLabelText(
      this.coinsEarnedText,
      `COINS: ${GameState.session.coins}`,
      UI_FONT,
    );
    setBitmapLabelText(this.gemsEarnedText, `GEMS: ${GameState.session.gems}`, UI_FONT);
    setBitmapLabelText(this.eggsEarnedText, `EGGS: ${GameState.session.eggs}`, UI_FONT);
    setBitmapLabelText(
      this.distanceText,
      `DISTANCE: ${GameState.session.distance}`,
      UI_FONT,
    );
  }

  /* ───────────────── INPUT ───────────────── */

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.attackKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.Z,
    );
  }

  /* ───────────────── UPDATE ───────────────── */

  update() {
    if (!this.gameOver) {
      if (this.evolutionFreezeActive) {
        this.updateShieldIndicator();
        this.updatePowerUpIndicator();
        return;
      }

      this.updateJumpState();
      this.updateScore();
      this.handleJump();
      this.handleAttack();
      this.scrollWorld();
      this.cleanupObstacles();
      this.cleanupProjectiles();
      this.cleanupCollectibles();
      this.updateShieldIndicator();
      this.updatePowerUpIndicator();
      this.updateSpeedBoostTrail();
      if (this.magnetActive) {
        this.updateMagnetAttraction();
      }
    }

    if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
      this.scene.restart();
    }
  }

  updateScore() {
    this.score += this.scoreSpeed;
    setBitmapLabelText(this.scoreText, `SCORE: ${Math.floor(this.score)}`, UI_FONT);
  }

  updateJumpState() {
    if (this.player.body.blocked.down || this.player.body.touching.down) {
      this.jumpCount = 0;
    }
  }

  handleJump() {
    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
      this.jumpCount < this.maxJumps
    ) {
      this.jumpCount += 1;
      this.player.setVelocityY(-600);
      const jumpKey = `${this.activeDigimonKey}_jump`;
      if (this.anims.exists(jumpKey)) {
        this.player.play(jumpKey, true);
      }
      this.playSfx("jump");
    }
  }

  handleAttack() {
    if (!this.attackKey || !Phaser.Input.Keyboard.JustDown(this.attackKey)) {
      return;
    }

    this.fireProjectileAttack();
  }

  fireProjectileAttack() {
    const attack = this.playerProjectileAttack;
    if (!attack || this.time.now < this.nextAttackAt) return;

    this.nextAttackAt = this.time.now + (attack.cooldown || 500);

    const attackAnimKey = this.getAttackAnimationKey();
    if (attackAnimKey && this.anims.exists(attackAnimKey)) {
      this.player.play(attackAnimKey, true);
    }

    this.playSfx("hurt", { volume: 0.35 });

    const frameRate = 10;
    const fireFrame = Math.max(1, attack.fireFrame || 1);
    const fireDelay = attackAnimKey ? ((fireFrame - 1) * 1000) / frameRate : 0;

    if (this.pendingAttackEvent) {
      this.pendingAttackEvent.remove(false);
    }

    this.pendingAttackEvent = this.time.delayedCall(
      fireDelay,
      () => {
        this.spawnPlayerProjectile(attack);
        this.pendingAttackEvent = null;
      },
      [],
      this,
    );
  }

  spawnPlayerProjectile(attack) {
    if (this.gameOver || !this.player || !this.player.active) return;

    const projectileData = attack.projectile || {};
    const texture =
      this.getExistingTextureKey(projectileData.texture) ||
      this.getExistingTextureKey(projectileData.anim);

    if (!texture) return;

    const spawnPoint = this.getProjectileSpawnPoint(projectileData);
    const projectile = this.projectiles.create(
      spawnPoint.x,
      spawnPoint.y,
      texture,
    );
    const scale = projectileData.scale || 1;

    projectile.setOrigin(0.5, 0.5);
    projectile.damage = attack.damage || Math.ceil(attack.power || 1);
    projectile.impactVFX = attack.impactVFX || projectileData.impactVFX;
    projectile.setScale(scale);
    projectile.setDepth(15);
    projectile.setVelocityX(
      (projectileData.speed || 260) * this.projectileSpeedBoost,
    );

    const animKey = projectileData.anim;
    if (animKey && this.anims.exists(animKey)) {
      projectile.play(animKey);
    }

    if (projectile.body) {
      const bodyWidth = Math.max(4, projectile.width * 0.7);
      const bodyHeight = Math.max(4, projectile.height * 0.7);
      projectile.body.setSize(bodyWidth, bodyHeight, true);
    }

    this.time.delayedCall(projectileData.lifetime || 1200, () => {
      if (projectile && projectile.active) projectile.destroy();
    });
  }

  getProjectileSpawnPoint(projectileData) {
    const offsetX = projectileData.offsetX ?? 18;
    const offsetY = projectileData.offsetY ?? 18;
    const bodyRect = this.getPlayerBodyRect();

    return {
      x: bodyRect.x + offsetX,
      y: bodyRect.y + offsetY,
    };
  }

  getPlayerBodyRect() {
    const body = this.player.body;
    const displayOriginX = this.player.displayOriginX * this.player.scaleX;
    const displayOriginY = this.player.displayOriginY * this.player.scaleY;

    return {
      x: this.player.x + body.offset.x * this.player.scaleX - displayOriginX,
      y: this.player.y + body.offset.y * this.player.scaleY - displayOriginY,
      width: body.width,
      height: body.height,
    };
  }

  getExistingTextureKey(key) {
    if (!key) return null;
    if (this.textures.exists(key)) return key;
    if (key === "leafball" && this.textures.exists("vfx-leafball")) {
      return "vfx-leafball";
    }
    return null;
  }

  scrollWorld() {
    const speedScale = Math.abs(
      this.currentObstacleSpeed / this.baseObstacleSpeed,
    );
    this.ground.tilePositionX += this.groundScrollSpeed * speedScale;
    this.backgroundLayers.forEach((layer) => {
      layer.sprite.tilePositionX += layer.scrollSpeed * speedScale;
    });
  }

  cleanupObstacles() {
    this.obstacles.children.iterate((o) => {
      if (o && o.x < -50) o.destroy();
    });
  }

  cleanupProjectiles() {
    if (!this.projectiles) return;

    this.projectiles.children.iterate((projectile) => {
      if (projectile && projectile.x > this.sceneWidth + 80) {
        projectile.destroy();
      }
    });
  }

  cleanupCollectibles() {
    this.collectibles.children.iterate((coin) => {
      if (coin && coin.x < -50) coin.destroy();
    });
  }
}
