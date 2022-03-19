/**
 * Copyright © 2021 Rémi Pace.
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

import { AbcFile, AbcLayout, AbcTextFrame, Logger, TextFrameChild } from '@abc-map/shared';
import { nanoid } from 'nanoid';
import { cloneDeep } from 'lodash';

const logger = Logger.get('TextFrameHelpers');

// FIXME: we should cache images per source links
export class TextFrameHelpers {
  public static async extractImagesFromLayouts(input: AbcLayout[]): Promise<[AbcFile[], AbcLayout[]]> {
    let images: AbcFile[] = [];
    const output: AbcLayout[] = [];
    for (const layout of input) {
      const [imgs, frames] = await this.extractImagesFromFrames(layout.textFrames);
      images = images.concat(imgs);
      output.push({ ...layout, textFrames: frames });
    }

    return [images, output];
  }

  private static async extractImagesFromFrames(input: AbcTextFrame[]): Promise<[AbcFile[], AbcTextFrame[]]> {
    let images: AbcFile[] = [];
    const output: AbcTextFrame[] = [];

    for (const frame of input) {
      const [imgs, content] = await this.extractImagesFromElements(frame.content);
      images = images.concat(imgs);
      output.push({ ...frame, content });
    }

    return [images, output];
  }

  private static async extractImagesFromElements(input: TextFrameChild[]): Promise<[AbcFile[], TextFrameChild[]]> {
    let images: AbcFile[] = [];
    const output: TextFrameChild[] = [];

    for (const element of input) {
      // Element is an image, we extract blob from URL and replace url by a local path
      if (element && 'type' in element && element.type === 'image') {
        const path = `/images/image-${nanoid()}`;
        const file = await fetch(element.url)
          .then((response) => response.blob())
          .then((blob) => ({ path, content: blob }));

        images.push(file);
        output.push({ ...element, url: path });
      }
      // Element is not an image but have children, we inspect it
      else if ('children' in element) {
        const [imgs, children] = await this.extractImagesFromElements(element.children);
        images = images.concat(imgs);
        output.push({ ...element, children } as TextFrameChild);
      }
      // Element is leaf
      else {
        output.push(element);
      }
    }

    return [images, output];
  }

  public static loadImagesOfLayouts(layouts: AbcLayout[], files: AbcFile<Blob>[]): AbcLayout[] {
    return layouts.map((layout) => ({ ...layout, textFrames: this.loadImagesOfFrames(layout.textFrames, files) }));
  }

  private static loadImagesOfFrames(input: AbcTextFrame[], files: AbcFile<Blob>[]): AbcTextFrame[] {
    return input.map((frame) => ({ ...frame, content: this.loadImagesOfElements(frame.content, files) }));
  }

  private static loadImagesOfElements(input: TextFrameChild[], files: AbcFile<Blob>[]): TextFrameChild[] {
    const output: TextFrameChild[] = [];

    for (const element of input) {
      // Element is an image, we create blob url from file
      // If file does not exists we use original path to create a broken image element
      if (element && 'type' in element && element.type === 'image') {
        const file = files.find((f) => f.path === element.url);
        if (!file) {
          logger.error(`Image with path ${element.url} not found, cannot load it`);
        }

        const path = file ? URL.createObjectURL(file.content) : element.url;
        output.push({ ...element, url: path });
      }
      // Element is not an image but have children, we inspect it
      else if ('children' in element) {
        output.push({ ...element, children: this.loadImagesOfElements(element.children, files) } as TextFrameChild);
      }
      // Element is leaf
      else {
        output.push(element);
      }
    }

    return output;
  }

  public static clone(frame: AbcTextFrame): AbcTextFrame {
    return {
      ...cloneDeep(frame),
      id: nanoid(),
    };
  }
}
