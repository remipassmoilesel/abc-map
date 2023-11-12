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

import { IconName, PointIcon } from '@abc-map/point-icons';
import { Logger } from '@abc-map/shared';
import EventEmitter from 'eventemitter3';
import debounce from 'lodash/debounce';
import { PointIconsApiClient } from './PointIconsApiClient';

const logger = Logger.get('IconProcessor.ts');

export interface IconDownloaded {
  type: 'icon-downloaded';
  names: IconName[];
}

export type IconProcessorEvent = IconDownloaded;

const ProcessorEvent = 'icon-processor-event';

const serializer = new XMLSerializer();

let instance: IconProcessor | undefined;

export class IconProcessor {
  public static get(): IconProcessor {
    if (!instance) {
      instance = new IconProcessor(PointIconsApiClient.create());
    }
    return instance;
  }

  private rawIconCache: Map<string, { icon: PointIcon; content: string }> = new Map();
  private preparedIconCache = new Map<string, string>();
  private downloadQueue: { icon: PointIcon }[] = [];

  private emitter = new EventEmitter();

  constructor(private iconsApiClient: PointIconsApiClient) {}

  /**
   * Return an SVG data URL containing the specified icon at the specified size and color.
   *
   * If specified icon has not been downloaded yet, returns undefined while downloading icon in "background".
   * An event will be emitted when specified icon will be ready. You should listen these events to rerender UI.
   *
   * @param icon
   * @param size
   * @param color
   */
  public prepare(icon: PointIcon, size: number, color: string): string | undefined {
    const cacheKey = JSON.stringify([icon.name, size, color]);
    const prepared = this.preparedIconCache.get(cacheKey);

    // Icon is ready, we return a cacheable icon
    if (prepared) {
      return prepared;
    }

    // Icon has already been downloaded, we prepare it
    // We MUST keep this step otherwise exports will fail
    const raw = this.rawIconCache.get(icon.name);
    if (raw) {
      const prepared = this.prepareSvg(icon, raw.content, size, color);
      this.preparedIconCache.set(cacheKey, prepared);

      return prepared;
    }

    // Icon is not yet downloaded, we download it for later calls
    else {
      const alreadyQueued = this.downloadQueue.find((itemB) => itemB.icon.name === icon.name);
      if (!alreadyQueued) {
        this.downloadQueue.push({ icon });
        this.prepareWaitingIcons();
      }
    }
  }

  private prepareWaitingIcons = debounce(() => {
    const toDownload = this.downloadQueue.map(({ icon }) => icon.name);

    this.iconsApiClient
      .getIcons(toDownload)
      .then((icons) => {
        icons.forEach(({ icon, content }) => {
          this.rawIconCache.set(icon.name, { icon, content });
        });

        // We empty the download queue
        this.downloadQueue = [];

        // We emit event
        const event: IconProcessorEvent = { type: 'icon-downloaded', names: toDownload };
        this.emitter.emit(ProcessorEvent, event);
      })
      .catch((err) => logger.error('Icon preparation failed: ', err));
  }, 10);

  public prepareSvg(icon: PointIcon, svgContent: string, size: number, color: string): string {
    const { svg } = mountSvg(svgContent);

    // We set size. Viewbox attribute must be set in icons.
    svg.setAttribute('width', `${size}`);
    svg.setAttribute('height', `${size}`);

    const staticColors = icon.staticColors ?? false;
    if (!staticColors) {
      if (svg.getAttribute('fill')) {
        svg.setAttribute('fill', color);
      }

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
    }

    // We MUST use XML serializer here, otherwise SVG will not render
    const serialized = btoa(
      serializer.serializeToString(svg).replace(/[\u00A0-\u2666]/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
      })
    );

    return `data:image/svg+xml;base64,${serialized}`;
  }

  public addEventListener(listener: (ev: IconProcessorEvent) => void): void {
    this.emitter.addListener(ProcessorEvent, listener);
  }

  public removeEventListener(listener: (ev: IconProcessorEvent) => void): void {
    this.emitter.removeListener(ProcessorEvent, listener);
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
