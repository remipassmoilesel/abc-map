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

import Cls from './TextEditor.module.scss';
import React, { Ref, useCallback } from 'react';
import { createEditor, Descendant } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import { useImperativeHandle, useState } from 'react';
import { renderElement, renderLeaf } from './render';
import ControlBar from './control-bar/ControlBar';
import { keyboardShortcuts } from './keyboardShortcuts';
import { withHistory } from 'slate-history';
import { withTables } from './elements/table/withTables';
import { withVideos } from './elements/video/withVideos';
import clsx from 'clsx';
import { withImages } from './elements/image/withImages';
import { EditorProvider } from './useEditor';
import { withLists } from './elements/list/withLists';
import { withLinks } from './elements/link/withLinks';

export interface Props {
  readOnly?: boolean;
  initialValue?: string;
  className?: string;
}

export interface TextEditorReference {
  serialize(): string;
}

// TODO: Setup nested tables
// TODO: Insert legend symbols
// TODO: Use "em" for sizes in order to scale editors for static exports
// TODO: Add history wiring with HistoryService
function TextEditor(props: Props, ref: Ref<TextEditorReference>) {
  const { readOnly, initialValue, className } = props;
  const [editor] = useState(() => {
    // eslint-disable-next-line prettier/prettier
    return [
      withReact,
      withHistory,
      withTables,
      withVideos,
      withImages,
      withLists,
      withLinks,
    ].reduce((editor, f) => f(editor), createEditor());
  });

  const [value, setValue] = useState<Descendant[]>(() => {
    // Editor must have a child in all cases
    const defaultValue = [{ type: 'paragraph', children: [{ text: '' }] }];
    return initialValue ? JSON.parse(initialValue) : defaultValue;
  });

  // When user clicks on editor, we focus so he can start typing
  const handleClick = useCallback(() => ReactEditor.focus(editor), [editor]);

  useImperativeHandle(ref, () => ({
    // Serialization can be heavy, so we expose it as an imperative handle
    serialize: () => JSON.stringify(editor.children),
  }));

  const context = { readOnly: readOnly ?? false, editor };

  return (
    <div className={clsx(Cls.textEditor, className)} onClick={handleClick}>
      <EditorProvider value={context}>
        {/* Control bar, visible only if readonly */}
        {!readOnly && <ControlBar className={Cls.controlBar} />}

        {/* Editor, scrollable */}
        <div className={Cls.editorContainer}>
          <Slate editor={editor} value={value} onChange={(value) => setValue(value)}>
            <Editable readOnly={readOnly} renderElement={renderElement} renderLeaf={renderLeaf} onKeyDown={keyboardShortcuts(editor)} data-testid={'editor'} />
          </Slate>
        </div>
      </EditorProvider>
    </div>
  );
}

export default React.forwardRef<TextEditorReference, Props>(TextEditor);
