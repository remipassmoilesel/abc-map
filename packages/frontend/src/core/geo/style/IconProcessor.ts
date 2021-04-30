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

import { PointIcon } from './PointIcons';

const serializer = new XMLSerializer();

export class IconProcessor {
  /**
   * Create an image element with specified characteristics.
   *
   * Here we could use URL.createObjectURL() instead of base64 data uri, but it is not a great optimization and
   * it does not render well with openlayers when changing icon.
   *
   * @param icon
   * @param size
   * @param color
   */
  public static prepare(icon: PointIcon, size: number, color: string): HTMLImageElement {
    const { svg } = mountSvg(icon.contentSvg);

    // We set size. Viewbox attribute is set in icons (see tests).
    svg.setAttribute('width', `${size}`);
    svg.setAttribute('height', `${size}`);

    // We set colors
    const children = svg.getElementsByTagName('*');
    for (let i = 0; i < children.length; i++) {
      const child = children.item(i);
      if (!child || !(child instanceof SVGElement)) {
        continue;
      }

      if (child.style.fill && child.style.fill !== 'none') {
        child.style.fill = color;
      }
      if (child.style.color && child.style.color !== 'none') {
        child.style.color = color;
      }
    }

    // We MUST use XML serializer here, otherwise SVG will not render
    const serialized = btoa(serializer.serializeToString(svg));

    const image = document.createElement('img');
    image.src = `data:image/svg+xml;base64,${serialized}`;
    image.width = size;
    image.height = size;

    return image;
  }
}

export function mountSvg(svgContent: string): { support: HTMLDivElement; svg: SVGElement } {
  const support = document.createElement('div');
  support.innerHTML = svgContent;
  const svg = support.querySelector('svg') as SVGElement | undefined;
  if (!svg) {
    throw new Error('Invalid svg icon');
  }
  return { support, svg };
}
