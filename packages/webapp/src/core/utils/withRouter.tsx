/**
 * Copyright © 2022 Rémi Pace.
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

import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

declare type RouteParams = { [k: string]: string | undefined };

export interface WithRouterProps<RP extends RouteParams = any> {
  router: RouterProps<RP>;
  searchParams: URLSearchParams;
}

interface RouterProps<RP extends RouteParams> {
  navigate: (s: string) => void;
  params?: RP;
  searchParams: URLSearchParams;
}

declare type WrappedComponent<P, RP extends RouteParams> = React.FunctionComponent<Omit<P, keyof WithRouterProps<RP>>>;

export function withRouter<Props = any, RP extends RouteParams = any>(Component: React.ComponentType<Props>): WrappedComponent<Props, RP> {
  const WithRouterWrapper = (props: Props) => {
    const navigate = useNavigate();
    const params = useParams<RP>();
    const [searchParams] = useSearchParams();
    const router: RouterProps<RP> = { navigate, params: params as RP, searchParams };

    return <Component {...props} router={router} />;
  };

  // FIXME: find better return type
  return WithRouterWrapper as WrappedComponent<Props, RP>;
}
