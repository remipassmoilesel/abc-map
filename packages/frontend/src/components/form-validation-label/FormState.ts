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

export enum FormState {
  Ok = 'Ok',

  InvalidEmail = 'InvalidEmail',
  InvalidPassword = 'InvalidPassword',
  PasswordTooWeak = 'PasswordTooWeak',
  PasswordNotConfirmed = 'PasswordNotConfirmed',
  PasswordEqualEmail = 'PasswordEqualEmail',
  DeletionNotConfirmed = 'DeletionNotConfirmed',
  InvalidUrl = 'InvalidUrl',
  MissingXYZPlaceHolders = 'MissingXYZPlaceHolders',
  MissingRemoteLayer = 'MissingRemoteLayer',

  MissingNewLayerName = 'MissingLayerName',
  MissingDataSource = 'MissingDataSource',
  MissingDataJoinBy = 'MissingDataJoinBy',
  MissingGeometryJoinBy = 'MissingGeometryJoinBy',
  MissingAlgorithm = 'MissingAlgorithm',

  MissingSymbolValueField = 'MissingSymbolValueField',
  MissingSymbolType = 'MissingSymbolType',
  MissingSizeMin = 'MissingSizeMin',
  MissingSizeMax = 'MissingSizeMax',
  InvalidSizeMinMax = 'InvalidSizeMinMax',

  MissingColorValueField = 'MissingColorValueField',
  MissingGeometryLayer = 'MissingGeometryLayer',
  MissingStartColor = 'MissingStartColor',
  MissingEndColor = 'MissingEndColor',
}
