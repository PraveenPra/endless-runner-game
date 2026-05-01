const PANEL_SLICE = 32;
const BUTTON_SLICE = 14;

export function createPanel(scene, x, y, width, height, options = {}) {
  return createNineSlice(scene, x, y, width, height, {
    atlas: "ui",
    prefix: options.prefix || "panel-green",
    slice: options.slice || PANEL_SLICE,
    depth: options.depth || 0,
    alpha: options.alpha ?? 1,
  });
}

export function createButton(scene, x, y, width, height, label, onClick, options = {}) {
  const container = createNineSlice(scene, x, y, width, height, {
    atlas: "ui",
    prefix: options.prefix || "button-green",
    slice: options.slice || BUTTON_SLICE,
    depth: options.depth || 0,
    alpha: options.alpha ?? 1,
  });

  const text = createBitmapLabel(scene, 0, 1, label, {
    font: options.font || "smallFont",
    size: options.fontSize || 20,
    tint: options.tint ?? 0x17301b,
  });
  container.add(text);

  const hitArea = scene.add
    .zone(0, 0, width, height)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
  container.add(hitArea);

  hitArea.on("pointerover", () => {
    scene.tweens.add({
      targets: container,
      scaleX: 1.04,
      scaleY: 1.04,
      duration: 80,
      ease: "Sine.easeOut",
    });
  });

  hitArea.on("pointerout", () => {
    scene.tweens.add({
      targets: container,
      scaleX: 1,
      scaleY: 1,
      duration: 90,
      ease: "Sine.easeOut",
    });
  });

  hitArea.on("pointerdown", () => {
    container.setScale(0.98);
  });

  hitArea.on("pointerup", () => {
    container.setScale(1.04);
    if (onClick) onClick();
  });

  return container;
}

export function createBitmapLabel(scene, x, y, text, options = {}) {
  const font = options.font || "smallFont";
  const displayText = options.textTransform
    ? options.textTransform(text)
    : normalizeBitmapText(text, font);
  const label = scene.add.bitmapText(
    x,
    y,
    font,
    displayText,
    options.size || 18,
  );

  label.setOrigin(options.originX ?? 0.5, options.originY ?? 0.5);

  if (options.tint !== undefined) {
    label.setTint(options.tint);
  }

  if (options.align) {
    label.setCenterAlign();
  }

  return label;
}

function normalizeBitmapText(text, font) {
  if (font !== "smallFont") return text;

  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "-");
}

function createNineSlice(scene, x, y, width, height, config) {
  const { atlas, prefix, slice, depth, alpha } = config;
  const container = scene.add.container(x, y);
  container.setDepth(depth);
  container.setAlpha(alpha);

  const innerWidth = Math.max(1, width - slice * 2);
  const innerHeight = Math.max(1, height - slice * 2);
  const left = -width / 2;
  const right = width / 2 - slice;
  const top = -height / 2;
  const bottom = height / 2 - slice;

  const pieces = [
    [left, top, `${prefix}-top-left`, slice, slice],
    [left + slice, top, `${prefix}-top`, innerWidth, slice],
    [right, top, `${prefix}-top-right`, slice, slice],
    [left, top + slice, `${prefix}-left`, slice, innerHeight],
    [left + slice, top + slice, `${prefix}-center`, innerWidth, innerHeight],
    [right, top + slice, `${prefix}-right`, slice, innerHeight],
    [left, bottom, `${prefix}-bottom-left`, slice, slice],
    [left + slice, bottom, `${prefix}-bottom`, innerWidth, slice],
    [right, bottom, `${prefix}-bottom-right`, slice, slice],
  ];

  pieces.forEach(([pieceX, pieceY, frame, pieceWidth, pieceHeight]) => {
    const image = scene.add
      .image(pieceX, pieceY, atlas, frame)
      .setOrigin(0, 0)
      .setDisplaySize(pieceWidth, pieceHeight);
    container.add(image);
  });

  return container;
}
