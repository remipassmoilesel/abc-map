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

import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Routes } from '../../routes';
import { BundledModuleId, LegacyRouteRedirections } from '@abc-map/shared';

// See LegacyRoutesRedirectionController.ts too

const toDocumentation = LegacyRouteRedirections.ToDocumentation.map((regexp) => new RegExp(regexp, 'i'));
const toLanding = LegacyRouteRedirections.ToLanding.map((regexp) => new RegExp(regexp, 'i'));

export function useRedirectLegacyRoutes() {
  const location = useLocation();
  const navigate = useNavigate();

  // We redirect old routes
  useEffect(() => {
    if (toDocumentation.find((regexp) => location.pathname.match(regexp))) {
      navigate(Routes.module().withParams({ moduleId: BundledModuleId.Documentation }));
    }

    if (toLanding.find((regexp) => location.pathname.match(regexp))) {
      navigate(Routes.landing().format());
    }
  }, [location, navigate]);
}
