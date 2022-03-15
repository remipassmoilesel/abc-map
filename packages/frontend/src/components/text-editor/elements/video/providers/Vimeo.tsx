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

import React from 'react';
import { Provider } from '../Provider';
import { DefaultIntegration } from '../DefaultIntegration';

const urlRegexp = /vimeo\.com\/([0-9]+)/i;

export class Vimeo implements Provider {
  public canHandle(url: string): boolean {
    return !!this.extractVideoId(url);
  }

  public getIntegration(url: string): React.ReactNode {
    const videoId = this.extractVideoId(url);
    if (!videoId) {
      return <DefaultIntegration url={url} />;
    }

    return (
      <iframe
        title="Vimeo video player"
        src={`https://player.vimeo.com/video/${videoId}`}
        frameBorder="0"
        allow="fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }

  private extractVideoId(url: string): string | undefined {
    const match = url.match(urlRegexp);
    if (!match || !match.length) {
      return;
    }

    return match[1];
  }
}
