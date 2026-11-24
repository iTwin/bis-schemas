/*---------------------------------------------------------------------------------------------
* Copyright (c) Bentley Systems, Incorporated. All rights reserved.
* See LICENSE.md in the project root for license terms and full copyright notice.
*--------------------------------------------------------------------------------------------*/

"use strict";

/**
 * Rejects HTML/script markup in ECSchema free-text fields (description, displayLabel and localized label/description strings).
 */

const fs = require("fs");
const path = require("path");
const argv = require("yargs").argv;

/** HTML element names */
const HTML_TAGS = [
  "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio",
  "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button",
  "canvas", "caption", "center", "cite", "code", "col", "colgroup", "command", "content",
  "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt",
  "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset",
  "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html",
  "i", "iframe", "image", "img", "input", "ins", "isindex", "kbd", "keygen",
  "label", "legend", "li", "link", "listing", "main", "map", "mark", "marquee", "math", "menu", "menuitem", "meta", "meter",
  "nav", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output",
  "p", "param", "picture", "plaintext", "portal", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby",
  "s", "samp", "script", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "svg",
  "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt",
  "u", "ul", "var", "video", "wbr", "xmp",
];

// Browsers only recognise a tag when the name immediately follows "<" or "</"
const htmlTagPattern = new RegExp(`</?(?:${HTML_TAGS.join("|")})(?=[\\s/>]|$)`, "i");

const checks = [
  { name: "HTML element", pattern: htmlTagPattern },
  { name: "element with attributes", pattern: /<[a-z][\w:.-]*\s+[a-z_:][\w:.-]*\s*=/i },
  { name: "HTML comment or declaration", pattern: /<!/ },
  { name: "processing instruction", pattern: /<\?/ },
  { name: "inline event handler", pattern: /\bon[a-z]+\s*=/i },
  { name: "javascript: URI", pattern: /javascript\s*:/i },
  { name: "vbscript: URI", pattern: /vbscript\s*:/i },
  { name: "data:text/html URI", pattern: /data\s*:\s*text\/html/i },
  { name: "double-encoded character reference", pattern: /&(?:#\d+|#x[0-9a-f]+|[a-z][a-z0-9]*);/i },
];

/**
 * Decode the XML character references that matter here so that entity-encoded markup
 * ("&lt;script&gt;") is examined in the form a downstream Markdown generator would emit.
 */
function decodeXmlEntities(value) {
  return value
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}

/**
 * Returns a description of the offending markup, or undefined if the text is clean.
 * @param {string} text Decoded free text.
 */
function findMarkup(text) {
  if (typeof text !== "string" || text.length === 0)
    return undefined;

  for (const check of checks) {
    const match = check.pattern.exec(text);
    if (match)
      return `${check.name} '${match[0].trim()}'`;
  }
  return undefined;
}

/**
 * ECSchema XML attributes whose values are schema-author free text and are copied verbatim into generated documentation.
 * Names, aliases, versions and other identifiers are validated by the EC parser and are not scanned.
 */
const xmlTextAttributes = ["description", "displayLabel", "roleLabel", "definition", "uomSeparator", "extendedTypeName", "presentationUnits"];
const xmlAttributePattern = new RegExp(`\\b(${xmlTextAttributes.join("|")})\\s*=\\s*(?:"([^"]*)"|'([^']*)')`, "g");
const deprecatedDescriptionPattern = /<Description\s*>([\s\S]*?)<\/Description\s*>/g;
const deprecatedInstancePattern = /<Deprecated(?:\s[^>]*)?>([\s\S]*?)<\/Deprecated\s*>/g;

/** Converts a character offset in `text` into a 1-based line number. */
function lineNumberAt(text, offset) {
  let line = 1;
  for (let i = 0; i < offset; i++) {
    if (text.charCodeAt(i) === 10)
      line++;
  }
  return line;
}

/**
 * Scan an ECSchema XML file. Returns an array of { line, field, reason } findings.
 * The whole file is scanned as one string (not line by line) because XML attribute values and
 * element text may legally span several lines.
 */
function scanSchemaXml(filePath) {
  const findings = [];
  const text = fs.readFileSync(filePath, "utf8");
  let match;

  xmlAttributePattern.lastIndex = 0;
  while ((match = xmlAttributePattern.exec(text)) !== null) {
    const raw = match[2] !== undefined ? match[2] : match[3];
    const reason = findMarkup(decodeXmlEntities(raw));
    if (reason)
      findings.push({ line: lineNumberAt(text, match.index), field: match[1], reason });
  }

  deprecatedInstancePattern.lastIndex = 0;
  while ((match = deprecatedInstancePattern.exec(text)) !== null) {
    const body = match[1];
    const bodyOffset = match.index + match[0].indexOf(body);
    let descMatch;
    deprecatedDescriptionPattern.lastIndex = 0;
    while ((descMatch = deprecatedDescriptionPattern.exec(body)) !== null) {
      const reason = findMarkup(decodeXmlEntities(descMatch[1]));
      if (reason)
        findings.push({ line: lineNumberAt(text, bodyOffset + descMatch.index), field: "Deprecated.Description", reason });
    }
  }

  findings.sort((a, b) => a.line - b.line);
  return findings;
}

const jsonTextKeys = new Set(["description", "displayLabel", "label"]);

/** Scan a localization JSON file. Returns an array of { line, field, reason } findings. */
function scanLocalizationJson(filePath) {
  const findings = [];
  let json;
  try {
    json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return findings; // malformed JSON is reported by LocalizationValidation
  }

  const visit = (node, jsonPath) => {
    if (Array.isArray(node)) {
      node.forEach((item, i) => visit(item, `${jsonPath}[${i}]`));
    } else if (node && typeof node === "object") {
      for (const [key, value] of Object.entries(node)) {
        const childPath = jsonPath ? `${jsonPath}.${key}` : key;
        if (jsonTextKeys.has(key) && typeof value === "string") {
          const reason = findMarkup(value);
          if (reason)
            findings.push({ line: undefined, field: childPath, reason });
        } else {
          visit(value, childPath);
        }
      }
    }
  };
  visit(json, "");
  return findings;
}

/**
 * Directories excluded from the scan.
 */
const skippedAnywhere = new Set([".git", "node_modules"]);
const skippedAtRoot = new Set(["lib", "packageOut", "testOut", "tools"]);

function* enumerateFiles(root, isRoot = true) {
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const fullPath = path.join(root, entry.name);
    if (entry.isDirectory()) {
      if (skippedAnywhere.has(entry.name) || (isRoot && skippedAtRoot.has(entry.name)))
        continue;
      yield* enumerateFiles(fullPath, false);
    } else if (entry.name.endsWith(".ecschema.xml")) {
      yield { path: fullPath, kind: "xml" };
    } else if (entry.name.endsWith(".json") && path.basename(root) === "Locales") {
      yield { path: fullPath, kind: "json" };
    }
  }
}

/**
 * Validate every schema and localization file under bisRoot. Throws if any markup is found.
 * @returns {number} the number of files scanned.
 */
function validateMarkup(bisRoot) {
  const errors = [];
  let scanned = 0;

  for (const file of enumerateFiles(bisRoot)) {
    scanned++;
    const findings = file.kind === "xml" ? scanSchemaXml(file.path) : scanLocalizationJson(file.path);
    const relative = path.relative(bisRoot, file.path);
    for (const finding of findings) {
      const location = finding.line ? `${relative}:${finding.line}` : relative;
      errors.push(`${location} - ${finding.field} contains ${finding.reason}`);
    }
  }

  if (errors.length > 0)
    throw new Error(`Markup validation failed. HTML/script markup is not permitted in schema descriptions or labels:\n  ${errors.join("\n  ")}`);

  return scanned;
}

module.exports = { findMarkup, decodeXmlEntities, scanSchemaXml, scanLocalizationJson, validateMarkup };

if (require.main === module) {
  const bisRoot = path.resolve(argv.BisRoot || path.join(__dirname, "../../"));
  if (!fs.existsSync(bisRoot))
    throw new Error("Could not find BIS root path.");

  try {
    const scanned = validateMarkup(bisRoot);
    console.log(`Markup validation succeeded: ${scanned} schema/localization files contain no HTML markup in descriptions or labels.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
