import { cpSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const sourceDir = resolve("src");
const outputDir = resolve("dist");

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

cpSync(sourceDir, outputDir, { recursive: true });