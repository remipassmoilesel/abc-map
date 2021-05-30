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
import { Services } from './Services';

export interface ServiceProps {
  services: Services;
}

const ServiceContext = React.createContext<Services | false>(false);

export const ServiceProvider = ServiceContext.Provider;

declare type WrappedComponent<P> = React.ComponentClass<Omit<P, keyof ServiceProps>>;

export function withServices<P extends ServiceProps>(Component: React.ComponentType<P>): WrappedComponent<P> {
  class ServiceWrapper extends React.Component<any, any> {
    public render() {
      return (
        <ServiceContext.Consumer>
          {(value) => {
            if (!value) {
              throw new Error(`You should not use ${Component.displayName} outside a <ServiceProvider>`);
            }
            return <Component {...(this.props as P)} services={value} />;
          }}
        </ServiceContext.Consumer>
      );
    }
  }

  return ServiceWrapper;
}
