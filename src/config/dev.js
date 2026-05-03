function readDevMode() {
  const query = new URLSearchParams(globalThis.location?.search || "");
  if (query.has("dev")) return true;

  try {
    return globalThis.localStorage?.getItem("digimon_dev_mode") === "true";
  } catch {
    return false;
  }
}

export const DEV_MODE = readDevMode();
