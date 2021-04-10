import React, { Component, ReactNode } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import Cls from './CodeEditor.module.scss';

import { Logger } from '@abc-map/frontend-shared';

const logger = Logger.get('CodeEditor.tsx', 'info');

interface Props {
  initialContent: string;
  onChange: (content: string) => void;
}

interface State {
  content: string;
}

class CodeEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { content: this.props.initialContent };
  }

  public render(): ReactNode {
    const content = this.state.content;

    return (
      <Editor
        value={content}
        onValueChange={this.onChange}
        highlight={this.highlightWithLineNumbers}
        padding={10}
        // This id is used in E2E tests
        textareaId={'code-editor'}
        textareaClassName={Cls.textarea}
        className={Cls.editor}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          outline: 0,
          minHeight: '400px',
        }}
      />
    );
  }

  private onChange = (content: string) => {
    this.setState({ content });
    this.props.onChange(content);
  };

  private highlightWithLineNumbers = (input: string) => {
    return highlight(input, languages.javascript, 'javascript')
      .split('\n')
      .map((line, i) => `<span class='${Cls.lineNumber}'>${i + 1}</span>${line}`)
      .join('\n');
  };
}

export default CodeEditor;
