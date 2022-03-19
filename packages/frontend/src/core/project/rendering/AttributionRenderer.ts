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

import { Logger } from '@abc-map/shared';
import { CanvasHelper } from '../../utils/CanvasHelper';
import mainIcon from '../../../assets/main-icon.png';

export const logger = Logger.get('AttributionRenderer');

export class AttributionRenderer {
  private readonly softwareAttribution = 'Abc-Map';

  public async render(attributions: string[], canvas: HTMLCanvasElement, styleRatio: number): Promise<void> {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Cannot get context2D');
    }

    // Load and size software icon
    const softwareIcon = await this.loadSoftwareIcon();
    const iconWidth = (softwareIcon.width / 8) * styleRatio;
    const iconHeight = (softwareIcon.height / 8) * styleRatio;

    // Estimate size of attributions
    const fontSize = 15 * styleRatio;
    ctx.fillStyle = 'black';
    ctx.font = `${fontSize}px AbcCantarell`;

    const margin = 10 * styleRatio;
    let width = 0;
    let height = 0;
    for (const attr of attributions) {
      const w = ctx.measureText(attr).width + margin * 2;
      width = width < w ? w : width;
      height += fontSize + margin;
    }

    // Take in account software attribution in whole size
    const sw = ctx.measureText(this.softwareAttribution).width + margin * 3 + iconWidth;
    width = width < sw ? sw : width;
    height += fontSize + margin * 2.5;

    // Set canvas are, clean attributions area
    canvas.width = width;
    canvas.height = height;
    ctx.globalAlpha = 0.6;

    CanvasHelper.roundedRectangle(ctx, 0, 0, canvas.width, canvas.height, 7 * styleRatio, undefined, 'white');

    // Draw data attributions
    const x = margin;
    let y = fontSize + margin;
    for (const attr of attributions) {
      ctx.fillStyle = 'black';
      ctx.font = `${fontSize}px AbcCantarell`;
      ctx.fillText(attr, x, y);
      y += fontSize + margin;
    }

    // Draw software attributions
    ctx.drawImage(softwareIcon, x, y - fontSize, iconWidth, iconHeight);
    ctx.fillStyle = 'black';
    ctx.font = `${fontSize}px AbcCantarell`;
    ctx.fillText('Abc-Map', x + iconWidth + margin, y);
  }

  private loadSoftwareIcon(): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onerror = reject;
      image.onload = () => {
        resolve(image);
      };

      image.src = mainIcon;
    });
  }
}
