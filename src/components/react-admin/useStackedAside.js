// eslint-disable-next-line import/no-extraneous-dependencies
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  main: {
    // EditView and CreateView lay the form card and the aside out in a flex
    // row. Below lg an aside eats too much of the form, so they stack — the
    // aside comes after the form in the DOM, hence underneath.
    [theme.breakpoints.down('md')]: {
      flexDirection: 'column',
    },
  },
}));

/**
 * `classes` to hand over to an <Edit> or a <Create> carrying an aside, so the
 * two stack on a narrow screen.
 *
 * Passed through `classes` rather than through a theme override: EditView
 * merges it into its own stylesheet, which leaves no room for an injection
 * order surprise.
 */
export const useStackedAside = () => useStyles();

export default useStackedAside;
