import fs from "node:fs/promises";
import path from "node:path";

const CONTENT_DIR = path.join(process.cwd(), "content", "pseo");

export async function loadPseoMdx(slug: string): Promise<string | null> {
  try {
    const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);
    return await fs.readFile(filePath, "utf8");
  } catch {
    return null;
  }
}
