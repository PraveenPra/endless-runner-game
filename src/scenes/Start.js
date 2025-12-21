export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        //Calc: width of ur animated img/total number of frames, same height of your animated image
        this.load.spritesheet(
            'wargreymon-run',
            'assets/wargreymon/run.png',
            { frameWidth: 55.25, frameHeight: 48 } // change if needed
        );

        this.load.spritesheet(
            'wargreymon-jump',
            'assets/wargreymon/jump.png',
            { frameWidth: 59, frameHeight: 58 }
        );

        this.load.image('ground', 'assets/ground.png'); // put your ground image in assets/
        this.load.image('bg-far', 'assets/sky.png');
        this.load.image('bg-mid', 'assets/bg-mid.png');

        this.load.spritesheet(
            'enemy',
            'assets/obstacle1.png',
            { frameWidth: 17.6, frameHeight: 18 }
        );
        this.load.spritesheet(
            'enemy2',
            'assets/enemy2.png',
            { frameWidth: 26, frameHeight: 34 }
        );
        this.load.image('spike', 'assets/spike.png');


    }

    create() {
        this.obstacleTypes = [
            {
                key: 'enemy',
                sprite: 'enemy',
                animKey: 'enemy-walk',
                frameRate: 6,
                frames: { start: 0, end: 5 },
                y: 220
            },
            {
                key: 'enemy2',
                sprite: 'enemy2',
                animKey: 'enemy2-walk',
                frameRate: 2,
                frames: { start: 0, end: 2 },
                y: 210
            },
            {
                key: 'spike',
                sprite: 'spike',
                animKey: null,
                y: 220
            }
        ];


        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('wargreymon-run'),
            frameRate: 8,//number of frames in ur animated image
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('wargreymon-jump'),
            frameRate: 9,
            repeat: 0
        });

        this.obstacleTypes.forEach(type => {
            if (type.animKey) {
                this.anims.create({
                    key: type.animKey,
                    frames: this.anims.generateFrameNumbers(type.sprite, type.frames),
                    frameRate: type.frameRate,
                    repeat: -1
                });
            }
        });


        this.bgFar = this.add.tileSprite(0, 0, 480, 190, 'bg-far').setOrigin(0, 0);
        this.bgMid = this.add.tileSprite(0, 202, 1080, 70, 'bg-mid');

        // ground as tileSprite for endless scrolling
        this.ground = this.add.tileSprite(240, 250, 480, 25, 'ground').setScale(1, 1.8);
        this.physics.add.existing(this.ground, true); // static physics body


        // player sprite
        this.player = this.physics.add.sprite(20, 100, 'wargreymon-run');
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);
        this.player.body.setVelocityX(0);
        this.player.x = 100; // fixed run position

        // FIX: set fixed body size(hitbox/collisionbody) to match run frame
        this.player.body.setSize(35, 49);
        this.player.body.setOffset(0, 0);
        this.player.play('run');

        // collide
        this.physics.add.collider(this.player, this.ground);

        // input
        this.cursors = this.input.keyboard.createCursorKeys();

        // keep feet anchored for varying frame heights
        this.player.on('animationupdate', (anim, frame, sprite) => {
            sprite.y = sprite.body.y + sprite.body.height;
        });

        // switch back to run after jump animation finishes
        this.player.on('animationcomplete', (anim, frame, sprite) => {
            if (anim.key === 'jump') {
                sprite.play('run', true);
            }
        });

        this.obstacles = this.physics.add.group();
        // Spawn obstacles (timer)
        this.spawnObstacle = () => {
            const type = Phaser.Utils.Array.GetRandom(this.obstacleTypes);

            const obs = this.obstacles.create(520, type.y, type.sprite);
            obs.body.setSize(obs.width * 0.7, obs.height * 0.8);
            obs.body.setOffset(
                obs.width * 0.15,
                obs.height * 0.2
            );


            if (type.animKey) obs.play(type.animKey);

            obs.setVelocityX(-120);
            obs.setImmovable(true);
            obs.body.allowGravity = false;

            // random next spawn
            this.time.addEvent({
                delay: Phaser.Math.Between(1000, 2200),
                callback: this.spawnObstacle,
                callbackScope: this
            });
        };

        // start first spawn
        this.spawnObstacle();


        this.physics.add.collider(this.player, this.obstacles, () => {
            this.scene.pause();
            console.log('GAME OVER');
        });

    }

    update() {
        // jump trigger once
        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.body.touching.down) {
            this.player.setVelocityY(-600);
            this.player.play('jump', true);
        }

        if (Phaser.Input.Keyboard.JustDown(this.cursors.space) && this.player.body.blocked.down) {
            this.player.setVelocityY(-600);
            this.player.play('jump', true);
        }

        //scrolling ground
        this.ground.tilePositionX += 2; // speed of scrolling
        this.bgFar.tilePositionX += 0.1;
        this.bgMid.tilePositionX += 0.6;

        // Cleanup off-screen obstacles
        this.obstacles.children.iterate(obs => {
            if (obs && obs.x < -50) {
                obs.destroy();
            }
        });

    }

}
