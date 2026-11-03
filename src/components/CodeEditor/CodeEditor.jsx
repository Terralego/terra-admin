import React from 'react';

/* eslint-disable import/no-extraneous-dependencies */
import { makeStyles } from '@material-ui/core/styles';

import CodeMirror from 'codemirror';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/hint/show-hint.css';
/* eslint-enable import/no-extraneous-dependencies */

const useStyles = makeStyles(theme => ({
  editor: {
    width: '100%',
    '& .CodeMirror': {
      height:       ({ height }) => height,
      width:        '100%',
      border:       `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      fontFamily:   'Menlo, Consolas, monospace',
      fontSize:     theme.typography.pxToRem(13),
    },
  },
}));

/**
 * Controlled CodeMirror 5 editor of a text.
 *
 * CodeMirror owns its text: React only writes it back on a change from
 * elsewhere, and never while the editor has the focus. With `hint`, a list of
 * completions shows on Ctrl-Space, and as one types when `autoHint` says so.
 *
 *   - mode: CodeMirror mode (e.g. 'nunjucks-html', see nunjucksMode)
 *   - hint(editor): show-hint source
 *   - autoHint(textBeforeCursor): whether to open the hints while typing
 */
export const CodeEditor = ({
  value = '',
  onChange,
  mode,
  hint,
  autoHint,
  height = '20em',
}) => {
  const classes = useStyles({ height });
  const containerRef = React.useRef(null);
  const editorRef = React.useRef(null);
  const applyingExternal = React.useRef(false);

  const handlers = React.useRef({ onChange, hint, autoHint });
  React.useLayoutEffect(() => {
    handlers.current = { onChange, hint, autoHint };
  });

  const [initialValue] = React.useState(value);

  React.useEffect(() => {
    const showHint = editor => handlers.current.hint
      && editor.showHint({ hint: handlers.current.hint, completeSingle: false });

    const editor = CodeMirror(containerRef.current, {
      value:          initialValue,
      mode,
      lineNumbers:    true,
      lineWrapping:   true,
      autoCloseTags:  true,
      matchTags:      { bothTags: true },
      tabSize:        2,
      indentUnit:     2,
      extraKeys:      { 'Ctrl-Space': showHint },
    });
    editorRef.current = editor;

    editor.on('change', instance => {
      if (!applyingExternal.current) {
        handlers.current.onChange(instance.getValue());
      }
    });

    editor.on('inputRead', (instance, { text }) => {
      if (instance.state.completionActive || !/\w/.test(text.join(''))) {
        return;
      }
      const cursor = instance.getCursor();
      const before = instance.getLine(cursor.line).slice(0, cursor.ch);
      if (handlers.current.autoHint?.(before)) {
        showHint(instance);
      }
    });

    return () => {
      editorRef.current = null;
      const wrapper = editor.getWrapperElement();
      wrapper.parentNode?.removeChild(wrapper);
    };
  }, [initialValue, mode]);

  React.useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !containerRef.current) {
      return undefined;
    }
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) {
        editorRef.current?.refresh();
        observer.disconnect();
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    const editor = editorRef.current;
    if (!editor || editor.hasFocus() || editor.getValue() === value) {
      return;
    }
    applyingExternal.current = true;
    editor.setValue(value);
    applyingExternal.current = false;
  }, [value]);

  return <div ref={containerRef} className={classes.editor} />;
};

export default CodeEditor;
