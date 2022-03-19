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

import Cls from './VideoElement.module.scss';
import { RenderElementProps } from 'slate-react';
import { Provider } from './Provider';
import { VideoElement as VideoElementDef } from '@abc-map/shared';
import { Youtube } from './providers/Youtube';
import { DefaultIntegration } from './DefaultIntegration';
import { Vimeo } from './providers/Vimeo';
import { Dailymotion } from './providers/Dailymotion';

type Props = RenderElementProps & { element: VideoElementDef };

const Providers: Provider[] = [new Youtube(), new Vimeo(), new Dailymotion()];

export function VideoElement(props: Props) {
  const url = props.element.url;
  const provider = Providers.find((p) => p.canHandle(url));

  return (
    <div {...props.attributes} className={Cls.video}>
      <div className={Cls.integration}>
        {!provider && <DefaultIntegration url={url} />}
        {provider?.getIntegration(url)}
      </div>

      {props.children}
    </div>
  );
}
