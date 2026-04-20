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

    this.load.atlas(
      digimon,
      `assets/digimons/${digimon}/${digimon}.png`,
      `assets/digimons/${digimon}/${digimon}.json`,
    );

    this.load.image("ground", "assets/ground.png");
    this.load.image("bg-far", "assets/sky.png");
    this.load.image("bg-mid", "assets/bg-mid.png");

    this.load.spritesheet("enemy", "assets/obstacle1.png", {
      frameWidth: 17.6,
      frameHeight: 18,
    });

    this.load.spritesheet("enemy2", "assets/enemy2.png", {
      frameWidth: 26,
      frameHeight: 34,
    });

    this.load.image("spike", "assets/spike.png");

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
        sprite: "enemy",
        anim: "enemy-walk",
        frames: { start: 0, end: 5 },
        frameRate: 6,
        y: 220 * this.scaleY,
      },
      {
        sprite: "enemy2",
        anim: "enemy2-walk",
        frames: { start: 0, end: 2 },
        frameRate: 2,
        y: 210 * this.scaleY,
      },
      {
        sprite: "spike",
        anim: null,
        y: 220 * this.scaleY,
      },
    ];
  }

  createCollectibleConfig() {
    this.collectibleTypes = [
      {
        sprite: "enemy",
        anim: "coin-spin",
        frames: { start: 0, end: 5 },
        frameRate: 10,
        scale: 1.1,
        tint: 0xffd54a,
      },
    ];

    this.collectibleLanes = [
      this.groundY - 30 * this.scaleY,
      this.groundY - 80 * this.scaleY,
      this.groundY - 130 * this.scaleY,
    ];
  }

  /* ───────────────── ANIMATIONS ───────────────── */

  createAnimations() {
    const digimon = GameState.selectedDigimon || "agumon";

    createAnimations(this, digimon);

    if (!this.anims.exists("coin-spin")) {
      this.anims.create({
        key: "coin-spin",
        frames: this.anims.generateFrameNumbers("enemy", { start: 0, end: 5 }),
        frameRate: 10,
        repeat: -1,
      });
    }

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

    const type = Phaser.Utils.Array.GetRandom(this.collectibleTypes);
    const y = Phaser.Utils.Array.GetRandom(this.collectibleLanes);
    const coin = this.collectibles.create(this.obstacleSpawnX, y, type.sprite);

    coin.setScale(type.scale);
    coin.setTint(type.tint);
    coin.setVelocityX(-120);
    coin.play(type.anim);
    coin.body.setCircle(coin.width * 0.25, coin.width * 0.25, coin.height * 0.25);

    this.tweens.add({
      targets: coin,
      y: y - 8 * this.scaleY,
      duration: 450,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.time.addEvent({
      delay: Phaser.Math.Between(1400, 2600),
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

    this.physics.add.overlap(this.player, this.collectibles, (_, coin) => {
      this.collectCoin(coin);
    });
  }

  collectCoin(coin) {
    if (!coin || !coin.active || this.gameOver) return;

    this.coins += 1;
    this.coinText.setText("COINS: " + this.coins);

    coin.destroy();

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
