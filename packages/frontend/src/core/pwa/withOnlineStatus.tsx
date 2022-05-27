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

import * as React from 'react';
import { OnlineStatusContext } from './OnlineStatusContext';

export interface OnlineStatusProps {
  /**
   * True if we are online
   */
  onlineStatus: boolean;
}

declare type WrappedComponent<P> = React.ComponentClass<Omit<P, keyof OnlineStatusProps>>;

export function withOnlineStatus<P extends OnlineStatusProps>(Component: React.ComponentType<P>): WrappedComponent<P> {
  class OnlineStatusContextWrapper extends React.Component<any, any> {
    public render() {
      return <OnlineStatusContext.Consumer>{(value) => <Component {...(this.props as P)} onlineStatus={value} />}</OnlineStatusContext.Consumer>;
    }
  }

  return OnlineStatusContextWrapper;
}
