const PANEL_SLICE = 32;
const BUTTON_SLICE = 14;
export const SMALL_FONT_SIZE = 50;

export function createPanel(scene, x, y, width, height, options = {}) {
  return createNineSlice(scene, x, y, width, height, {
    atlas: options.atlas || "ui",
    prefix: options.prefix || "panel-green",
    slice: options.slice || PANEL_SLICE,
    depth: options.depth || 0,
    alpha: options.alpha ?? 1,
  });
}

export function createButton(scene, x, y, width, height, label, onClick, options = {}) {
  const createButtonFrame =
    options.layout === "single"
      ? createSingleSlice
      : options.layout === "horizontal"
      ? createHorizontalSlice
      : createNineSlice;
  const container = createButtonFrame(scene, x, y, width, height, {
    atlas: options.atlas || "ui",
    prefix: options.prefix || "button-green",
    slice: options.slice || BUTTON_SLICE,
    depth: options.depth || 0,
    alpha: options.alpha ?? 1,
  });

  if (options.icon) {
    const icon = scene.add
      .image(options.iconX ?? (label ? -width / 2 + 25 : 0), options.iconY ?? 0, options.iconAtlas || "icons", options.icon)
      .setDisplaySize(options.iconSize || 22, options.iconSize || 22);
    if (options.iconTint !== undefined) {
      icon.setTint(options.iconTint);
    }
    container.add(icon);
  }

  if (label) {
    const text = createBitmapLabel(scene, options.textX ?? (options.icon ? 12 : 0), options.textY ?? 1, label, {
      font: options.font || "smallFont",
      size: options.fontSize || SMALL_FONT_SIZE,
      tint: options.tint ?? 0x17301b,
    });
    container.add(text);
  }

  const hitArea = scene.add
    .zone(0, 0, width, height)
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });
  container.add(hitArea);
  container.hitArea = hitArea;

  let repeatEvent = null;
  const stopRepeat = () => {
    if (!repeatEvent) return;
    repeatEvent.remove(false);
    repeatEvent = null;
  };

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
    stopRepeat();
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
    if (options.repeat && onClick) {
      onClick();
      repeatEvent = scene.time.addEvent({
        delay: options.repeatDelay || 120,
        loop: true,
        callback: onClick,
      });
    }
  });

  hitArea.on("pointerup", () => {
    stopRepeat();
    container.setScale(1.04);
    if (!options.repeat && onClick) onClick();
  });

  return container;
}

export function createBitmapLabel(scene, x, y, text, options = {}) {
  const font = options.font || "smallFont";
  const displayText = options.textTransform
    ? options.textTransform(text)
    : formatBitmapText(text, font);
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

export function setBitmapLabelText(label, text, font = "smallFont") {
  label.setText(formatBitmapText(text, font));
  return label;
}

export function formatBitmapText(text, font = "smallFont") {
  if (font !== "smallFont") return text;

  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/>/g, "")
    .replace(/_/g, "-");
}

function createNineSlice(scene, x, y, width, height, config) {
  const { atlas, prefix, slice, depth, alpha } = config;
  const container = scene.add.container(Math.round(x), Math.round(y));
  container.setDepth(depth);
  container.setAlpha(alpha);

  const overlap = config.overlap ?? 4;
  const innerWidth = Math.max(1, width - slice * 2);
  const innerHeight = Math.max(1, height - slice * 2);
  const left = -width / 2;
  const right = width / 2 - slice;
  const top = -height / 2;
  const bottom = height / 2 - slice;

  const pieces = [
    [left, top, `${prefix}-top-left`, slice + overlap, slice + overlap],
    [left + slice - overlap, top, `${prefix}-top`, innerWidth + overlap * 2, slice + overlap],
    [right - overlap, top, `${prefix}-top-right`, slice + overlap, slice + overlap],
    [left, top + slice - overlap, `${prefix}-left`, slice + overlap, innerHeight + overlap * 2],
    [
      left + slice - overlap,
      top + slice - overlap,
      `${prefix}-center`,
      innerWidth + overlap * 2,
      innerHeight + overlap * 2,
    ],
    [right - overlap, top + slice - overlap, `${prefix}-right`, slice + overlap, innerHeight + overlap * 2],
    [left, bottom - overlap, `${prefix}-bottom-left`, slice + overlap, slice + overlap],
    [left + slice - overlap, bottom - overlap, `${prefix}-bottom`, innerWidth + overlap * 2, slice + overlap],
    [right - overlap, bottom - overlap, `${prefix}-bottom-right`, slice + overlap, slice + overlap],
  ];

  pieces.forEach(([pieceX, pieceY, frame, pieceWidth, pieceHeight]) => {
    const image = scene.add
      .image(Math.round(pieceX), Math.round(pieceY), atlas, frame)
      .setOrigin(0, 0)
      .setDisplaySize(Math.ceil(pieceWidth), Math.ceil(pieceHeight));
    container.add(image);
  });

  return container;
}

function createHorizontalSlice(scene, x, y, width, height, config) {
  const { atlas, prefix, slice, depth, alpha } = config;
  const container = scene.add.container(Math.round(x), Math.round(y));
  container.setDepth(depth);
  container.setAlpha(alpha);

  const overlap = config.overlap ?? 4;
  const innerWidth = Math.max(1, width - slice * 2);
  const left = -width / 2;
  const right = width / 2 - slice;
  const top = -height / 2;

  const pieces = [
    [left, top, `${prefix}-left`, slice + overlap, height],
    [left + slice - overlap, top, `${prefix}-center`, innerWidth + overlap * 2, height],
    [right - overlap, top, `${prefix}-right`, slice + overlap, height],
  ];

  pieces.forEach(([pieceX, pieceY, frame, pieceWidth, pieceHeight]) => {
    const image = scene.add
      .image(Math.round(pieceX), Math.round(pieceY), atlas, frame)
      .setOrigin(0, 0)
      .setDisplaySize(Math.ceil(pieceWidth), Math.ceil(pieceHeight));
    container.add(image);
  });

  return container;
}

function createSingleSlice(scene, x, y, width, height, config) {
  const { atlas, prefix, depth, alpha } = config;
  const container = scene.add.container(Math.round(x), Math.round(y));
  container.setDepth(depth);
  container.setAlpha(alpha);

  const image = scene.add
    .image(0, 0, atlas, `${prefix}-single`)
    .setDisplaySize(Math.ceil(width), Math.ceil(height));
  container.add(image);

  return container;
}
