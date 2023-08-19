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
import { abcRender } from '../../../core/utils/test/abcRender';
import NavigationBar from './NavigationBar';
import sinon, { SinonStub } from 'sinon';

describe('NavigationBar', () => {
  let onClick: SinonStub;
  beforeEach(() => {
    onClick = sinon.stub();
  });

  describe('With few pages', () => {
    it('and low active value', () => {
      abcRender(<NavigationBar offset={0} limit={10} total={50} onChange={onClick} maxButtons={7} />);

      expect(getActive()).toEqual('1');
      expect(getSequence()).toEqual(['&lt;&lt;', '&lt;', '1', '2', '3', '4', '5', '&gt;']);
    });

    it('and medium active value', () => {
      abcRender(<NavigationBar offset={20} limit={10} total={50} onChange={onClick} maxButtons={7} />);

      expect(getActive()).toEqual('3');
      expect(getSequence()).toEqual(['&lt;&lt;', '&lt;', '1', '2', '3', '4', '5', '&gt;']);
    });

    it('and high active value', () => {
      abcRender(<NavigationBar offset={40} limit={10} total={50} onChange={onClick} maxButtons={7} />);

      expect(getActive()).toEqual('5');
      expect(getSequence()).toEqual(['&lt;&lt;', '&lt;', '1', '2', '3', '4', '5', '&gt;']);
    });
  });

  describe('With lot of pages', () => {
    it('and low active value', () => {
      abcRender(<NavigationBar offset={0} limit={10} total={1000} onChange={onClick} maxButtons={7} />);

      expect(getActive()).toEqual('1');
      expect(getSequence()).toEqual(['&lt;&lt;', '&lt;', '1', '2', '3', '4', '5', '6', '7', '&gt;']);
    });

    it('and medium active value', () => {
      abcRender(<NavigationBar offset={490} limit={10} total={1000} onChange={onClick} maxButtons={7} />);

      expect(getActive()).toEqual('50');
      expect(getSequence()).toEqual(['&lt;&lt;', '&lt;', '47', '48', '49', '50', '51', '52', '53', '&gt;']);
    });

    it('and high active value', () => {
      abcRender(<NavigationBar offset={990} limit={10} total={1000} onChange={onClick} maxButtons={7} />);

      expect(getActive()).toEqual('100');
      expect(getSequence()).toEqual(['&lt;&lt;', '&lt;', '94', '95', '96', '97', '98', '99', '100', '&gt;']);
    });
  });

  function getSequence(): string[] {
    return Array.from(document.querySelectorAll('button')).map((item) => item.innerHTML);
  }

  function getActive(): string | undefined {
    return document.querySelector('[data-testid=active]')?.innerHTML;
  }
});
