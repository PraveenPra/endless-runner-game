export const GameState = {
  // currently active digimon key
  selectedDigimon: null, // base form at checkpoint
  currentForm: null, // runtime only (DO NOT persist on death)
  selectedMapKey: "desert",

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

  // High score tracking
  highScore: 0,

  // Session statistics (reset on each game start)
  session: {
    score: 0,
    coins: 0,
    gems: 0,
    eggs: 0,
    distance: 0,
  },

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

    load() {
      try {
        const saved = localStorage.getItem("currency");
        if (!saved) return;

        const parsed = JSON.parse(saved);
        this.coins = Number(parsed.coins) || 0;
        this.gems = Number(parsed.gems) || 0;
        this.eggs = Number(parsed.eggs) || 0;
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    save() {
      try {
        localStorage.setItem(
          "currency",
          JSON.stringify({
            coins: this.coins,
            gems: this.gems,
            eggs: this.eggs,
          }),
        );
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    addCoins(value = 1) {
      this.coins += value;
      this.save();
    },

    addGems(value = 1) {
      this.gems += value;
      this.save();
    },

    addEggs(value = 1) {
      this.eggs += value;
      this.save();
    },

    canAfford(cost = {}) {
      return (
        this.coins >= (cost.coins || 0) &&
        this.gems >= (cost.gems || 0)
      );
    },

    spend(cost = {}) {
      if (!this.canAfford(cost)) return false;

      this.coins -= cost.coins || 0;
      this.gems -= cost.gems || 0;
      this.save();
      return true;
    },
  },

  hatchery: {
    eggs: [],
    capacity: 1,
    lastHatchedDigimon: null,

    get pendingEgg() {
      return this.eggs[0] || null;
    },

    load() {
      try {
        const pending = localStorage.getItem("hatchery_pending_egg");
        const eggs = localStorage.getItem("hatchery_eggs");
        const capacity = localStorage.getItem("hatchery_capacity");
        const unlocked = localStorage.getItem("unlocked_base_forms");

        this.capacity = Math.max(1, Number(capacity) || 1);
        if (eggs) {
          this.eggs = JSON.parse(eggs).filter(Boolean).slice(0, this.capacity);
        } else {
          const legacyEgg = pending ? JSON.parse(pending) : null;
          this.eggs = legacyEgg ? [legacyEgg] : [];
          this.saveEggs();
        }

        if (unlocked) {
          GameState.unlockedBaseForms = new Set(JSON.parse(unlocked));
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    saveEggs() {
      try {
        localStorage.setItem("hatchery_eggs", JSON.stringify(this.eggs));
        if (this.pendingEgg) {
          localStorage.setItem(
            "hatchery_pending_egg",
            JSON.stringify(this.pendingEgg),
          );
        } else {
          localStorage.removeItem("hatchery_pending_egg");
        }
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    saveCapacity() {
      try {
        localStorage.setItem("hatchery_capacity", String(this.capacity));
      } catch (e) {
        // Ignore localStorage errors
      }
    },

    savePendingEgg(egg) {
      return this.addEgg(egg);
    },

    addEgg(egg) {
      if (this.eggs.length >= this.capacity) {
        return false;
      }

      this.eggs.push(egg);
      this.saveEggs();
      return true;
    },

    clearPendingEgg() {
      this.eggs.shift();
      this.saveEggs();
    },

    discardEgg(index = 0) {
      if (!this.eggs[index]) return false;

      this.eggs.splice(index, 1);
      this.saveEggs();
      return true;
    },

    increaseCapacity(amount = 1) {
      this.capacity += amount;
      this.saveCapacity();
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

// Load high score from localStorage on startup
try {
  const savedHighScore = localStorage.getItem("highScore");
  if (savedHighScore !== null) {
    GameState.highScore = parseInt(savedHighScore, 10);
  }
} catch (e) {
  // Ignore localStorage errors
}

GameState.hatchery.load();
GameState.currency.load();
