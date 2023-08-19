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

import { Tip } from '../Tip';
import { ColorGradientTips, DataProcessingTips, ProportionalSymbolsTips } from '../tip-ids';

const Commons = [
  {
    id: DataProcessingTips.JoinBy,
    content: `<p>Le <i>champ de jointure</i> est utilisé pour mettre en relation une donnée et une géométrie.</p>
              <p>Ce champ doit contenir un code qui sera présent dans la géométrie et dans la donnée à analyser. Exemples:</p>
              <ul>
                <li>code postal</li>
                <li>code de département</li>
                <li>code de région</li>
                <li>code de pays</li>
              </ul>`,
  },
];

const ProportionalSymbols: Tip[] = [
  {
    id: ProportionalSymbolsTips.SizeField,
    content: `<p>Le champ <i>Taille des symboles</i> est utilisé pour déterminer la taille de chaque symbole.</p>
              <p>Ce champ doit contenir la donnée à analyser. Exemples:</p>
              <ul>
                <li>population</li>
                <li>revenu annuel</li>
                <li>PIB</li>
              </ul>`,
  },
  {
    id: ProportionalSymbolsTips.Algorithm,
    content: `<p>L'échelle des symboles détermine la méthode de calcul de la taille des symboles.</p>
              <ul>
                <li>Sur l'<i>échelle absolue</i> les tailles des symboles sont directement proportionnelles aux valeurs représentées.
                La proportionnalité des symboles est exacte.</li>
                <li>Sur l'<i>échelle interpolée</i> les tailles des symboles sont réparties entre la taille minimale et la taille maximale.
                La proportionnalité des symboles est faussée. Cette échelle est utile lorsque la plage des valeurs est large.</li>
              </ul>`,
  },
];

const ColorGradientSymbols: Tip[] = [
  {
    id: ColorGradientTips.ColorField,
    content: `<p>Le champ <i>Couleurs</i> est utilisé pour déterminer les valeurs des couleurs.</p>
              <p>Ce champ doit contenir la donnée à analyser. Exemples:</p>
              <ul>
                <li>densité de population au km²</li>
                <li>revenu annuel par habitant</li>
              </ul>`,
  },
  {
    id: ColorGradientTips.Algorithm,
    content: `<p>L'algorithme détermine la méthode de calcul des couleurs. Les couleurs peuvent être réparties sur une échelle
              ou dans des classes (des groupes de valeurs qui partagent la même couleur).</p>
              <ul>
                <li>L'<i>échelle interpolée</i> répartie les valeurs entre la couleur de début et la couleur de fin.</li>
                <li>Avec les <i>Intervalles égaux</i> l'amplitude entre la valeur minimum et la valeur maximum est divisée par le nombre de classes.</li>
                <li>Avec les <i>Quantiles</i> chaque classe représente le même nombre de données.</li>
                <li>Avec les <i>Seuils naturels</i> les valeurs sont regroupées par proximité (algorithme Ckmeans).</li>
              </ul>`,
  },
];

export const DataProcessing: Tip[] = [...Commons, ...ProportionalSymbols, ...ColorGradientSymbols];
