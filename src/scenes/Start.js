import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";
import { getMapConfig } from "../config/maps.js";

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
    this.evolutionActive = false;
    this.evolutionIntroActive = false;
    this.evolutionDuration = 8000;
    this.evolutionIntroDuration = 850;
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
    this.groundY = 250 * this.scaleY;
    this.groundHeight = 25;
    this.groundScaleY = 1.8;
    this.gameOverY = 120 * this.scaleY;
    this.restartY = 150 * this.scaleY;
    this.obstacleSpawnX = this.sceneWidth + 40;

    this.physics.world.setBounds(0, 0, width, height);
  }

  /* ───────────────── CONFIG ───────────────── */

  createObstacleConfig() {
    this.obstacleTypes = [
      {
        sprite: "obstacle-moving-1",
        anim: "obstacle-moving-1-anim",
        frames: { start: 0, end: 2 },
        frameRate: 3,
        y: 220 * this.scaleY,
        hp: 1,
      },
      {
        sprite: "obstacle-moving-2",
        anim: "obstacle-moving-2-anim",
        frames: { start: 0, end: 4 },
        frameRate: 3,
        y: 220 * this.scaleY,
        hp: 1,
      },
      {
        sprite: "obstacle-moving-3",
        anim: "obstacle-moving-3-anim",
        frames: { start: 0, end: 3 },
        frameRate: 3,
        y: 220 * this.scaleY,
        hp: 1,
      },
      {
        sprite: "obstacle-moving-4",
        anim: "obstacle-moving-4-anim",
        frames: { start: 0, end: 2 },
        frameRate: 3,
        y: 220 * this.scaleY,
        hp: 2,
      },
      {
        sprite: "obstacle-moving-5",
        anim: "obstacle-moving-5-anim",
        frames: { start: 0, end: 3 },
        frameRate: 3,
        y: 220 * this.scaleY,
        hp: 1,
      },
      {
        sprite: "obstacle-moving-6",
        anim: "obstacle-moving-6-anim",
        frames: { start: 0, end: 4 },
        frameRate: 3,
        y: 220 * this.scaleY,
        hp: 2,
      },
      {
        sprite: "obstacle-static-1",
        anim: null,
        y: 220 * this.scaleY,
        hp: 1,
      },
    ];
  }

  createCollectibleConfig() {
    this.collectibleTypes = [
      {
        key: "silver-coin",
        sprite: "collectible-silver-coin",
        anim: "silver-coin-spin",
        frames: { start: 0, end: 4 },
        frameRate: 10,
        scale: 0.8,
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
        scale: 0.8,
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
        scale: 0.7,
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
        scale: 0.6,
        value: 1,
        kind: "shield",
        weight: 7,
      },
      {
        key: "magnet",
        sprite: "magnet-powerup",
        anim: null,
        scale: 0.6,
        value: 1,
        kind: "magnet",
        weight: 5,
      },
      {
        key: "speedboost",
        sprite: "speedboost-powerup",
        anim: null,
        scale: 0.6,
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

    this.collectibleLanes = [
      this.groundY - 30 * this.scaleY,
      this.groundY - 80 * this.scaleY,
      this.groundY - 130 * this.scaleY,
    ];

    this.eggLanes = [
      this.groundY - 18 * this.scaleY,
      this.groundY - 55 * this.scaleY,
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

  createBackground() {
    this.backgroundLayers = [];

    this.mapConfig.backgrounds.forEach((layer) => {
      if (!this.textures.exists(layer.key)) return;

      const y = (layer.y || 0) * this.scaleY;
      const height = (layer.height || 270) * this.scaleY;
      const sprite = this.add
        .tileSprite(0, y, this.sceneWidth, height, layer.key)
        .setOrigin(0, 0);

      this.backgroundLayers.push({
        sprite,
        scrollSpeed: layer.scrollSpeed || 0,
      });
    });
  }

  createGround() {
    const groundKey = this.mapConfig.ground?.key || "ground";

    this.ground = this.add
      .tileSprite(
        this.sceneWidth / 2,
        this.groundY,
        this.sceneWidth,
        this.groundHeight,
        groundKey,
      )
      .setScale(1, this.groundScaleY);

    this.physics.add.existing(this.ground, true);
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

    const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);
    const obs = this.obstacles.create(this.obstacleSpawnX, type.y, type.sprite);

    obs.maxHp = type.hp || 1;
    obs.hp = obs.maxHp;
    obs.obstacleType = type;
    obs.body.setSize(obs.width * 0.7, obs.height * 0.8);
    obs.body.setOffset(obs.width * 0.15, obs.height * 0.2);
    obs.setVelocityX(this.currentObstacleSpeed);

    if (type.anim) obs.play(type.anim);

    this.time.addEvent({
      delay: Phaser.Math.Between(1000, 2200),
      callback: this.spawnObstacle,
      callbackScope: this,
    });
  }

  spawnCollectible() {
    if (this.gameOver) return;

    const weightedTypes = this.collectibleTypes.flatMap((type) =>
      Array(type.weight).fill(type),
    );
    const type = Phaser.Utils.Array.GetRandom(weightedTypes);
    const lanes = type.kind === "egg" ? this.eggLanes : this.collectibleLanes;
    const y = Phaser.Utils.Array.GetRandom(lanes);
    const collectible = this.collectibles.create(
      this.obstacleSpawnX,
      y,
      type.sprite,
    );

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

    this.time.addEvent({
      delay: Phaser.Math.Between(1100, 2200),
      callback: this.spawnCollectible,
      callbackScope: this,
    });
  }

  /* ───────────────── UI ───────────────── */

  createUI() {
    this.scoreText = this.add.text(10, 10, "SCORE: 0", {
      fontSize: "14px",
      fill: "#fff",
    });

    this.coinText = this.add.text(10, 32, "COINS: 0", {
      fontSize: "14px",
      fill: "#ffd54a",
    });

    this.gemText = this.add.text(10, 54, "GEMS: 0", {
      fontSize: "14px",
      fill: "#6cff8f",
    });

    this.eggText = this.add.text(10, 76, "EGG:", {
      fontSize: "14px",
      fill: "#ffdcaa",
    });
    this.eggSlot = this.add
      .sprite(58, 84, "collectible-eggs")
      .setScale(0.32)
      .setVisible(false);
    this.updateHeldEggIndicator();

    this.shieldText = this.add.text(10, 98, "SHIELD: 0", {
      fontSize: "14px",
      fill: "#4fc3f7",
    });
    this.shieldText.setVisible(false);

    this.magnetText = this.add.text(150, 10, "MAGNET", {
      fontSize: "14px",
      fill: "#ff6f00",
    });
    this.magnetText.setVisible(false);

    this.speedBoostText = this.add.text(150, 32, "SPEED", {
      fontSize: "14px",
      fill: "#76ff03",
    });
    this.speedBoostText.setVisible(false);

    this.evolutionText = this.add.text(150, 54, "RAMPAGE", {
      fontSize: "14px",
      fill: "#ffeb3b",
    });
    this.evolutionText.setVisible(false);

    this.gameOverText = this.add
      .text(this.sceneWidth / 2, this.gameOverY, "GAME OVER", {
        fontSize: "24px",
        fill: "#ff4444",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.restartText = this.add
      .text(this.sceneWidth / 2, this.restartY, "SPACE: Restart", {
        fontSize: "12px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.menuText = this.add
      .text(
        this.sceneWidth / 2,
        this.restartY + 26 * this.scaleY,
        "MAIN MENU",
        {
          fontSize: "13px",
          fill: "#000000",
          backgroundColor: "#ffdcaa",
          padding: { x: 12, y: 6 },
        },
      )
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.menuText.on("pointerdown", () => {
      this.scene.start("MainMenuScene");
    });

    // Game over statistics text
    this.finalScoreText = this.add
      .text(this.sceneWidth / 2, this.gameOverY + 40, "", {
        fontSize: "16px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.highScoreText = this.add
      .text(this.sceneWidth / 2, this.gameOverY + 60, "", {
        fontSize: "16px",
        fill: "#ffd700", // Gold color for high score
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.coinsEarnedText = this.add
      .text(this.sceneWidth / 2, this.gameOverY + 80, "", {
        fontSize: "14px",
        fill: "#ffd54a",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.gemsEarnedText = this.add
      .text(this.sceneWidth / 2, this.gameOverY + 100, "", {
        fontSize: "14px",
        fill: "#6cff8f",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.eggsEarnedText = this.add
      .text(this.sceneWidth / 2, this.gameOverY + 120, "", {
        fontSize: "14px",
        fill: "#ffdcaa",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.distanceText = this.add
      .text(this.sceneWidth / 2, this.gameOverY + 140, "", {
        fontSize: "14px",
        fill: "#87ceeb", // Sky blue for distance
      })
      .setOrigin(0.5)
      .setVisible(false);
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
      this.coinText.setText("COINS: " + this.coins);
    } else if (type.kind === "gem") {
      this.gems += type.value;
      GameState.currency.addGems(type.value);
      this.gemText.setText("GEMS: " + this.gems);
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

    if (this.sound.get("sfx-collect-shard")) {
      this.sound.play("sfx-collect-shard", { volume: 0.35 });
    }
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
        if (this.magnetSprite) {
          this.magnetSprite.setVisible(false);
        }
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
        if (this.speedBoostSprite) {
          this.speedBoostSprite.setVisible(false);
        }
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
    const message = this.add
      .text(this.player.x, this.player.y - 70 * this.scaleY, text, {
        fontSize: "12px",
        fill: "#ff7777",
      })
      .setOrigin(0.5)
      .setDepth(40);

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
    this.eggText.setText(hasEgg ? "EGG:" : "EGG: NONE");
    this.eggSlot.setVisible(hasEgg);
    if (hasEgg) {
      this.eggSlot.setFrame(this.heldEggFrameIndex);
    }
  }

  updateWorldSpeed() {
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
    this.switchPlayerForm(targetDigimonKey, 1.35);
    this.anchorPlayerRunPosition();
    this.updateWorldSpeed();
    this.playEvolutionVFX();

    this.evolutionIntroTimer = this.time.addEvent({
      delay: this.evolutionIntroDuration,
      callback: () => {
        this.evolutionIntroActive = false;
        this.updateWorldSpeed();
      },
      callbackScope: this,
    });

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

    this.updatePowerUpIndicator();
  }

  deactivateEvolution() {
    this.evolutionActive = false;
    this.evolutionIntroActive = false;
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
    if (this.evolutionSprite) {
      this.evolutionSprite.setVisible(false);
    }
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

  playEvolutionVFX() {
    if (this.sound.get("sfx-evolution")) {
      this.sound.play("sfx-evolution", { volume: 0.4 });
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

  updatePowerUpIndicator() {
    if (this.magnetActive && !this.magnetSprite) {
      this.magnetSprite = this.add.sprite(
        this.player.x + 20 * this.scaleX,
        this.player.y - 30 * this.scaleY,
        "magnet-powerup",
      );
      this.magnetSprite.setScale(0.7);
    }
    if (this.magnetSprite) {
      this.magnetSprite.setVisible(this.magnetActive);
      this.magnetSprite.x = this.player.x + 20 * this.scaleX;
      this.magnetSprite.y = this.player.y - 25 * this.scaleY;
    }
    if (this.magnetText) {
      this.magnetText.setVisible(this.magnetActive);
    }

    if (this.speedBoostActive && !this.speedBoostSprite) {
      this.speedBoostSprite = this.add.sprite(
        this.player.x - 20 * this.scaleX,
        this.player.y - 30 * this.scaleY,
        "speedboost-powerup",
      );
      this.speedBoostSprite.setScale(0.7);
    }
    if (this.speedBoostSprite) {
      this.speedBoostSprite.setVisible(this.speedBoostActive);
      this.speedBoostSprite.x = this.player.x - 20 * this.scaleX;
      this.speedBoostSprite.y = this.player.y - 25 * this.scaleY;
    }
    if (this.speedBoostText) {
      this.speedBoostText.setVisible(this.speedBoostActive);
    }

    if (this.evolutionActive && !this.evolutionSprite) {
      this.evolutionSprite = this.add.sprite(
        this.player.x,
        this.player.y - 58 * this.scaleY,
        "evolution-powerup",
      );
      this.evolutionSprite.setScale(0.65);
    }
    if (this.evolutionSprite) {
      this.evolutionSprite.setVisible(this.evolutionActive);
      this.evolutionSprite.x = this.player.x;
      this.evolutionSprite.y = this.player.y - 55 * this.scaleY;
    }
    if (this.evolutionText) {
      this.evolutionText.setVisible(this.evolutionActive);
    }
  }

  updateShieldIndicator() {
    if (this.shieldHits > 0 && !this.shieldSprite) {
      this.shieldSprite = this.add.sprite(
        this.player.x,
        this.player.y - 30 * this.scaleY,
        "shield-powerup",
      );
      this.shieldSprite.setScale(0.8);

      this.tweens.add({
        targets: this.shieldSprite,
        angle: 360,
        duration: 1500,
        repeat: -1,
        ease: "Linear",
      });

      this.tweens.add({
        targets: this.shieldSprite,
        y: this.player.y - 35 * this.scaleY,
        duration: 300,
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    if (this.shieldSprite) {
      this.shieldSprite.setVisible(this.shieldHits > 0);
      this.shieldSprite.x = this.player.x;
      this.shieldSprite.y = this.player.y - 25 * this.scaleY;
    }

    if (this.shieldText) {
      this.shieldText.setText("SHIELD: " + this.shieldHits);
      this.shieldText.setVisible(this.shieldHits > 0);
    }
  }

  updateMagnetAttraction() {
    const magnetRange = 150 * this.scaleX;
    this.collectibles.children.iterate((coin) => {
      if (!coin || !coin.active) return;
      if (coin.collectibleType && coin.collectibleType.kind === "coin") {
        const dist = Phaser.Math.Distance.Between(
          this.player.x,
          this.player.y,
          coin.x,
          coin.y,
        );
        if (dist < magnetRange) {
          const angle = Phaser.Math.Angle.Between(
            coin.x,
            coin.y,
            this.player.x,
            this.player.y,
          );
          const speed = 300 + (magnetRange - dist) * 2;
          coin.setVelocity(Math.cos(angle) * speed, Math.sin(angle) * speed);
        }
      }
    });
  }

  handleObstacleHit(obstacle) {
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
    if (!obstacle || !obstacle.active) return;

    const x = obstacle.x;
    const y = obstacle.y;
    const impactKey = this.textures.exists("vfx-explosion")
      ? "vfx-explosion"
      : "impact-hit";

    obstacle.destroy();
    this.spawnImpactVFX(x, y, impactKey);
    this.cameras.main.shake(120, 0.009);

    if (this.sound.get("sfx-blast-hit")) {
      this.sound.play("sfx-blast-hit", { volume: 0.25 });
    }
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

    this.gameOverText.setVisible(true);
    this.restartText.setVisible(true);
    this.menuText.setVisible(true);

    // Display statistics
    this.finalScoreText
      .setText("SCORE: " + GameState.session.score)
      .setVisible(true);
    this.highScoreText
      .setText("HIGH SCORE: " + GameState.highScore)
      .setVisible(true);
    this.coinsEarnedText
      .setText("COINS: " + GameState.session.coins)
      .setVisible(true);
    this.gemsEarnedText
      .setText("GEMS: " + GameState.session.gems)
      .setVisible(true);
    this.eggsEarnedText
      .setText("EGGS: " + GameState.session.eggs)
      .setVisible(true);
    this.distanceText
      .setText("DISTANCE: " + GameState.session.distance + "m")
      .setVisible(true);
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
    this.scoreText.setText("SCORE: " + Math.floor(this.score));
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
      this.sound.play("sfx-jump");
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

    if (this.sound.get("sfx-blast-hit")) {
      this.sound.play("sfx-blast-hit", { volume: 0.35 });
    }

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
    this.ground.tilePositionX += 2 * speedScale;
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
