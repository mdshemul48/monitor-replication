import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const lastRunFilePath = join(__dirname, "../../temp", "lastRun.json");

export default async function checkAndRunAfter12hour(performTask) {
  try {
    const lastRunDir = dirname(lastRunFilePath);
    await fs.ensureDir(lastRunDir);

    let lastRunTime = 0;
    if (await fs.pathExists(lastRunFilePath)) {
      const data = await fs.readJson(lastRunFilePath);
      lastRunTime = data.timestamp || 0;
    }

    const currentTime = Date.now();

    // Check if 12 hours (12 * 60 * 60 * 1000 milliseconds) have passed
    const twelveHoursInMs = 12 * 60 * 60 * 1000;
    if (currentTime - lastRunTime >= twelveHoursInMs) {
      await performTask();

      await fs.writeJson(lastRunFilePath, { timestamp: currentTime });
    }
  } catch (error) {
    throw new Error(`Error checking or running task: ${error.message}`);
  }
}
