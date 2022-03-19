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

import { useCallback } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useEditor } from '../../useEditor';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { IconDefs } from '../../../icon/IconDefs';
import { Separator } from '../../../button-menu/Separator';
import { Action } from '../../../button-menu/Action';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function BlockSelector(props: Props) {
  const { className } = props;
  const { editor } = useEditor();

  const handleSetParagraph = useCallback(() => CustomEditor.setParagraph(editor), [editor]);
  const handleSetTitle = useCallback((level: number) => CustomEditor.title.toggle(editor, level), [editor]);
  const handleToggleQuote = useCallback(() => CustomEditor.quote.toggle(editor), [editor]);
  const handleToggleCode = useCallback(() => CustomEditor.code.toggle(editor), [editor]);
  const handleToggleListUl = useCallback(() => CustomEditor.list.create(editor, false), [editor]);
  const handleToggleListOl = useCallback(() => CustomEditor.list.create(editor, true), [editor]);

  return (
    <ButtonMenu label={t('Block_type')} icon={IconDefs.faParagraph} closeOnClick={true} className={className} data-testid={'block-selector'}>
      {/* Paragraph */}
      <Action label={t('Normal')} icon={IconDefs.faParagraph} onClick={handleSetParagraph} />

      <Separator />

      <Action label={t('Unordered_list')} icon={IconDefs.faListOl} onClick={handleToggleListUl} />
      <Action label={t('Ordered_list')} icon={IconDefs.faListUl} onClick={handleToggleListOl} />
      <Action label={t('Quote')} icon={IconDefs.faQuoteLeft} onClick={handleToggleQuote} />
      <Action label={t('Code')} onClick={handleToggleCode} />

      <Separator />

      {/* Titles */}
      {[1, 2, 3, 4, 5].map((level) => {
        const label = t('Title') + ' ' + level;
        const icon = level === 1 ? IconDefs.faHeading : undefined;
        return <Action key={level} label={label} icon={icon} onClick={() => handleSetTitle(level)} data-testid={`title-${level}`} />;
      })}
    </ButtonMenu>
  );
}
