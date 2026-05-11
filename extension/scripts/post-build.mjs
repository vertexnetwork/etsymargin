import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dist = path.join(root, "dist");

async function copyDirIfExists(srcDir, destDir) {
  let entries;
  try {
    entries = await readdir(srcDir);
  } catch {
    console.warn(`[post-build] skip: ${srcDir} not found`);
    return 0;
  }
  await mkdir(destDir, { recursive: true });
  let count = 0;
  for (const name of entries) {
    const src = path.join(srcDir, name);
    const dest = path.join(destDir, name);
    const s = await stat(src);
    if (s.isFile()) {
      await copyFile(src, dest);
      count++;
    }
  }
  return count;
}

async function main() {
  await copyFile(path.join(root, "manifest.json"), path.join(dist, "manifest.json"));
  console.log("[post-build] copied manifest.json");
  const iconCount = await copyDirIfExists(path.join(root, "icons"), path.join(dist, "icons"));
  console.log(`[post-build] copied ${iconCount} icon(s)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
