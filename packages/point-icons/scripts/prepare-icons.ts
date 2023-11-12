#!/usr/bin/env node
/**
 * Copyright © 2023 Rémi Pace.
 * This file is part of Abc-Map.
 *
 * Abc-Map is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of
 * the License, or (at your option) any later version.
 *
 * Abc-Map is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General
 * Public License along with Abc-Map. If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable */

import * as fs from 'fs';
import * as path from 'path';
import camelCase from 'camelcase';
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser';
import * as process from 'process';

/*
 * This script prepare a directory of SVG files for icon usage, and generate typescript code.
 *
 * Usage:
 *
 *      $ ts-node prepare-icons.ts
 *
 */

interface Settings {
  directoryName: string;
  category?: string;
  staticColors?: boolean;
}

main({ directoryName: 'iso7010', category: 'Iso7010' }).catch((err) => {
  console.error(err);
  process.exit(1);
});

async function main(options: Settings) {
  const { directoryName, category, staticColors } = options;
  const targetFullPath = path.resolve(__dirname, '../icons/', directoryName);

  let fileNames = fs.readdirSync(targetFullPath);

  // We fix svg
  await fixSvgs(targetFullPath, fileNames);

  // Create generated-PointIcon.ts
  generatePointIconsDotTs(directoryName, fileNames);

  // Create file generated-icons.ts
  generateIconsFileDotTs(directoryName, category, staticColors, fileNames);
}

async function fixSvgs(targetFullPath: string, fileNames: string[]) {
  console.warn('Warning, fixSvgs() can break icons');
  const parser = new XMLParser({
    ignoreAttributes: false,
    preserveOrder: true,
    attributeNamePrefix: '@_',
    allowBooleanAttributes: true,
  });
  const builder = new XMLBuilder({
    ignoreAttributes: false,
    preserveOrder: true,
    attributeNamePrefix: '@_',
    format: true,
  });

  for (const file of fileNames) {
    if (!file.endsWith('.svg')) {
      console.log('Skipping non-SVG file ' + file);
      continue;
    }

    try {
      const filePath = path.resolve(targetFullPath, file);
      const fileContent = fs.readFileSync(filePath).toString('utf-8');
      const xml = await parser.parse(fileContent);

      // We remove sensitive svg parts. Some properties can hurt svg rendering with openlayers.
      cleanXmlObject(xml);

      // We add missing svg view boxes
      fixSvgViewBoxes(xml);

      const cleaned = builder.build(xml);
      if (cleaned !== fileContent) {
        fs.writeFileSync(filePath, cleaned);
      }
    } catch (err) {
      console.error('Error processing file ' + file, err);
    }
  }
}

function generatePointIconsDotTs(directoryName: string, fileNames: string[]) {
  let enumMembers = '';
  for (const file of fileNames) {
    if (!file.endsWith('.svg')) {
      console.log('Skipping non-SVG file ' + file);
      continue;
    }

    enumMembers += `${fileToIconName(file)}="${directoryName}/${file}",\n`;
  }
  fs.writeFileSync('generated-PointIcon.ts', pointIconDotTsTemplate(enumMembers));
}

function generateIconsFileDotTs(directoryName: string, category: string | undefined, staticColors: boolean | undefined, fileNames: string[]) {
  let imports = `import {IconName} from "./IconName"\n`;
  let icons = '';
  for (const file of fileNames) {
    if (!file.endsWith('.svg')) {
      console.log('Skipping non-SVG file ' + file);
      continue;
    }

    const safeName = fileToIconName(file);
    imports += `import ${safeName} from "./${directoryName}/${file}"\n`;

    const categoryField = typeof category !== 'undefined' ? `category: IconCategory.${category},` : ``;
    icons += `{ name: IconName.${safeName}, contentSvg: ${safeName}, ${categoryField} staticColors: ${staticColors ?? false} },\n`;
  }
  fs.writeFileSync('generated-icons.ts', iconsDotTsTemplate(imports, icons));
}

const xmlPropertiesToClean = ['metadata', 'sodipodi', 'inkscape', 'xmlns:dc', 'xmlns:cc', 'xmlns:rdf'];
function cleanXmlObject(xml: unknown) {
  if (!xml) {
    return;
  }

  if (Array.isArray(xml)) {
    for (const item of xml) {
      cleanXmlObject(item);
    }
  }

  if (typeof xml === 'object') {
    const xmlObj = xml as { [k: string]: unknown };
    for (const k of Object.keys(xmlObj)) {
      if (xmlPropertiesToClean.includes(k)) {
        delete xmlObj[k];
      }

      cleanXmlObject(xmlObj[k]);
    }
  }
}

function fixSvgViewBoxes(xml: any) {
  const svg = xml && xml.find((node: any) => node.svg);
  if (!svg) {
    return;
  }

  if (svg[':@']['@_viewBox']) {
    return;
  }

  const width = svg[':@']['@_width'];
  const height = svg[':@']['@_height'];
  if (typeof width === 'undefined' || typeof height === 'undefined') {
    return;
  }

  const vbWidth = Math.round(parseFloat(width.replaceAll(/[^\.0-9]+/gi, '')));
  const vbHeight = Math.round(parseFloat(height.replaceAll(/[^\.0-9]+/gi, '')));
  svg[':@']['@_viewBox'] = `0 0 ${vbWidth} ${vbHeight}`;
}

function fileToIconName(fileName: string) {
  return `Icon${camelCase(fileName.replace('.svg', ''), { pascalCase: true })}`;
}

function pointIconDotTsTemplate(content: string) {
  return `
export enum IconName {
  ${content}
}
`;
}

function iconsDotTsTemplate(imports: string, icons: string) {
  return `
${imports}

export const AllIcons = [
  ${icons}
]

`;
}
