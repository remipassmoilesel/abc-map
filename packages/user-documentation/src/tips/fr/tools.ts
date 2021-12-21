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

import { Tip } from '../Tip';
import { ToolTips } from '../tip-ids';

const undoRedoTip = `
<li><b>Pour annuler</b> maintenez <code>CTRL</code> et appuyez sur <code>Z</code></li>
<li><b>Pour refaire</b> maintenez <code>CTRL</code> et <code>MAJ</code>, et appuyez sur <code>Z</code></li>
`;

const moveMapTip = `
<li><b>Pour déplacez la carte</b>, activez le mode <code>Déplacer la carte</code> et déplacez la carte avec votre souris</li>
`;

const selectTips = `
<li><b>Pour sélectionner une géométrie</b>, activez le mode <code>Modifier</code> et cliquez sur la géométrie</li>
<li><b>Pour désélectionner une géométrie</b>, cliquez à nouveau sur la géométrie sélectionnée</li>
`;

export const Tools: Tip[] = [
  {
    id: ToolTips.Point,
    content: `<h4>Outil point</h4>
              <ul>
                ${moveMapTip}
                <li><b>Pour créer un point</b>, activez le mode <code>Créer</code> et cliquez sur la carte</li>
                ${selectTips}
                <li><b>Pour modifier un point</b>, sélectionnez-le, vous pouvez ensuite le déplacer avec votre souris,
                    ou modifier ses caractéristiques</li>
                <li><b>Pour supprimer un point</b>, sélectionnez-le et appuyez sur <code>SUPPR</code></li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.LineString,
    content: `<h4>Outil ligne</h4>
              <ul>
                ${moveMapTip}
                <li><b>Pour créer une ligne</b>, activez le mode <code>Créer</code> et cliquez sur la carte à plusieurs reprises,
                puis double-cliquez pour terminer la ligne. Vous pouvez interrompre un dessin en appuyant <code>ECHAP</code></li>
                ${selectTips}
                <li><b>Pour modifier une ligne</b>, sélectionnez-la, vous pouvez ensuite créer des sommets,
                    déplacer des sommets, ou modifier ses caractéristiques</li>
                <li><b>Pour supprimer une ligne</b>, sélectionnez-la et appuyez sur <code>SUPPR</code></li>
                <li><b>Pour supprimer un sommet</b>, sélectionnez la ligne, maintenez <code>SHIFT</code> et cliquez sur
                    le sommet</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Polygon,
    content: `<h4>Outil polygone</h4>
              <ul>
                ${moveMapTip}
                <li><b>Pour créer un polygone</b>, activez le mode <code>Créer</code> et cliquez sur la carte à plusieurs reprises, puis double-cliquez
                    pour terminer le polygone. Vous pouvez interrompre un dessin en appuyant <code>ECHAP</code></li>
                ${selectTips}
                <li><b>Pour modifier un polygone</b>, sélectionnez-le, vous pouvez ensuite avec votre souris créer des sommets,
                    déplacer des sommets, ou modifier ses caractéristiques</li>
                <li><b>Pour supprimer un polygone</b>, sélectionnez-le et appuyez sur <code>SUPPR</code></li>
                <li><b>Pour supprimer un sommet</b>, sélectionnez le polygone, maintenez <code>SHIFT</code> et cliquez sur
                    le sommet</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Text,
    content: `<h4>Outil texte</h4>
              <ul>
                ${moveMapTip}
                <li><b>Pour ajouter du texte</b>, activez le mode <code>Editer le texte</code> et cliquez sur une géométrie. Un contrôle
                de saisie apparaît, saisissez votre texte puis cliquez sur <code>OK</code></li>
                <li><b>Pour modifier du texte</b>, activez le mode <code>Editer le texte</code> et cliquez sur une géométrie</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.Selection,
    content: `<h4>Outil sélection</h4>
              <ul>
                ${moveMapTip}
                <li><b>Pour sélectionner des géométries</b>, tracez un rectangle sur la carte puis relâchez</li>
                <li><b>Pour déplacer des géométries</b>, sélectionnez les puis <code>cliquez-glisser</code> les</li>
                <li><b>Pour supprimer des géométries</b>, sélectionnez les puis appuyez sur <code>SUPPR</code></li>
                <li><b>Pour dupliquer des géométries</b>, sélectionnez les puis cliquez sur le bouton <code>Dupliquer</code></li>
                <li><b>Pour modifier les caractéristiques de plusieurs géométries</b>, sélectionnez-les puis utilisez le panneau d'options de
                    l'outil sélection</li>
                ${undoRedoTip}
              </ul>
              `,
  },
  {
    id: ToolTips.EditProperties,
    content: `<h4>Outil d'édition des propriétés</h4>
                <div class="alert alert-info mt-2 mb-3">
                  L'outil d'édition des propriétés sert à éditer les propriétés attachées aux géométries.
                  <div class="mt-3">Exemples de propriétés: <code>population</code>, <code>PIB</code>, ...</div>
                </div>
              <ul>
                ${moveMapTip}
                <li><b>Pour éditer les propriétés</b> d'une géométrie, cliquez sur une géométrie</li>
                ${undoRedoTip}
              </ul>
              `,
  },
];
