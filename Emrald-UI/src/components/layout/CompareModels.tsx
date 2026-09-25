import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  alpha,
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  type Theme,
  Typography,
} from '@mui/material';

type BaseModelValue = string | number;
export type ModelValue
  = | BaseModelValue
    | BaseModelValue[]
    | Record<string, BaseModelValue>
    | undefined;

export interface PropertyDifference {
  newValue: ModelValue;
  oldValue: ModelValue;
}

/**
 * Differences between two models, grouped as:
 * category (e.g. "State") -> item name -> property path -> difference
 */
export type ModelDifferences = Record<
  string,
  Record<string, Record<string, PropertyDifference>>
>;

/**
 * Property key used when an entire item exists in only one of the models.
 */
export const ITEM_EXISTENCE_KEY = 'Item';

interface CompareModelsProps {
  differences: ModelDifferences;
}

type ChangeKind = 'changed' | 'added' | 'removed';

const changeKinds: Record<
  ChangeKind,
  { glyph: string; label: string; palette: 'warning' | 'success' | 'error' }
> = {
  changed: { glyph: '~', label: 'changed', palette: 'warning' },
  added: { glyph: '+', label: 'added', palette: 'success' },
  removed: { glyph: '−', label: 'removed', palette: 'error' },
};

const monoFont
  = 'ui-monospace, SFMono-Regular, Consolas, "Liberation Mono", monospace';

const missingValues = new Set(['Does not exist', '(Empty)', 'Undefined']);

function plural(count: number, word: string) {
  return `${count.toString()} ${word}${count === 1 ? '' : 's'}`;
}

function getChangeKind(
  properties: Record<string, PropertyDifference>,
): ChangeKind {
  const existence = properties[ITEM_EXISTENCE_KEY];
  if (existence && Object.keys(properties).length === 1) {
    return existence.newValue === 'Exists' ? 'added' : 'removed';
  }
  return 'changed';
}

function getValueToDisplay(value: ModelValue) {
  return typeof value === 'string' && value.length === 0
    ? '(Empty)'
    : value === undefined
      ? 'Undefined'
      : typeof value === 'object'
        ? JSON.stringify(value)
        : value.toString();
}

const ChangeGlyph: React.FC<{ kind: ChangeKind }> = ({ kind }) => {
  const { glyph, palette } = changeKinds[kind];
  return (
    <Box
      component="span"
      aria-hidden
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        width: 22,
        height: 22,
        borderRadius: 0.5,
        fontFamily: monoFont,
        fontWeight: 700,
        fontSize: '0.875rem',
        color: kind === 'changed' ? 'text.primary' : `${palette}.dark`,
        bgcolor: (theme: Theme) =>
          alpha(theme.palette[palette].main, kind === 'changed' ? 0.3 : 0.16),
      }}
    >
      {glyph}
    </Box>
  );
};

// Shared row layout so collapsible and static item rows align
const itemRowSx = {
  minHeight: 44,
  px: 2,
  '& .MuiAccordionSummary-content': { my: 1 },
};

function valueCellSx(value: string, palette: 'error' | 'success') {
  const missing = missingValues.has(value);
  return {
    fontFamily: missing ? undefined : monoFont,
    fontSize: '0.8125rem',
    fontStyle: missing ? 'italic' : undefined,
    color: missing ? 'text.secondary' : `${palette}.dark`,
    bgcolor: (theme: Theme) => alpha(theme.palette[palette].main, 0.07),
  };
}

export const CompareModels: React.FC<CompareModelsProps> = ({
  differences,
}) => {
  const categories = Object.entries(differences);

  if (categories.length === 0) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>
          Uploaded model has no differences to the open model.
        </Typography>
      </Box>
    );
  }

  const totals: Record<ChangeKind, number> = {
    changed: 0,
    added: 0,
    removed: 0,
  };
  for (const [, items] of categories) {
    for (const properties of Object.values(items)) {
      totals[getChangeKind(properties)]++;
    }
  }

  const renderItemLabel = (
    kind: ChangeKind,
    itemName: string,
    detail: string,
  ) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        minWidth: 0,
      }}
    >
      <ChangeGlyph kind={kind} />
      <Typography sx={{ fontWeight: 600, overflowWrap: 'anywhere', flex: 1 }}>
        {itemName}
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ flexShrink: 0 }}
      >
        {detail}
      </Typography>
    </Box>
  );

  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box
        sx={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          columnGap: 3,
          rowGap: 1,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        {(Object.keys(changeKinds) as ChangeKind[])
          .filter(kind => totals[kind] > 0)
          .map(kind => (
            <Box
              key={kind}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <ChangeGlyph kind={kind} />
              <Typography sx={{ fontWeight: 700 }}>
                {totals[kind].toString()}
              </Typography>
              <Typography color="text.secondary">
                {changeKinds[kind].label}
              </Typography>
            </Box>
          ))}
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 'auto' }}
        >
          Compare model relative to the open model
        </Typography>
      </Box>
      {categories.map(([category, items]) => {
        const itemEntries = Object.entries(items);
        return (
          <Box component="section" key={category}>
            <Box
              sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 1 }}
            >
              <Typography
                component="h3"
                sx={{ fontSize: '1.125rem', fontWeight: 700 }}
              >
                {category}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {plural(itemEntries.length, 'item')}
              </Typography>
            </Box>
            <Box
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                '& > * + *': { borderTop: 1, borderColor: 'divider' },
              }}
            >
              {itemEntries.map(([itemName, properties]) => {
                const propertyEntries = Object.entries(properties);
                const kind = getChangeKind(properties);

                // Items present in only one model have nothing to expand
                if (kind !== 'changed') {
                  return (
                    <Box
                      key={itemName}
                      sx={{
                        ...itemRowSx,
                        display: 'flex',
                        alignItems: 'center',
                        // Line up with the summary text beside the expand icon
                        pr: 5,
                      }}
                    >
                      {renderItemLabel(
                        kind,
                        itemName,
                        kind === 'added'
                          ? 'Only in compare model'
                          : 'Only in open model',
                      )}
                    </Box>
                  );
                }

                return (
                  <Accordion
                    key={itemName}
                    disableGutters
                    square
                    elevation={0}
                    slotProps={{ transition: { unmountOnExit: true } }}
                    sx={{
                      '&::before': { display: 'none' },
                      '&.Mui-expanded > .MuiAccordionSummary-root': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={itemRowSx}
                    >
                      {renderItemLabel(
                        kind,
                        itemName,
                        plural(propertyEntries.length, 'difference'),
                      )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ px: 2, pt: 1, pb: 2 }}>
                      <Table
                        size="small"
                        sx={{
                          tableLayout: 'fixed',
                          '& td, & th': { px: 1.5, overflowWrap: 'anywhere' },
                          '& tbody td': {
                            borderColor: 'background.paper',
                            borderBottomWidth: 2,
                          },
                        }}
                      >
                        <colgroup>
                          <col style={{ width: '30%' }} />
                          <col style={{ width: '35%' }} />
                          <col style={{ width: '35%' }} />
                        </colgroup>
                        <TableHead>
                          <TableRow
                            sx={{
                              '& th': {
                                color: 'text.secondary',
                                fontSize: '0.6875rem',
                                fontWeight: 700,
                                letterSpacing: '0.06em',
                                textTransform: 'uppercase',
                              },
                            }}
                          >
                            <TableCell>Property</TableCell>
                            <TableCell>Open model</TableCell>
                            <TableCell>Compare model</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {propertyEntries.map(([property, diff]) => {
                            const oldValue = getValueToDisplay(diff.oldValue);
                            const newValue = getValueToDisplay(diff.newValue);
                            return (
                              <TableRow key={property}>
                                <TableCell
                                  sx={{
                                    fontFamily: monoFont,
                                    fontSize: '0.8125rem',
                                    color: 'text.secondary',
                                  }}
                                >
                                  {property}
                                </TableCell>
                                <TableCell sx={valueCellSx(oldValue, 'error')}>
                                  {oldValue}
                                </TableCell>
                                <TableCell
                                  sx={valueCellSx(newValue, 'success')}
                                >
                                  {newValue}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};
