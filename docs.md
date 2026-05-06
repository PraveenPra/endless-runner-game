# How to add digimons
1. Create spritesheet: Add PNG + JSON atlas to `assets/digimons/YourName/`
2. Create profile: Add `yourname.js` to `src/entities/digimon/DigimonProfiles/`
3. Export profile: Add to `src/entities/digimon/DigimonProfiles/index.js`:
   ```js
   export { yourname } from "./yourname.js";
   ```
4. Register in preload: Add name to `src/scenes/Preload/digimons.js` array:
   ```js
   export const digimons = [
     "YourName",
     // ...
   ];
   ```
5. Use in game: Pass key to `resolveProfile("yourname")` or select in UI

# How to add and use VFX
1. Add the spritesheet PNG to `assets/vfx/`
2. Add entry to `src/scenes/Preload/vfx.js` - add object with:
   - `key`: unique name for the VFX
   - `file`: filename of the PNG
   - `w`: frame width in pixels
   - `h`: frame height in pixels
3. Add animation in `createVFXAnimations()` in `src/scenes/Start.js`:
   ```js
   {
     key: "vfx-your-vfx-name", // animation key
     texture: "vfx-your-vfx-name", // must match texture key from vfx.js
     frameRate: 12, // animation speed
     repeat: 0, // 0 = play once and stop, -1 = loop
   },
   ```
4. Use the VFX in a digimon profile:
   - For projectiles: set `impactVFX: "vfx-your-vfx-name"` in attack config
   - Direct spawn: call `this.spawnImpactVFX(x, y, "vfx-your-vfx-name")` in Start.js

# How to add SFX and Music
1. Add audio files to `assets/sfx/`
2. Add SFX to `src/scenes/Preload/audio.js`:
   ```js
   const sfx = [
     ["your-sfx-key", "your-file.mp3"],
   ];
   ```
3. Add background music:
   ```js
   const music = [["your-music-key", "your-file.mp3"]];
   ```
4. Play in game:
   - SFX: `this.playSfx("your-sfx-key", { volume: 0.5 })`
   - Music: handled automatically by background music system

# How to add UI elements
1. Add PNG and JSON atlas to `assets/ui/`
2. Add loading in `src/scenes/Preload/ui.js`:
   ```js
   scene.load.atlas("your-key", "assets/ui/your-file.png", "assets/ui/your-file.json");
   ```
3. Add bitmap fonts (optional):
   ```js
   scene.load.bitmapFont("font-key", "assets/ui/fonts/font.png", "assets/ui/fonts/font.xml");
   ```
4. Use in game via `this.add.sprite(x, y, "your-key", "frame-name")`

# How to add backgrounds
1. Add images to `assets/backgrounds/`
2. Add entry to `src/scenes/Preload/backgrounds.js`:
   ```js
   { key: "your-bg-key", file: "your-file.png" },
   ```
3. Use in scene setup or createTileSprite

# How to add collectables
1. Static images: Add to `assets/collectables/static/`
2. Animated: Add spritesheet to `assets/collectables/moving/`
3. Add to `src/scenes/Preload/collectables.js`:
   ```js
   // For animated spritesheets
   export const collectibleSpritesheets = [
     { key: "your-collectible", file: "your-file.png", w: 16, h: 16 },
   ];
   
   // For static images
   export const collectablesStaticImages = [
     { key: "your-powerup", file: "your-file.png" },
   ];
   ```
4. Define collectable type in game config and collision logic

# How to add obstacles
1. Static: Add to `assets/obstacles/static/`
2. Animated: Add spritesheet to `assets/obstacles/moving/`
3. Add to `src/scenes/Preload/obstacles.js`:
   ```js
   // For animated spritesheets
   export const obstacleSpritesheets = [
     { key: "obstacle-your", file: "your-file.png", w: 16, h: 16 },
   ];
   
   // For static images
   scene.load.image("obstacle-static-your", "assets/obstacles/static/your-file.png");
   ```
4. Define obstacle in `obstacleTypes` in Start.js with collision/damage logic