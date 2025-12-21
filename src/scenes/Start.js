export class Start extends Phaser.Scene {
    constructor() {
        super('Start');
    }

    preload() {
        //Calc: width of ur animated img/total number of frames, same height of your animated image
        this.load.spritesheet(
            'wargreymon-run',
            'assets/wargreymon/run.png',
            { frameWidth: 55, frameHeight: 49 } // change if needed
        );

        this.load.spritesheet(
            'wargreymon-jump',
            'assets/wargreymon/jump.png',
            { frameWidth: 59, frameHeight: 58 }
        );

        this.load.image('ground', 'assets/ground.png'); // put your ground image in assets/
        this.load.image('bg-far', 'assets/sky.png');
        this.load.image('bg-mid', 'assets/bg-mid.png');
    }

    create() {
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
        this.bgFar = this.add.tileSprite(0, 0, 1280, 720, 'bg-far').setOrigin(0,0);
        this.bgMid = this.add.tileSprite(640, 670, 1280, 50, 'bg-mid');

        // ground as tileSprite for endless scrolling
        this.ground = this.add.tileSprite(640, 720, 1280, 25, 'ground').setScale(1, 2);
        this.physics.add.existing(this.ground, true); // static physics body


        // player sprite
        this.player = this.physics.add.sprite(200, 400, 'wargreymon-run', 0);
        this.player.setOrigin(0.5, 1);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(true);
        this.player.body.setVelocityX(0);
        this.player.x = 200; // fixed run position

        // FIX: set fixed body size to match run frame
        this.player.body.setSize(55, 49);
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
this.bgMid.tilePositionX += 1;
    }

}
