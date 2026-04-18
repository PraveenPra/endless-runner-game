export const DIGIMON_DEFAULTS = {
  body: {
    width: 11,
    height: 14,
    offsetX: -6,
    offsetY: -4,
    gravityY: 900,
  },

  move: {
    speed: 100,
    jump: 640,
    accel: 1200, // how fast you speed up
    decel: 1600, // how fast you slow down
    airAccel: 800,
    airDecel: 600,
    maxAirSpeed: 180,
  },

  movement: {
    mode: "ground",
  },
};
