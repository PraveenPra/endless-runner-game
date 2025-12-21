export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    /* ───────────────── PRELOAD ───────────────── */

    preload() {
        this.load.spritesheet('wargreymon-run', 'assets/wargreymon/run.png', {
            frameWidth: 55.25,
            frameHeight: 48
        });

        this.load.spritesheet('wargreymon-jump', 'assets/wargreymon/jump.png', {
            frameWidth: 59,
            frameHeight: 58
        });

        this.load.image('ground', 'assets/ground.png');
        this.load.image('bg-far', 'assets/sky.png');
        this.load.image('bg-mid', 'assets/bg-mid.png');

        this.load.spritesheet('enemy', 'assets/obstacle1.png', {
            frameWidth: 17.6,
            frameHeight: 18
        });

        this.load.spritesheet('enemy2', 'assets/enemy2.png', {
            frameWidth: 26,
            frameHeight: 34
        });

        this.load.image('spike', 'assets/spike.png');
    }

    /* ───────────────── CREATE ───────────────── */

    create() {
        this.initState();
        this.createObstacleConfig();
        this.createAnimations();
        this.createBackground();
        this.createGround();
        this.createPlayer();
        this.createObstacles();
        this.createUI();
        this.createCollisions();
        this.setupInput();
        this.startObstacleSpawner();
    }

    /* ───────────────── STATE ───────────────── */

    initState() {
        this.score = 0;
        this.scoreSpeed = 0.01;
        this.gameOver = false;
    }

    /* ───────────────── CONFIG ───────────────── */

    createObstacleConfig() {
        this.obstacleTypes = [
            {
                sprite: 'enemy',
                anim: 'enemy-walk',
                frames: { start: 0, end: 5 },
                frameRate: 6,
                y: 220
            },
            {
                sprite: 'enemy2',
                anim: 'enemy2-walk',
                frames: { start: 0, end: 2 },
                frameRate: 2,
                y: 210
            },
            {
                sprite: 'spike',
                anim: null,
                y: 220
            }
        ];
    }

    /* ───────────────── ANIMATIONS ───────────────── */

    createAnimations() {
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('wargreymon-run'),
            frameRate: 8,
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('wargreymon-jump'),
            frameRate: 9
        });

        this.obstacleTypes.forEach(o => {
            if (!o.anim) return;

            this.anims.create({
                key: o.anim,
                frames: this.anims.generateFrameNumbers(o.sprite, o.frames),
                frameRate: o.frameRate,
                repeat: -1
            });
        });
    }

    /* ───────────────── ENVIRONMENT ───────────────── */

    createBackground() {
        this.bgFar = this.add.tileSprite(0, 0, 480, 390, 'bg-far')
            .setOrigin(0);

        this.bgMid = this.add.tileSprite(0, 202, 1080, 70, 'bg-mid');
    }

    createGround() {
        this.ground = this.add.tileSprite(240, 250, 480, 25, 'ground')
            .setScale(1, 1.8);

        this.physics.add.existing(this.ground, true);
    }

    /* ───────────────── PLAYER ───────────────── */

    createPlayer() {
        this.player = this.physics.add.sprite(100, 100, 'wargreymon-run');
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);

        this.player.body.setSize(35, 49);
        this.player.body.setOffset(0, 0);

        this.player.play('run');

        // keep feet locked
        this.player.on('animationupdate', (_, __, sprite) => {
            sprite.y = sprite.body.y + sprite.body.height;
        });

        this.player.on('animationcomplete', anim => {
            if (anim.key === 'jump') {
                this.player.play('run');
            }
        });
    }

    /* ───────────────── OBSTACLES ───────────────── */

    createObstacles() {
        this.obstacles = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
    }

    startObstacleSpawner() {
        this.spawnObstacle();
    }

    spawnObstacle() {
        if (this.gameOver) return;

        const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);
        const obs = this.obstacles.create(520, type.y, type.sprite);

        obs.body.setSize(obs.width * 0.7, obs.height * 0.8);
        obs.body.setOffset(obs.width * 0.15, obs.height * 0.2);
        obs.setVelocityX(-120);

        if (type.anim) obs.play(type.anim);

        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 2200),
            callback: this.spawnObstacle,
            callbackScope: this
        });
    }

    /* ───────────────── UI ───────────────── */

    createUI() {
        this.scoreText = this.add.text(10, 10, 'SCORE: 0', {
            fontSize: '14px',
            fill: '#fff'
        });

        this.gameOverText = this.add.text(240, 120, 'GAME OVER', {
            fontSize: '24px',
            fill: '#ff4444'
        }).setOrigin(0.5).setVisible(false);

        this.restartText = this.add.text(240, 150, 'Press SPACE to Restart', {
            fontSize: '12px',
            fill: '#fff'
        }).setOrigin(0.5).setVisible(false);
    }

    /* ───────────────── COLLISIONS ───────────────── */

    createCollisions() {
        this.physics.add.collider(this.player, this.ground);

        this.physics.add.collider(this.player, this.obstacles, () => {
            this.triggerGameOver();
        });
    }

    triggerGameOver() {
        if (this.gameOver) return;
        this.gameOver = true;

        this.player.setVelocity(0);
        this.player.anims.pause();

        this.obstacles.children.iterate(o => {
            if (!o) return;
            o.setVelocityX(0);
            if (o.anims) o.anims.pause();
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
            this.updateScore();
            this.handleJump();
            this.scrollWorld();
            this.cleanupObstacles();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(this.cursors.space)) {
            this.scene.restart();
        }
    }

    updateScore() {
        this.score += this.scoreSpeed;
        this.scoreText.setText('SCORE: ' + Math.floor(this.score));
    }

    handleJump() {
        if (
            Phaser.Input.Keyboard.JustDown(this.cursors.space) &&
            this.player.body.blocked.down
        ) {
            this.player.setVelocityY(-600);
            this.player.play('jump', true);
        }
    }

    scrollWorld() {
        this.ground.tilePositionX += 2;
        this.bgFar.tilePositionX += 0.1;
        this.bgMid.tilePositionX += 0.6;
    }

    cleanupObstacles() {
        this.obstacles.children.iterate(o => {
            if (o && o.x < -50) o.destroy();
        });
    }
}
