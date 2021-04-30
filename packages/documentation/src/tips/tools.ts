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

import { Tip } from './Tip';

export enum ToolTips {
  Point = 'Point',
  LineString = 'LineString',
  Polygon = 'Polygon',
  Text = 'Text',
  Selection = 'Selection',
  EditProperties = 'EditProperties',
}

const undoRedoTip = `
<li><b>Pour annuler</b> maintenez <code>CTRL</code> et appuyez sur <code>Z</code></li>
<li><b>Pour refaire</b> maintenez <code>CTRL</code> et <code>MAJ</code>, et appuyez sur <code>Z</code></li>
`;

export const Tools: Tip[] = [
  {
    id: ToolTips.Point,
    content: `<h4>Outil point</h4>
              <ul>
                <li><b>Pour créer un point</b>, cliquez sur la carte</li>
                <li><b>Pour sélectionner un point</b>, maintenez <code>CTRL</code> et cliquez sur le point</li>
                <li><b>Pour modifier un point</b>, sélectionnez-le, vous pouvez ensuite
                    le déplacer avec votre souris, ou modifier ses caractéristiques</li>
                <li><b>Pour supprimer un point</b>, sélectionnez-le et appuyez sur <code>SUPPR</code></li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.LineString,
    content: `<h4>Outil ligne</h4>
              <ul>
                <li><b>Pour créer une ligne</b>, cliquez sur la carte à plusieurs reprises, puis double-cliquez
                pour terminer la ligne. Vous pouvez interrompre un dessin en appuyant <code>ECHAP</code></li>
                <li><b>Pour sélectionner une ligne</b>, maintenez <code>CTRL</code> et cliquez sur la ligne</li>
                <li><b>Pour modifier une ligne</b>, sélectionnez-la, vous pouvez ensuite avec votre souris créer des sommets,
                déplacer des sommets, ou modifier ses caractéristiques</li>
                <li><b>Pour supprimer une ligne</b>, sélectionnez-la et appuyez sur <code>SUPPR</code></li>
                <li><b>Pour supprimer un sommet</b>, sélectionnez la ligne, maintenez <code>ALT</code> et cliquez sur
                le sommet</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Polygon,
    content: `<h4>Outil polygone</h4>
              <ul>
                <li><b>Pour créer un polygone</b>, cliquez sur la carte à plusieurs reprises, puis double-cliquez
                pour terminer le polygone. Vous pouvez interrompre un dessin en appuyant <code>ECHAP</code></li>
                <li><b>Pour sélectionner un polygone</b>, maintenez <code>CTRL</code> et cliquez sur le polygone</li>
                <li><b>Pour modifier un polygone</b>, sélectionnez-le, vous pouvez ensuite avec votre souris créer des sommets,
                déplacer des sommets, ou modifier ses caractéristiques</li>
                <li><b>Pour supprimer un polygone</b>, sélectionnez-le et appuyez sur <code>SUPPR</code></li>
                <li><b>Pour supprimer un sommet</b>, sélectionnez le polygone, maintenez <code>ALT</code> et cliquez sur
                le sommet</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Text,
    content: `<h4>Outil texte</h4>
              <ul>
                <li><b>Pour ajouter du texte</b>, cliquez sur une géométrie</li>
                <li><b>Pour modifier du texte</b>, cliquez sur une géométrie</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Selection,
    content: `<h4>Outil sélection</h4>
              <ul>
                <li><b>Pour sélectionner des géométries</b>, tracez un rectangle sur la carte et relachez. Vous pouvez ensuite
                déplacer la sélection ou modifier ses caractéristiques </li>
                <li><b>Pour supprimer des géométries</b>, sélectionnez-les et appuyez sur <code>SUPPR</code></li>
                <li><b>Pour dupliquer des géométries</b>, sélectionnez-les et appuyez sur le bouton <code>Dupliquer</code>
                du panneau Sélection</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.EditProperties,
    content: `<h4>Outil texte</h4>
              <ul>
                <li><b>Pour éditer les propriétés</b> d'une géométrie, cliquez sur une géométrie</li>
                ${undoRedoTip}
              </ul>
              `,
  },
];
