export const GameState = {
  // currently active digimon key
  selectedDigimon: null, // base form at checkpoint
  currentForm: null, // runtime only (DO NOT persist on death)

  gameMode: "platformer",

  activeGameplayScene: null,

  setActiveScene(sceneKey) {
    this.activeGameplayScene = sceneKey;
  },

  player: null,

  events: new Phaser.Events.EventEmitter(),

  setPlayer(player) {
    this.player = player;
    this.events.emit("player-set", player);
  },

  clearPlayer() {
    this.player = null;
  },

  checkpoint: {
    scene: "Start",
    x: 200,
    y: 150,
  },

  playerProgression: {
    level: 1,
    maxHpBonus: 0,
    attackBonus: 0,
    defenseBonus: 0,
  },

  levelUpPlayer() {
    this.playerProgression.level++;

    this.playerProgression.attackBonus += 4;
    this.playerProgression.maxHpBonus += 10;

    console.log(
      `[LEVEL UP] Lv ${this.playerProgression.level}`,
      this.playerProgression,
    );
  },

  dataShards: {
    count: 0,
    _listeners: new Set(),

    _notify() {
      this._listeners.forEach((cb) => cb(this.count));
    },

    subscribe(cb) {
      this._listeners.add(cb);
    },

    // helper to increment
    add(value = 1) {
      this.count += value;
      this._notify();
    },

    // optional helper to set absolute value
    set(value) {
      this.count = value;
      this._notify();
    },
  },

  hatchableDigimon: [
    "botomon",
    "wormmon",
    "kunemon",
    "chivmon",
    "gabumon",
    "magnamon",
    "patamon",
    "imperialdramon",
    "ancienttroiamon",
    "ophanimon",
  ],

  allPlayableDigimon: [
    "botomon",
    "wormmon",
    "kunemon",
    "agumon",
    "chivmon",
    "gabumon",
    "magnamon",
    "patamon",
    "imperialdramon",
    "ancienttroiamon",
    "ophanimon",
  ],

  // base forms the player can switch to
  unlockedBaseForms: new Set(["agumon"]),

  // evolutions the player has unlocked
  unlockedEvolutions: new Set([
    "imperialdramon",
    "birdramon",
    "seraphimon",
    "patamon",
  ]),

  audio: {
    musicEnabled: true,
    sfxEnabled: true,
    musicVolume: 0.01,
    sfxVolume: 0.7,
  },

  currency: {
    coins: 0,
    gems: 0,
    eggs: 0,

    addCoins(value = 1) {
      this.coins += value;
    },

    addGems(value = 1) {
      this.gems += value;
    },

    addEggs(value = 1) {
      this.eggs += value;
    },
  },

  hatchery: {
    pendingEgg: null,
    lastHatchedDigimon: null,

    load() {
      try {
        const pending = localStorage.getItem("hatchery_pending_egg");
        const unlocked = localStorage.getItem("unlocked_base_forms");

        this.pendingEgg = pending ? JSON.parse(pending) : null;
        if (unlocked) {
          GameState.unlockedBaseForms = new Set(JSON.parse(unlocked));
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    savePendingEgg(egg) {
      this.pendingEgg = egg;
      try {
        localStorage.setItem("hatchery_pending_egg", JSON.stringify(egg));
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    clearPendingEgg() {
      this.pendingEgg = null;
      try {
        localStorage.removeItem("hatchery_pending_egg");
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    saveUnlocks() {
      try {
        localStorage.setItem(
          "unlocked_base_forms",
          JSON.stringify([...GameState.unlockedBaseForms]),
        );
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    hatchPendingEgg() {
      if (!this.pendingEgg) return null;

      const locked = GameState.hatchableDigimon.filter(
        (key) => !GameState.unlockedBaseForms.has(key),
      );

      if (!locked.length) {
        this.clearPendingEgg();
        return null;
      }

      const eggIndex = this.pendingEgg.frameIndex || 0;
      const digimonKey = locked[eggIndex % locked.length];
      GameState.unlockedBaseForms.add(digimonKey);
      this.lastHatchedDigimon = digimonKey;
      this.clearPendingEgg();
      this.saveUnlocks();
      return digimonKey;
    },
  },
};

GameState.hatchery.load();
