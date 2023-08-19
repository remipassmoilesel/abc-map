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

import { useCallback, useState } from 'react';
import { CustomEditor } from '../../CustomEditor';
import { IconDefs } from '../../../icon/IconDefs';
import { prefixedTranslation } from '../../../../i18n/i18n';
import { useEditor } from '../../useEditor';
import { ButtonMenu } from '../../../button-menu/ButtonMenu';
import { Action } from '../../../button-menu/Action';
import { LinkModal } from './LinkModal';
import { Editor } from 'slate';
import { LinkElement } from '@abc-map/shared';

const t = prefixedTranslation('TextEditor:');

interface Props {
  className?: string;
}

export function LinkControls(props: Props) {
  const { className } = props;
  const { editor } = useEditor();
  const [prompt, setPrompt] = useState(false);
  const [initialText, setInitialText] = useState('');
  const [initialUrl, setInitialUrl] = useState('');
  const [editedLink, setEditedLink] = useState<LinkElement | undefined>();

  const handleEditLink = useCallback(() => {
    const selectedLink = CustomEditor.link.getCurrent(editor);
    const selectedText = editor.selection ? Editor.string(editor, editor.selection) : '';
    // If cursor is on a link, we edit it
    if (selectedLink) {
      setInitialText(selectedLink[1]);
      setInitialUrl(selectedLink[0].url);
      setEditedLink(selectedLink[0]);
    }
    // Otherwise we create a new link
    else {
      setInitialText(selectedText);
      setInitialUrl('');
      setEditedLink(undefined);
    }

    setPrompt(true);
  }, [editor]);

  const handlePromptCancel = useCallback(() => setPrompt(false), []);

  const handlePromptConfirm = useCallback(
    (text: string, url: string) => {
      if (editedLink) {
        CustomEditor.link.edit(editor, editedLink, text, url);
      } else {
        CustomEditor.link.create(editor, text, url);
      }

      setPrompt(false);
    },
    [editedLink, editor]
  );

  const handleClearLink = useCallback(() => CustomEditor.link.removeLink(editor), [editor]);

  return (
    <>
      <ButtonMenu label={t('Links')} icon={IconDefs.faLink} className={className}>
        <Action label={t('Create_or_edit_a_link')} onClick={handleEditLink} icon={IconDefs.faPlus} />
        <Action label={t('Remove_a_link')} onClick={handleClearLink} icon={IconDefs.faBan} />
      </ButtonMenu>
      {prompt && <LinkModal initialText={initialText} initialUrl={initialUrl} onCancel={handlePromptCancel} onConfirm={handlePromptConfirm} />}
    </>
  );
}
