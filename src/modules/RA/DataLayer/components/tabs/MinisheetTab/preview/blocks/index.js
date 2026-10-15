import AccordionBlock from './AccordionBlock';
import AlertBlock from './AlertBlock';
import ButtonBlock from './ButtonBlock';
import CardBlock from './CardBlock';
import ChartBlock from './ChartBlock';
import DividerBlock from './DividerBlock';
import FieldBlock from './FieldBlock';
import IframeBlock from './IframeBlock';
import ImageBlock from './ImageBlock';
import RepeatBlock from './RepeatBlock';
import TypographyBlock from './TypographyBlock';

/** React component of each block type rendered without Nunjucks. */
export const blockComponents = {
  field: FieldBlock,
  typography: TypographyBlock,
  card: CardBlock,
  alert: AlertBlock,
  button: ButtonBlock,
  image: ImageBlock,
  iframe: IframeBlock,
  accordion: AccordionBlock,
  divider: DividerBlock,
  chart: ChartBlock,
  repeat: RepeatBlock,
};

export default blockComponents;
