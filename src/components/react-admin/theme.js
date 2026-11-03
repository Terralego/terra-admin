import { defaultTheme } from 'react-admin';

/**
 * App bar colours, kept in the palette so they are defined once and readable
 * from any component through `useTheme().palette.appBar`.
 *
 * The values reproduce the former Blueprint navbar (views/Main/Header/header.scss
 * and the `Classes.DARK` text colour), so switching to the native react-admin
 * app bar goes unnoticed apart from the sidebar showing up.
 */
export const appBar = {
  main: '#000',
  contrastText: '#f5f8fa',
  borderBottom: '#ebebeb',
};

/**
 * The react-admin theme.
 *
 * The app bar colour is applied through a theme override rather than through a
 * className on <AppBar>: that is what guarantees the rule wins over
 * `.MuiAppBar-colorSecondary`, whatever the stylesheet injection order ends up
 * being. Changing `appBar` above is enough to restyle the whole bar.
 */
export const theme = {
  ...defaultTheme,
  palette: {
    ...defaultTheme.palette,
    appBar,
  },
  overrides: {
    ...defaultTheme.overrides,
    MuiAppBar: {
      ...defaultTheme.overrides?.MuiAppBar,
      colorSecondary: {
        backgroundColor: appBar.main,
        color: appBar.contrastText,
        boxShadow: `2px 0 0 ${appBar.borderBottom}`,
      },
    },
    RaLayout: {
      root: {
        // react-admin pose `min-width: fit-content` ici, ce qui dimensionne la
        // page entière — barre latérale comprise — sur son contenu le plus
        // large. Et `min-width` l'emporte toujours sur `max-width`, donc le
        // `max-width: calc(100vw - 15px)` de `.main-content` ne peut pas la
        // retenir : le moindre tableau large fait défiler tout l'écran.
        minWidth: 0,
      },
      content: {
        // Enfant flex : sans `min-width: 0` il refuse de se réduire sous la
        // largeur intrinsèque de son contenu. Ce qui déborde réellement défile
        // alors dans la zone de contenu, et non plus sur la page entière.
        //
        // `overflow-x` ne provoque pas de second ascenseur vertical ici : la
        // hauteur de ce bloc n'est jamais contrainte, elle suit son contenu.
        minWidth:  0,
        overflowX: 'auto',
        '&:has(.sticky-aside)': {
          overflowX: 'visible',
        },
      },
    },
    RaEdit: {
      card: {
        minWidth: 0,
        '&&':     { overflowX: 'auto' },
      },
    },
    RaCreate: {
      card: {
        minWidth: 0,
        '&&':     { overflowX: 'auto' },
      },
    },
    RaList: {
      // ListView lays out the datagrid and the aside in a flex row. Stretching
      // is the flex default, so the shorter of the two grows to the height of
      // the other and leaves a large empty area — let each keep its own height.
      main: {
        alignItems: 'flex-start',
      },
    },
    RaFilterListItem: {
      listItem: {
        paddingLeft: '2em',
        // Selecting a filter mounts a ListItemSecondaryAction, and MuiListItem
        // reacts by bumping its own paddingRight from 16 to 48 — which is what
        // reflows the label. Reserve the room upfront. `&&` doubles the
        // specificity, otherwise `.MuiListItem-gutters` wins on injection order.
        '&&': {
          paddingRight: 48,
        },
      },
      listItemText: {
        margin: 0,
        // Safety net: long labels ellipsize rather than wrap onto a second line
        '& > span': {
          display: 'block',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
    },
  },
};

export default theme;
