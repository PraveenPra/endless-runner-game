export const MAPS = {
  desert: {
    key: "desert",
    name: "Desert",
    ground: {
      key: "ground",
      x: 240,
      y: 250,
      width: 480,
      height: 25,
      scaleX: 1,
      scaleY: 1.8,
      originX: 0.5,
      originY: 0.5,
      tileScaleX: 1,
      tileScaleY: 1,
      tilePositionX: 0,
      tilePositionY: 0,
      scrollSpeed: 2,
      depth: 5,
    },
    backgrounds: [
      {
        key: "bg-far",
        y: 0,
        height: 270,
        scrollSpeed: 0.1,
      },
      {
        key: "bg-mid",
        y: 202,
        height: 70,
        scrollSpeed: 0.6,
      },
    ],
    obstacles: "default",
    collectibles: "default",
  },

  jungle: {
    key: "jungle",
    name: "Jungle",
    ground: {
      key: "ground1",
      x: 240,
      y: 260,
      width: 4800,
      height: 148,
      scaleX: 0.5,
      scaleY: 0.5,
      originX: 0.5,
      originY: 0.5,
      tileScaleX: 1,
      tileScaleY: 1,
      tilePositionX: 0,
      tilePositionY: 0,
      scrollSpeed: 2,
      depth: 5,
    },
    backgrounds: [
      {
        key: "bg5",
        y: 0,
        height: 270,
        scrollSpeed: 0.05,
      },
      {
        key: "bg4",
        y: 0,
        height: 270,
        scrollSpeed: 0.12,
      },
      {
        key: "bg3",
        y: 0,
        height: 270,
        scrollSpeed: 0.22,
      },
      {
        key: "bg2",
        y: 0,
        height: 270,
        scrollSpeed: 0.38,
      },
      {
        key: "bg1",
        y: 0,
        height: 270,
        scrollSpeed: 0.58,
      },
    ],
    obstacles: "default",
    collectibles: "default",
  },

  junglesun: {
    key: "junglesun",
    name: "Junglesun",
    ground: {
      key: "ground1",
      x: 240,
      y: 260,
      width: 4800,
      height: 148,
      scaleX: 0.5,
      scaleY: 0.5,
      originX: 0.5,
      originY: 0.5,
      tileScaleX: 1,
      tileScaleY: 1,
      tilePositionX: 0,
      tilePositionY: 0,
      scrollSpeed: 2,
      depth: 5,
    },
    backgrounds: [
      {
        key: "sky1",
        y: 0,
        height: 270,
        scrollSpeed: 0.05,
      },
      {
        key: "cloud1",
        y: 0,
        height: 270,
        scrollSpeed: 0.12,
      },
      {
        key: "cloud2",
        y: 0,
        height: 270,
        scrollSpeed: 0.22,
      },
    ],
    obstacles: "default",
    collectibles: "default",
  },

  drydesert: {
    key: "drydesert",
    name: "drydesert",
    ground: {
      key: "ground3",
      x: 240,
      y: 220,
      width: 4800,
      height: 50,
      scaleX: 1,
      scaleY: 2,
      originX: 0.5,
      originY: 0.5,
      tileScaleX: 1,
      tileScaleY: 1,
      tilePositionX: 0,
      tilePositionY: 0,
      scrollSpeed: 2,
      depth: 5,
    },
    backgrounds: [
      {
        key: "blue-sky",
        y: 0,
        height: 270,
        scrollSpeed: 0.05,
      },
      {
        key: "blue-clouds",
        y: 0,
        height: 270,
        scrollSpeed: 0.12,
      },
      {
        key: "cliffs",
        y: 0,
        height: 270,
        scrollSpeed: 0.22,
      },
      {
        key: "big-sanddune",
        y: 0,
        height: 270,
        scrollSpeed: 0.22,
      },
      {
        key: "sanddune",
        y: 0,
        height: 270,
        scrollSpeed: 0.22,
      },
    ],
    obstacles: "default",
    collectibles: "default",
  },
};

export const DEFAULT_MAP_KEY = "desert";

export function getMapConfig(mapKey) {
  return MAPS[mapKey] || MAPS[DEFAULT_MAP_KEY];
}

export function getMapList() {
  return Object.values(MAPS);
}
