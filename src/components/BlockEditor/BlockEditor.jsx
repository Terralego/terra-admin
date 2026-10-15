import React from 'react';
import { useTranslate } from 'react-admin';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  pointerWithin,
  useDndContext,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

/* eslint-disable import/no-extraneous-dependencies */
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import DragIndicatorIcon from '@material-ui/icons/DragIndicator';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
/* eslint-enable */

import {
  ROOT,
  canPlace,
  findBlock,
  getBranches,
  insertBlock,
  moveBlock,
  removeBlock,
  updateBlock,
} from './blockTree';

/**
 * Generic editor of an ordered tree of blocks: add, remove, reorder and nest
 * by drag and drop, with the settings of each block under its header.
 *
 * Each type of the registry gives, on top of the nesting rules of blockTree:
 *   - label: translation key of its name
 *   - create(context): settings of a new block
 *   - Settings: component editing the block ({ block, onChange, context })
 *   - summary(block, context): short text shown next to its name
 *   - branchLabels: translation keys naming its branches, when it has several
 *   - actions: [{ label, icon, run(block, context) }], each turning the block
 *     into the one `run` returns; offered only where that one may stand
 */
const EditorContext = React.createContext();

const endZoneId = ({ parentId, branch }) => `end:${parentId ?? 'root'}:${branch ?? ''}`;

const AddBlockMenu = ({ place }) => {
  const translate = useTranslate();
  const { registry, blocks, rules, context, createId, onChange, toggle } = React.useContext(EditorContext);
  const [anchor, setAnchor] = React.useState(null);

  const newBlock = type => {
    const definition = registry[type];
    const branches = Object.fromEntries((definition.branches ?? []).map(branch => [branch, []]));
    return { id: createId(), type, ...branches, ...definition.create?.(context) };
  };

  const types = Object.keys(registry)
    .filter(type => canPlace(registry, blocks, newBlock(type), place, rules));

  if (!types.length) {
    return null;
  }

  return (
    <>
      <Button size="small" startIcon={<AddIcon />} onClick={event => setAnchor(event.currentTarget)}>
        {translate('block-editor.add')}
      </Button>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {types.map(type => (
          <MenuItem
            key={type}
            onClick={() => {
              setAnchor(null);
              const block = newBlock(type);
              onChange(insertBlock(registry, blocks, place, block));
              if (registry[type].Settings) {
                toggle(block.id);
              }
            }}
          >
            {translate(registry[type].label)}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

/** Whether the block being dragged may be dropped at `place`. */
const useCanDrop = place => {
  const { active } = useDndContext();
  const { registry, blocks, rules } = React.useContext(EditorContext);
  if (!active) {
    return false;
  }
  const dragged = findBlock(registry, blocks, active.id)?.block;
  return Boolean(dragged) && canPlace(registry, blocks, dragged, place, rules);
};

const DropIndicator = ({ visible }) => (
  <Box sx={{ height: 2, my: '-1px', bgcolor: visible ? 'primary.main' : 'transparent' }} />
);

const EndZone = ({ place }) => {
  const { setNodeRef, isOver } = useDroppable({ id: endZoneId(place), data: { place } });
  const allowed = useCanDrop(place);

  return (
    <Box ref={setNodeRef} sx={{ minHeight: 8 }}>
      <DropIndicator visible={isOver && allowed} />
      <AddBlockMenu place={place} />
    </Box>
  );
};

const BlockList = ({ place, items }) => (
  <SortableContext items={items.map(({ id }) => id)} strategy={verticalListSortingStrategy}>
    <Stack spacing={1}>
      {items.map((block, index) => (
        // eslint-disable-next-line no-use-before-define
        <BlockItem key={block.id} block={block} place={{ ...place, index }} />
      ))}
    </Stack>
    <EndZone place={place} />
  </SortableContext>
);

const stopPropagation = event => event.stopPropagation();

const BlockItem = ({ block, place }) => {
  const translate = useTranslate();
  const { registry, blocks, rules, context, onChange, expanded, toggle } = React.useContext(EditorContext);
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
  } = useSortable({ id: block.id, data: { place } });
  const allowed = useCanDrop(place);

  const definition = registry[block.type] ?? {};
  const { Settings } = definition;
  const branches = getBranches(registry, block);
  const open = expanded.has(block.id);
  const summary = definition.summary?.(block, context);

  const handleChange = update => onChange(updateBlock(registry, blocks, block.id, update));

  const actions = (definition.actions ?? [])
    .map(action => ({ ...action, result: action.run(block, context) }))
    .filter(({ result }) => canPlace(registry, blocks, result, place, rules));

  return (
    <Box
      ref={setNodeRef}
      sx={{ transform: CSS.Translate.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
    >
      <DropIndicator visible={isOver && !isDragging && allowed} />
      <Paper variant="outlined">
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          onClick={Settings ? () => toggle(block.id) : undefined}
          sx={{ px: 1, py: 0.5, cursor: Settings ? 'pointer' : 'default' }}
        >
          <IconButton
            size="small"
            ref={setActivatorNodeRef}
            {...attributes}
            {...listeners}
            onClick={stopPropagation}
            sx={{ cursor: 'grab' }}
            aria-label={translate('block-editor.move')}
          >
            <DragIndicatorIcon fontSize="small" />
          </IconButton>
          <Typography variant="subtitle2" sx={{ flexShrink: 0 }}>
            {translate(definition.label ?? block.type)}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ flex: 1, minWidth: 0 }}>
            {summary}
          </Typography>
          {actions.map(({ label, icon: Icon, result }) => (
            <Tooltip key={label} title={translate(label)}>
              <IconButton
                size="small"
                onClick={event => {
                  event.stopPropagation();
                  onChange(updateBlock(registry, blocks, block.id, () => result));
                  if (!open && registry[result.type]?.Settings) {
                    toggle(block.id);
                  }
                }}
              >
                <Icon fontSize="small" />
              </IconButton>
            </Tooltip>
          ))}
          {Settings && (
            <Tooltip title={translate(open ? 'block-editor.collapse' : 'block-editor.expand')}>
              <IconButton size="small">
                {open ? <ExpandLessIcon fontSize="small" /> : <ExpandMoreIcon fontSize="small" />}
              </IconButton>
            </Tooltip>
          )}
          <Tooltip title={translate('block-editor.remove')}>
            <IconButton
              size="small"
              onClick={event => {
                event.stopPropagation();
                onChange(removeBlock(registry, blocks, block.id));
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
        {Settings && (
          <Collapse in={open} unmountOnExit>
            <Box sx={{ px: 2, pb: 2 }}>
              <Settings block={block} onChange={handleChange} context={context} />
            </Box>
          </Collapse>
        )}
        {branches.map(branch => (
          <Box key={branch} sx={{ pl: 4, pr: 1, pb: 1 }}>
            {branches.length > 1 && (
              <Typography variant="caption" color="text.secondary">
                {translate(definition.branchLabels?.[branch] ?? branch)}
              </Typography>
            )}
            <BlockList place={{ parentId: block.id, branch }} items={block[branch] ?? []} />
          </Box>
        ))}
      </Paper>
    </Box>
  );
};

const NO_BLOCKS = [];

const area = rect => (rect ? rect.width * rect.height : Infinity);

export const BlockEditor = ({
  blocks = NO_BLOCKS,
  onChange,
  registry,
  rootAccepts,
  maxDepth,
  context,
  createId,
}) => {
  const [expanded, setExpanded] = React.useState(() => new Set());
  const toggle = React.useCallback(id => setExpanded(previous => {
    const next = new Set(previous);
    if (!next.delete(id)) {
      next.add(id);
    }
    return next;
  }), []);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const rules = React.useMemo(() => ({ rootAccepts, maxDepth }), [rootAccepts, maxDepth]);

  const collisionDetection = React.useCallback(args => {
    const dragged = findBlock(registry, blocks, args.active.id)?.block;
    const insideDragged = id => Boolean(dragged && id !== null && findBlock(registry, [dragged], id));
    const hits = pointerWithin(args)
      .filter(({ id, data }) => {
        const place = data?.droppableContainer?.data.current?.place;
        return !insideDragged(id) && !insideDragged(place?.parentId ?? null);
      })
      .toSorted((a, b) => area(args.droppableRects.get(a.id)) - area(args.droppableRects.get(b.id)));
    return hits.length ? hits : closestCenter(args);
  }, [registry, blocks]);

  const handleDragEnd = ({ active, over }) => {
    const place = over?.data.current?.place;
    if (!place || over.id === active.id) {
      return;
    }
    const { block } = findBlock(registry, blocks, active.id) ?? {};
    if (block && canPlace(registry, blocks, block, place, rules)) {
      onChange(moveBlock(registry, blocks, active.id, place));
    }
  };

  const value = React.useMemo(() => ({
    registry,
    blocks,
    rules,
    context,
    createId,
    onChange,
    expanded,
    toggle,
  }), [registry, blocks, rules, context, createId, onChange, expanded, toggle]);

  return (
    <EditorContext.Provider value={value}>
      <DndContext sensors={sensors} collisionDetection={collisionDetection} onDragEnd={handleDragEnd}>
        <BlockList place={ROOT} items={blocks} />
      </DndContext>
    </EditorContext.Provider>
  );
};

export default BlockEditor;
