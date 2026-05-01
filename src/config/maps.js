export const MAPS = {
  desert: {
    key: "desert",
    name: "Desert",
    ground: {
      key: "ground",
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
      key: "ground",
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
};

export const DEFAULT_MAP_KEY = "desert";

export function getMapConfig(mapKey) {
  return MAPS[mapKey] || MAPS[DEFAULT_MAP_KEY];
}

export function getMapList() {
  return Object.values(MAPS);
}
