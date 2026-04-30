import { Start } from "./scenes/Start.js";
import { Preload } from "./scenes/Preload/Preload.js";
import { MainMenuScene } from "./scenes/MainMenuScene.js";
import { CharacterSelect } from "./scenes/CharacterSelect.js";
import { EditBodyScene } from "./scenes/EditBodyScene.js";
import { EditProjectileScene } from "./scenes/EditProjectileScene.js";

const config = {
  type: Phaser.AUTO,
  title: "Endless run 1",
  description: "",
  parent: "game-container",
  //   width: 480,
  //   height: 270,
  width: 960, //768, //960, //640,
  height: 544, //432, //544, //360, 416
  backgroundColor: "#000000",
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade: { gravity: { y: 1200 }, debug: true },
  },
  scene: [
    Preload,
    MainMenuScene,
    CharacterSelect,
    EditBodyScene,
    EditProjectileScene,
    Start,
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

new Phaser.Game(config);
