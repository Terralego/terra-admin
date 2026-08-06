import React from 'react';
import { Labeled, useInput, useTranslate } from 'react-admin';

/* eslint-disable import/no-extraneous-dependencies */
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/fold/foldgutter.css';
/* eslint-enable import/no-extraneous-dependencies */

const HEIGHT = '24em';

const useStyles = makeStyles(theme => ({
  editor: {
    // Hauteur fixe et défilement interne : l'éditeur ne mesure donc jamais son
    // contenu pour se redimensionner. C'est délibéré — c'est exactement ce
    // mécanisme, côté MUI, qui figeait l'onglet à chaque frappe.
    width: '100%',
    '& .CodeMirror': {
      height:       HEIGHT,
      width:        '100%',
      border:       `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      fontFamily:   'Menlo, Consolas, monospace',
      fontSize:     theme.typography.pxToRem(13),
    },
  },
  invalid: {
    '& .CodeMirror': {
      borderColor: theme.palette.error.main,
    },
  },
}));

const defaultInitialValue = {};

const serialize = value => {
  if (value === undefined || value === null) {
    return '';
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch (e) {
    // Valeur non sérialisable (référence circulaire) : rien d'utile à afficher
    return '';
  }
};

/**
 * Édition d'une valeur JSON dans un éditeur CodeMirror.
 *
 * CodeMirror est piloté impérativement : il possède son texte, React ne le lui
 * réinjecte que sur un changement venu d'ailleurs — typiquement le record d'une
 * vue d'édition, qui arrive après le premier rendu. C'est précisément ce que
 * l'ancien éditeur `jsoneditor-react` ne savait pas faire : il posait sa valeur
 * une seule fois au montage et affichait donc un objet vide sur un
 * enregistrement qui n'en était pas un.
 *
 * Seul ce qui se parse est remonté au formulaire, qui ne reçoit donc jamais
 * autre chose que du JSON — un même champ peut être partagé avec un autre input
 * (cf. `WidgetsTab`, où un `ArrayInput` porte la même source et attend un
 * tableau).
 *
 * Limite assumée : un texte invalide n'empêche pas l'enregistrement, il laisse
 * la dernière valeur valide en place.
 */
export const JSONInput = ({
  source,
  initialValue = defaultInitialValue,
  label,
  resource,
  validate,
  className,
  // `Labeled` rend un `FormControl`, en `inline-flex` sans cette prop : la
  // largeur suivrait alors le contenu et les messages d'erreur.
  fullWidth = true,
  ...rest
}) => {
  const classes   = useStyles();
  const translate = useTranslate();

  // Figée au premier rendu : `initialValue` fait partie des dépendances de
  // réenregistrement de `useField`, et les appelants la passent volontiers en
  // littéral (`initialValue={[]}`), donc avec une identité neuve à chaque rendu.
  const stableInitialValue = React.useRef(initialValue).current;

  const {
    input: { value, onChange, onBlur },
    meta: { touched, error },
  } = useInput({
    source,
    initialValue: stableInitialValue,
    validate,
    ...rest,
  });

  const [parseError, setParseError] = React.useState(null);

  const containerRef = React.useRef(null);
  const editorRef    = React.useRef(null);

  // Empêche une écriture programmatique de repartir dans `onChange` : sans ce
  // drapeau, resynchroniser depuis le formulaire relancerait une saisie.
  const applyingExternal = React.useRef(false);

  const handlers = React.useRef({ onChange, onBlur });
  handlers.current = { onChange, onBlur };

  const initialText = React.useRef(serialize(value)).current;

  React.useEffect(() => {
    const editor = CodeMirror(containerRef.current, {
      value:             initialText,
      mode:              { name: 'javascript', json: true },
      lineNumbers:       true,
      lineWrapping:      true,
      autoCloseBrackets: true,
      matchBrackets:     true,
      foldGutter:        true,
      gutters:           ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      tabSize:           2,
      indentUnit:        2,
    });
    editorRef.current = editor;

    editor.on('change', instance => {
      if (applyingExternal.current) {
        return;
      }
      const next = instance.getValue();

      if (next.trim() === '') {
        setParseError(null);
        handlers.current.onChange(null);
        return;
      }

      try {
        const parsed = JSON.parse(next);
        setParseError(null);
        handlers.current.onChange(parsed);
      } catch (e) {
        // La valeur du formulaire reste la dernière valide, volontairement :
        // y écrire du texte brut casse les inputs qui partagent la source.
        setParseError(e.message);
      }
    });

    editor.on('blur', () => handlers.current.onBlur());

    return () => {
      editorRef.current = null;
      const { wrapper } = editor.getWrapperElement
        ? { wrapper: editor.getWrapperElement() }
        : {};
      if (wrapper && wrapper.parentNode) {
        wrapper.parentNode.removeChild(wrapper);
      }
    };
  }, [initialText]);

  // CodeMirror mesure le DOM au montage : monté dans un conteneur masqué — le
  // cas de l'accordéon de `WidgetsTab` replié — il se dessine de travers tant
  // qu'on ne l'a pas rafraîchi. On le fait à la première apparition. Un
  // `IntersectionObserver` plutôt qu'un `ResizeObserver` : la visibilité ne peut
  // pas osciller sous l'effet du rafraîchissement, donc pas de boucle possible.
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
    if (!editor || editor.hasFocus()) {
      return;
    }
    const next = serialize(value);
    if (editor.getValue() === next) {
      return;
    }
    applyingExternal.current = true;
    editor.setValue(next);
    applyingExternal.current = false;
    setParseError(null);
  }, [value]);

  const validationError = (touched && error) ? translate(error) : null;

  return (
    <Labeled
      label={label}
      source={source}
      resource={resource}
      className={className}
      fullWidth={fullWidth}
    >
      <>
        <div
          ref={containerRef}
          className={`${classes.editor} ${parseError ? classes.invalid : ''}`}
        />
        {/* Toujours montés : la forme de l'arbre ne change pas à la frappe */}
        <Typography variant="caption" color="error">
          {parseError ? `${translate('ra.input.json.invalid')} ${parseError}` : ' '}
        </Typography>
        <Typography variant="caption" color="error">
          {validationError || ' '}
        </Typography>
      </>
    </Labeled>
  );
};

export default JSONInput;
