#!/usr/bin/env node

/**
 * Converts a Figma Variables DTCG export (*.tokens.json) into a TypeScript
 * colors module that preserves key order and nesting from the export.
 *
 * Usage:
 *   node scripts/tokens-to-colors.js [input.tokens.json] [output.ts]
 *
 * Defaults:
 *   input  → src/constants/colors1.tokens.json
 *   output → src/constants/colors.ts
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();
const inputPath = path.resolve(
  root,
  process.argv[2] ?? "src/constants/colors1.tokens.json"
);
const outputPath = path.resolve(
  root,
  process.argv[3] ?? "src/constants/colors.ts"
);

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isColorToken(node) {
  return isPlainObject(node) && node.$type === "color" && isPlainObject(node.$value);
}

function componentToByte(component) {
  const n = Number(component);
  if (!Number.isFinite(n)) return 0;
  // Figma DTCG uses 0–1 floats; some exports use 0–255.
  const scaled = n <= 1 ? n * 255 : n;
  return Math.round(Math.min(255, Math.max(0, scaled)));
}

function toHexByte(byte) {
  return byte.toString(16).padStart(2, "0").toUpperCase();
}

/**
 * Prefer the export's hex when present; otherwise build from components.
 * Non-opaque colors become 8-digit hex (#RRGGBBAA).
 */
function colorValueToCss(value) {
  const alpha =
    typeof value.alpha === "number" && Number.isFinite(value.alpha)
      ? Math.min(1, Math.max(0, value.alpha))
      : 1;

  let hex = typeof value.hex === "string" ? value.hex.trim() : "";
  if (!hex && Array.isArray(value.components) && value.components.length >= 3) {
    const [r, g, b] = value.components;
    hex = `#${toHexByte(componentToByte(r))}${toHexByte(componentToByte(g))}${toHexByte(componentToByte(b))}`;
  }

  if (!hex) {
    throw new Error(`Color token is missing both hex and components: ${JSON.stringify(value)}`);
  }

  if (!hex.startsWith("#")) hex = `#${hex}`;
  hex = hex.toUpperCase();

  // Strip existing alpha channel from hex if present, then re-apply.
  const rgb = hex.length >= 7 ? hex.slice(0, 7) : hex;
  if (alpha < 1) {
    const a = toHexByte(Math.round(alpha * 255));
    return `${rgb}${a}`;
  }
  return rgb;
}

/**
 * Recursively strip DTCG metadata and resolve color leaves.
 * Object key insertion order from the JSON parse is preserved.
 */
function transformTokens(node, pathParts = []) {
  if (isColorToken(node)) {
    return colorValueToCss(node.$value);
  }

  if (!isPlainObject(node)) {
    throw new Error(
      `Unexpected non-object token at "${pathParts.join(".") || "<root>"}": ${typeof node}`
    );
  }

  const result = {};
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue; // $extensions, $description, etc.
    result[key] = transformTokens(child, [...pathParts, key]);
  }
  return result;
}

function formatKey(key) {
  // Match common TS style: identifiers unquoted, numeric keys as bare numbers.
  if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key)) return key;
  if (/^(0|[1-9]\d*)$/.test(key)) return key;
  return JSON.stringify(key);
}

function formatValue(value, indent) {
  const pad = "  ".repeat(indent);
  const childPad = "  ".repeat(indent + 1);

  if (typeof value === "string") {
    return JSON.stringify(value);
  }

  if (!isPlainObject(value)) {
    return JSON.stringify(value);
  }

  const entries = Object.entries(value);
  if (entries.length === 0) return "{}";

  const lines = entries.map(([key, child]) => {
    return `${childPad}${formatKey(key)}: ${formatValue(child, indent + 1)},`;
  });

  return `{\n${lines.join("\n")}\n${pad}}`;
}

function generateTypeScript(colors) {
  return `export const colors = ${formatValue(colors, 0)} as const;\n`;
}

function main() {
  if (!fs.existsSync(inputPath)) {
    console.error(`Input not found: ${inputPath}`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(inputPath, "utf8"));
  const colors = transformTokens(raw);
  const source = generateTypeScript(colors);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, source, "utf8");

  console.log(`Wrote ${path.relative(root, outputPath)} from ${path.relative(root, inputPath)}`);
}

main();
