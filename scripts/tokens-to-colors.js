#!/usr/bin/env node

/**
 * Converts Figma Variables DTCG exports (*.tokens.json) into TypeScript color modules.
 *
 * Supports:
 * - Absolute colors (hex string or Figma { colorSpace, components, hex, alpha })
 * - Aliases / references: "$value": "{brand.50}" → brand[50]
 *
 * Typical workflow (primitives + semantic collections):
 *   node scripts/tokens-to-colors.js \
 *     --base src/constants/base.tokens.json \
 *     --colors src/constants/colors.tokens.json
 *
 * Single-file fallback (absolute colors only → colors.ts):
 *   node scripts/tokens-to-colors.js [input.tokens.json] [output.ts]
 */

const fs = require("fs");
const path = require("path");

const root = process.cwd();

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isAliasString(value) {
  return typeof value === "string" && /^\s*\{[^}]+\}\s*$/.test(value);
}

function parseAliasPath(value) {
  return value
    .trim()
    .replace(/^\{\s*/, "")
    .replace(/\s*\}$/, "")
    .split(".")
    .map((part) => part.trim())
    .filter(Boolean);
}

function isColorToken(node) {
  if (!isPlainObject(node) || node.$value === undefined) return false;
  if (isAliasString(node.$value)) return true;
  if (node.$type === "color") return true;
  if (typeof node.$value === "string" && /^#|^rgba?\(/i.test(node.$value.trim())) {
    return true;
  }
  if (isPlainObject(node.$value) && (node.$value.hex || node.$value.components)) {
    return true;
  }
  return false;
}

function componentToByte(component) {
  const n = Number(component);
  if (!Number.isFinite(n)) return 0;
  const scaled = n <= 1 ? n * 255 : n;
  return Math.round(Math.min(255, Math.max(0, scaled)));
}

function toHexByte(byte) {
  return byte.toString(16).padStart(2, "0").toUpperCase();
}

function colorValueToCss(value) {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed.startsWith("#")) return trimmed.toUpperCase();
    return trimmed;
  }

  if (!isPlainObject(value)) {
    throw new Error(`Unsupported color value: ${JSON.stringify(value)}`);
  }

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
    throw new Error(
      `Color token is missing both hex and components: ${JSON.stringify(value)}`
    );
  }

  if (!hex.startsWith("#")) hex = `#${hex}`;
  hex = hex.toUpperCase();

  const rgb = hex.length >= 7 ? hex.slice(0, 7) : hex;
  if (alpha < 1) {
    return `${rgb}${toHexByte(Math.round(alpha * 255))}`;
  }
  return rgb;
}

function isIdentifier(part) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(part);
}

function isNumericKey(part) {
  return /^(0|[1-9]\d*)$/.test(part);
}

/** "{brand.50}" → "brand[50]"; "{neutral.600}" → "neutral[600]" */
function aliasToExpression(aliasValue) {
  const parts = parseAliasPath(aliasValue);
  if (parts.length < 2) {
    throw new Error(
      `Alias must include a palette and a step (e.g. "{brand.50}"): ${aliasValue}`
    );
  }

  const [rootName, ...rest] = parts;
  if (!isIdentifier(rootName)) {
    throw new Error(`Invalid base palette name in alias: ${aliasValue}`);
  }

  let expr = rootName;
  for (const part of rest) {
    if (isNumericKey(part)) expr += `[${part}]`;
    else if (isIdentifier(part)) expr += `.${part}`;
    else expr += `[${JSON.stringify(part)}]`;
  }
  return { rootName, expression: expr };
}

function ref(expression, rootName) {
  return { __kind: "ref", expression, rootName };
}

function hex(value) {
  return { __kind: "hex", value };
}

function resolveLeaf(node, pathParts) {
  const value = node.$value;

  if (isAliasString(value)) {
    const { rootName, expression } = aliasToExpression(value);
    return ref(expression, rootName);
  }

  try {
    return hex(colorValueToCss(value));
  } catch (error) {
    throw new Error(
      `${error.message} (at "${pathParts.join(".") || "<root>"}")`
    );
  }
}

function transformTokens(node, pathParts = []) {
  if (isColorToken(node)) {
    return resolveLeaf(node, pathParts);
  }

  if (!isPlainObject(node)) {
    throw new Error(
      `Unexpected non-object token at "${pathParts.join(".") || "<root>"}": ${typeof node}`
    );
  }

  const result = {};
  for (const [key, child] of Object.entries(node)) {
    if (key.startsWith("$")) continue;
    result[key] = transformTokens(child, [...pathParts, key]);
  }
  return result;
}

function collectRefs(node, roots = new Set()) {
  if (isPlainObject(node) && node.__kind === "ref") {
    roots.add(node.rootName);
    return roots;
  }
  if (isPlainObject(node) && !node.__kind) {
    for (const child of Object.values(node)) collectRefs(child, roots);
  }
  return roots;
}

function formatKey(key) {
  if (isIdentifier(key) || isNumericKey(key)) return key;
  return JSON.stringify(key);
}

function formatValue(value, indent) {
  const pad = "  ".repeat(indent);
  const childPad = "  ".repeat(indent + 1);

  if (isPlainObject(value) && value.__kind === "hex") {
    return JSON.stringify(value.value);
  }
  if (isPlainObject(value) && value.__kind === "ref") {
    return value.expression;
  }
  if (typeof value === "string") {
    return JSON.stringify(value);
  }
  if (!isPlainObject(value)) {
    return JSON.stringify(value);
  }

  const entries = Object.entries(value);
  if (entries.length === 0) return "{}";

  const lines = entries.map(
    ([key, child]) =>
      `${childPad}${formatKey(key)}: ${formatValue(child, indent + 1)},`
  );
  return `{\n${lines.join("\n")}\n${pad}}`;
}

function mapLeaves(node, mapFn) {
  if (isPlainObject(node) && (node.__kind === "hex" || node.__kind === "ref")) {
    return mapFn(node);
  }
  if (!isPlainObject(node)) return node;
  const out = {};
  for (const [key, child] of Object.entries(node)) {
    out[key] = mapLeaves(child, mapFn);
  }
  return out;
}

function generateBaseTypeScript(palettes) {
  const names = Object.keys(palettes);
  const blocks = names.map((name) => {
    const plain = mapLeaves(palettes[name], (leaf) => {
      if (leaf.__kind === "hex") return leaf;
      throw new Error(
        `Base palette "${name}" contains an alias (${leaf.expression}). Base colors must be absolute.`
      );
    });
    return `const ${name} = ${formatValue(plain, 0)} as const;`;
  });

  const exportList = [...names].sort((a, b) => a.localeCompare(b)).join(", ");
  return `${blocks.join("\n\n")}\n\nexport { ${exportList} };\n`;
}

function generateColorsTypeScript(colors, importPath = "./base") {
  const roots = [...collectRefs(colors)].sort((a, b) => a.localeCompare(b));
  const importLine =
    roots.length > 0
      ? `import { ${roots.join(", ")} } from ${JSON.stringify(importPath)};\n\n`
      : "";
  return `${importLine}export const colors = ${formatValue(colors, 0)} as const;\n`;
}

function writeFile(filePath, contents) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, contents, "utf8");
  console.log(`Wrote ${path.relative(root, filePath)}`);
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`Input not found: ${filePath}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function parseArgs(argv) {
  const args = {
    baseInput: null,
    colorsInput: null,
    baseOutput: path.resolve(root, "src/constants/base.ts"),
    colorsOutput: path.resolve(root, "src/constants/colors.ts"),
    positional: [],
  };

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--base") args.baseInput = path.resolve(root, argv[++i]);
    else if (arg === "--colors") args.colorsInput = path.resolve(root, argv[++i]);
    else if (arg === "--base-out") args.baseOutput = path.resolve(root, argv[++i]);
    else if (arg === "--colors-out")
      args.colorsOutput = path.resolve(root, argv[++i]);
    else if (arg === "--help" || arg === "-h") args.help = true;
    else args.positional.push(arg);
  }

  return args;
}

function printHelp() {
  console.log(`Usage:
  # Primitives + semantic (aliases → base refs)
  node scripts/tokens-to-colors.js --base <base.tokens.json> --colors <colors.tokens.json>

  # Optional outputs
  --base-out src/constants/base.ts
  --colors-out src/constants/colors.ts

  # Single file (absolute colors only)
  node scripts/tokens-to-colors.js [input.tokens.json] [output.ts]

Alias format in Figma DTCG exports:
  { "background": { "default": { "$type": "color", "$value": "{brand.50}" } } }
`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printHelp();
    return;
  }

  if (args.baseInput || args.colorsInput) {
    if (!args.baseInput || !args.colorsInput) {
      console.error("Provide both --base and --colors token files.");
      printHelp();
      process.exit(1);
    }

    const basePalettes = transformTokens(readJson(args.baseInput));
    const colors = transformTokens(readJson(args.colorsInput));

    writeFile(args.baseOutput, generateBaseTypeScript(basePalettes));
    writeFile(args.colorsOutput, generateColorsTypeScript(colors));
    return;
  }

  const inputPath = path.resolve(
    root,
    args.positional[0] ?? "src/constants/colors1.tokens.json"
  );
  const outputPath = path.resolve(
    root,
    args.positional[1] ?? "src/constants/colors.ts"
  );

  writeFile(outputPath, generateColorsTypeScript(transformTokens(readJson(inputPath))));
}

main();
