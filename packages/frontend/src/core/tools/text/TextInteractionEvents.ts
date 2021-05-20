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

import Feature from 'ol/Feature';
import Geometry from 'ol/geom/Geometry';
import BaseEvent from 'ol/events/Event';

export enum TextEvent {
  Start = 'text-start',
  Changed = 'text-changed',
  End = 'text-end',
}

export class TextStart extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>, public readonly text: string) {
    super(TextEvent.Start);
  }
}

export class TextChanged extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>, public readonly text: string) {
    super(TextEvent.Changed);
  }
}

export class TextEnd extends BaseEvent {
  constructor(public readonly feature: Feature<Geometry>, public readonly text: string) {
    super(TextEvent.End);
  }
}
