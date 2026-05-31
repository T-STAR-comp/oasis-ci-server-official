import { readPlatformSettings } from "./platformSettingsStore.js";
export { readPlatformSettings, updatePlatformSettings } from "./platformSettingsStore.js";
export async function getPlatformSettings() {
    return readPlatformSettings();
}
