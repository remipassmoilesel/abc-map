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

import { getServices, Services } from '../../core/Services';
import { Logger } from '@abc-map/shared';
import Mousetrap from 'mousetrap';

const logger = Logger.get('SharedMapKeyboardListener.ts');

export class SharedMapKeyboardListener {
  public static create() {
    return new SharedMapKeyboardListener(getServices());
  }

  constructor(private services: Services) {}

  public initialize(): void {
    Mousetrap.bind('left', this.goPrevious);
    Mousetrap.bind('down', this.goPrevious);
    Mousetrap.bind('pagedown', this.goPrevious);

    Mousetrap.bind('right', this.goNext);
    Mousetrap.bind('up', this.goNext);
    Mousetrap.bind('pageup', this.goNext);
  }

  public destroy(): void {
    Mousetrap.unbind('left');
    Mousetrap.unbind('down');
    Mousetrap.unbind('pagedown');

    Mousetrap.unbind('right');
    Mousetrap.unbind('up');
    Mousetrap.unbind('pageup');
  }

  private goPrevious = () => this.move(-1);

  private goNext = () => this.move(+1);

  private move(direction: number) {
    const { project } = this.services;

    const views = project.getSharedViews();
    const active = project.getActiveSharedView();
    const next = views.findIndex((view) => view.id === active?.id) + direction;

    if (next < 0) {
      return;
    }
    if (next >= views.length) {
      return;
    }

    project.setActiveSharedView(views[next].id);
  }
}
