/* eslint-disable import/no-extraneous-dependencies */
import CodeMirror from 'codemirror';
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/jinja2/jinja2';
import 'codemirror/addon/mode/multiplex';
/* eslint-enable */

/**
 * `nunjucks-html` mode: HTML, with the Nunjucks tags highlighted by the
 * jinja2 mode, whose syntax is the same.
 */
CodeMirror.defineMode('nunjucks-html', config => {
  const nunjucks = CodeMirror.getMode(config, 'jinja2');
  const delimiters = [['{{', '}}'], ['{%', '%}'], ['{#', '#}']];

  return CodeMirror.multiplexingMode(
    CodeMirror.getMode(config, 'htmlmixed'),
    ...delimiters.map(([open, close]) => ({ open, close, mode: nunjucks, parseDelimiters: true })),
  );
});

/** Whether the cursor stands inside a `{{ }}` or a `{% %}` tag. */
export const isInsideTag = textBeforeCursor => [['{{', '}}'], ['{%', '%}']]
  .some(([open, close]) => textBeforeCursor.lastIndexOf(open) > textBeforeCursor.lastIndexOf(close));

/**
 * Hint source for show-hint: the words (field names) that start like the one
 * before the cursor, with an optional description shown next to each.
 */
export const wordsHint = words => editor => {
  const cursor = editor.getCursor();
  const line = editor.getLine(cursor.line);
  let start = cursor.ch;
  while (start > 0 && /\w/.test(line.charAt(start - 1))) {
    start -= 1;
  }
  const prefix = line.slice(start, cursor.ch).toLowerCase();

  return {
    list: words
      .filter(({ text }) => text.toLowerCase().startsWith(prefix))
      .map(({ text, description }) => ({ text, displayText: description ? `${text} — ${description}` : text })),
    from: CodeMirror.Pos(cursor.line, start),
    to: cursor,
  };
};

export default 'nunjucks-html';
