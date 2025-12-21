import { Start } from './scenes/Start.js';

const config = {
    type: Phaser.AUTO,
    title: 'Endless run 1',
    description: '',
    parent: 'game-container',
    width: 480,
    height: 270,
    backgroundColor: '#000000',
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: { gravity: { y: 1200 }, debug: true }
    },
    scene: [
        Start
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
}

new Phaser.Game(config);
