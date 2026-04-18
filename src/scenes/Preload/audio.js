const SFX_PATH = "assets/sfx/";
const MUSIC_PATH = "assets/sfx/";

const sfx = [
  ["blast-hit", "shoot.mp3"],
  ["wing-flap", "wing-flap.wav"],
  ["evolution", "evolution.wav"],
  ["collect-shard", "pick-a-coin.wav"],
  ["level-complete", "level-completion.wav"],
  ["hurt", "hurt-flinch.mp3"],
  ["gameover", "game-over.wav"],
];

const music = [["bg-1", "BG-MUSIC3.wav"]];

export function loadAudio(scene) {
  sfx.forEach(([key, file]) => {
    scene.load.audio(`sfx-${key}`, `${SFX_PATH}${file}`);
  });

  music.forEach(([key, file]) => {
    scene.load.audio(`music-${key}`, `${MUSIC_PATH}${file}`);
  });
}
