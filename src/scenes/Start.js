import { GameState } from "../GameState.js";
import { createAnimations } from "../systems/AnimationFactory.js";
import { resolveProfile } from "../entities/digimon/resolveProfile.js";

export class Start extends Phaser.Scene {
  constructor() {
    super("Start");
  }

  /* ───────────────── PRELOAD ───────────────── */

  preload() {
    const digimon = GameState.selectedDigimon || "agumon";

    this.load.image("ground", "assets/ground.png");
    this.load.image("bg-far", "assets/sky.png");
    this.load.image("bg-mid", "assets/bg-mid.png");

    this.load.spritesheet(
      "obstacle-moving-1",
      "assets/obstacles/moving/bala.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "obstacle-moving-2",
      "assets/obstacles/moving/bomba.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "obstacle-moving-3",
      "assets/obstacles/moving/bomba2.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "obstacle-moving-4",
      "assets/obstacles/moving/bombaex.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "obstacle-moving-5",
      "assets/obstacles/moving/estrelectra.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.spritesheet(
      "obstacle-moving-6",
      "assets/obstacles/moving/mechagoomba.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );

    this.load.image("obstacle-static-1", "assets/obstacles/static/balota.png");
    this.load.spritesheet(
      "collectible-gold-coin",
      "assets/collectables/moving/goldcoins.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
    this.load.spritesheet(
      "collectible-silver-coin",
      "assets/collectables/moving/silvercoins.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
    this.load.spritesheet(
      "collectible-gem-green",
      "assets/collectables/moving/gems-green.png",
      {
        frameWidth: 16,
        frameHeight: 16,
      },
    );
    this.load.spritesheet(
      "collectible-eggs",
      "assets/collectables/static/eggs.png",
      {
        frameWidth: 64,
        frameHeight: 64,
      },
    );

    this.load.audio("jump", "assets/sfx/jump.wav");
  }

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
    this.score = 0;
    this.coins = 0;
    this.gems = 0;
    this.eggs = 0;
    this.scoreSpeed = 0.01;
    this.gameOver = false;
    this.maxJumps = 2;
    this.jumpCount = 0;
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
    this.bgMidY = 202 * this.scaleY;
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
      },
      {
        sprite: "obstacle-moving-2",
        anim: "obstacle-moving-2-anim",
        frames: { start: 0, end: 4 },
        frameRate: 3,
        y: 220 * this.scaleY,
      },
      {
        sprite: "obstacle-moving-3",
        anim: "obstacle-moving-3-anim",
        frames: { start: 0, end: 3 },
        frameRate: 3,
        y: 220 * this.scaleY,
      },
      {
        sprite: "obstacle-moving-4",
        anim: "obstacle-moving-4-anim",
        frames: { start: 0, end: 2 },
        frameRate: 3,
        y: 220 * this.scaleY,
      },
      {
        sprite: "obstacle-moving-5",
        anim: "obstacle-moving-5-anim",
        frames: { start: 0, end: 3 },
        frameRate: 3,
        y: 220 * this.scaleY,
      },
      {
        sprite: "obstacle-moving-6",
        anim: "obstacle-moving-6-anim",
        frames: { start: 0, end: 4 },
        frameRate: 3,
        y: 220 * this.scaleY,
      },
      {
        sprite: "obstacle-static-1",
        anim: null,
        y: 220 * this.scaleY,
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
        scale: 0.5,
        value: 1,
        kind: "egg",
        weight: 3,
        useRandomFrame: true,
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
  }

  /* ───────────────── ENVIRONMENT ───────────────── */

  createBackground() {
    this.bgFar = this.add
      .tileSprite(0, 0, this.sceneWidth, this.sceneHeight, "bg-far")
      .setOrigin(0);

    this.bgMid = this.add
      .tileSprite(0, this.bgMidY, this.sceneWidth, 70 * this.scaleY, "bg-mid")
      .setOrigin(0, 0);
  }

  createGround() {
    this.ground = this.add
      .tileSprite(
        this.sceneWidth / 2,
        this.groundY,
        this.sceneWidth,
        this.groundHeight,
        "ground",
      )
      .setScale(1, this.groundScaleY);

    this.physics.add.existing(this.ground, true);
  }

  /* ───────────────── PLAYER ───────────────── */

  createPlayer() {
    const digimon = GameState.selectedDigimon || "agumon";
    const profile = resolveProfile(digimon);
    const { body } = profile;

    this.player = this.physics.add.sprite(
      this.playerStartX,
      this.playerStartY,
      digimon,
    );
    this.player.setOrigin(0.5, 1);
    this.player.setCollideWorldBounds(true);

    const frameWidth = this.player.frame.width;
    const frameHeight = this.player.frame.height;
    // const width = frameWidth * body.scaleX;
    // const height = frameHeight * body.scaleY;

    this.player.body.setSize(body.width, body.height);
    // this.player.body.setOffset(body.offsetX, body.offsetY);
    this.player.body.setOffset(
      frameWidth / 2 - body.width / 2,
      frameHeight - body.height,
    );
    this.player.body.setGravityY(body.gravityY);
    this.player.body.setCollideWorldBounds(true);

    this.player.play(`${digimon}_run`);

    this.player.on("animationcomplete", (anim) => {
      if (anim.key === `${digimon}_jump`) {
        this.player.play(`${digimon}_run`);
      }
    });
  }

  /* ───────────────── OBSTACLES ───────────────── */

  createObstacles() {
    this.obstacles = this.physics.add.group({
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

    obs.body.setSize(obs.width * 0.7, obs.height * 0.8);
    obs.body.setOffset(obs.width * 0.15, obs.height * 0.2);
    obs.setVelocityX(-120);

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
    collectible.setVelocityX(-120);

    if (type.useRandomFrame) {
      collectible.setFrame(Phaser.Math.Between(0, 49));
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

    this.eggText = this.add.text(10, 76, "EGGS: 0", {
      fontSize: "14px",
      fill: "#ffdcaa",
    });

    this.gameOverText = this.add
      .text(this.sceneWidth / 2, this.gameOverY, "GAME OVER", {
        fontSize: "24px",
        fill: "#ff4444",
      })
      .setOrigin(0.5)
      .setVisible(false);

    this.restartText = this.add
      .text(this.sceneWidth / 2, this.restartY, "Press SPACE to Restart", {
        fontSize: "12px",
        fill: "#fff",
      })
      .setOrigin(0.5)
      .setVisible(false);
  }

  /* ───────────────── COLLISIONS ───────────────── */

  createCollisions() {
    this.physics.add.collider(this.player, this.ground);
    // this.ground.setImmovable(true);

    this.physics.add.collider(this.player, this.obstacles, () => {
      this.triggerGameOver();
    });

    this.physics.add.overlap(
      this.player,
      this.collectibles,
      (_, collectible) => {
        this.collectCollectible(collectible);
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
      this.coinText.setText("COINS: " + this.coins);
    } else if (type.kind === "gem") {
      this.gems += type.value;
      this.gemText.setText("GEMS: " + this.gems);
    } else if (type.kind === "egg") {
      this.eggs += type.value;
      this.eggText.setText("EGGS: " + this.eggs);
    }

    collectible.destroy();

    if (this.sound.get("sfx-collect-shard")) {
      this.sound.play("sfx-collect-shard", { volume: 0.35 });
    }
  }

  triggerGameOver() {
    if (this.gameOver) return;
    this.gameOver = true;

    this.player.setVelocity(0);
    this.player.anims.pause();

    this.obstacles.children.iterate((o) => {
      if (!o) return;
      o.setVelocityX(0);
      if (o.anims) o.anims.pause();
    });

    this.collectibles.children.iterate((coin) => {
      if (!coin) return;
      coin.setVelocityX(0);
      if (coin.anims) coin.anims.pause();
    });

    this.time.removeAllEvents();

    this.gameOverText.setVisible(true);
    this.restartText.setVisible(true);
  }

  /* ───────────────── INPUT ───────────────── */

  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
  }

  /* ───────────────── UPDATE ───────────────── */

  update() {
    if (!this.gameOver) {
      this.updateJumpState();
      this.updateScore();
      this.handleJump();
      this.scrollWorld();
      this.cleanupObstacles();
      this.cleanupCollectibles();
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
    const digimon = GameState.selectedDigimon || "agumon";

    if (
      Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
      this.jumpCount < this.maxJumps
    ) {
      this.jumpCount += 1;
      this.player.setVelocityY(-600);
      this.player.play(`${digimon}_jump`, true);
      this.sound.play("jump");
    }
  }

  scrollWorld() {
    this.ground.tilePositionX += 2;
    this.bgFar.tilePositionX += 0.1;
    this.bgMid.tilePositionX += 0.6;
  }

  cleanupObstacles() {
    this.obstacles.children.iterate((o) => {
      if (o && o.x < -50) o.destroy();
    });
  }

  cleanupCollectibles() {
    this.collectibles.children.iterate((coin) => {
      if (coin && coin.x < -50) coin.destroy();
    });
  }
}
