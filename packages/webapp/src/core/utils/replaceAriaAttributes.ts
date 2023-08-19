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

/**
 * This function replaces generated aria attributes, for snaphsot testing purposes
 *
 * See: https://github.com/jpuri/react-draft-wysiwyg/issues/780#issuecomment-1190668723
 *
 * @param container
 */
export function replaceAriaAttributes(container: HTMLElement) {
  const selectors = ['id', 'for', 'aria-labelledby'];
  const ariaSelector = (el: string) => `[${el}^="react-aria"]`;
  const regexp = /react-aria\d+-\d+/g;
  const staticId = 'test-static-id';

  // We keep a map of the replaceIds to keep the matching between input "id" and label "for" attributes
  const attributesMap: Record<string, string> = {};

  container.querySelectorAll(selectors.map(ariaSelector).join(', ')).forEach((el, index) => {
    selectors.forEach((selector) => {
      const attr = el.getAttribute(selector);

      if (attr?.match(regexp)) {
        const newAttr = `${staticId}-${index}`;

        el.setAttribute(selector, attributesMap[attr] || newAttr);

        attributesMap[attr] = newAttr;
      }
    });
  });
}
