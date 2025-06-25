import fs from 'fs/promises';
import path from 'path';
import maapInpParser from '../../../../../../../../components/forms/ActionForm/FormFieldsByType/RunApplication/CustomForms/MAAP/Parser/index';
import { beforeAll, describe, expect, test } from 'vitest';

async function readTestData(filename: string) {
  return (
    (await fs.readFile(path.join(__dirname, 'test-data', filename)))
      .toString()
      // Ensures the locations reported by parsing the file are the same as the online editor
      .replace(/\r\n/g, '\n')
  );
}

beforeAll(() => {
  // Turn safe mode off to make sure tests fail when expected
  maapInpParser.options.safeMode = false;
  // Turn of location (so I don't have to rewrite the expect outputs)
  maapInpParser.options.emitLocation = false;
});

describe('literals', () => {
  test('boolean literal', async () => {
    const program = maapInpParser.parse(await readTestData('boolean.INP')).output;
    expect(program.value).toEqual([
      {
        type: 'comment',
        value: ' Tests boolean literals **',
      },
      {
        type: 'comment',
        value: 'Main',
      },
      {
        type: 'boolean',
        value: true,
      },
      {
        type: 'boolean',
        value: false,
      },
      {
        type: 'comment',
        value: 'Shorthand',
      },
      {
        type: 'boolean',
        value: true,
      },
      {
        type: 'boolean',
        value: false,
      },
    ]);
  });

  test('numerical literal', async () => {
    const program = maapInpParser.parse(await readTestData('numeric.INP')).output;
    expect(program.value).toEqual([
      {
        type: 'comment',
        value: ' Tests numeric literals **',
      },
      {
        type: 'comment',
        value: 'Basic number',
      },
      {
        type: 'number',
        value: 1,
        units: undefined,
      },
      {
        type: 'comment',
        value: 'Decimal',
      },
      {
        type: 'number',
        value: 2,
        units: undefined,
      },
      {
        type: 'number',
        value: 3,
        units: undefined,
      },
      {
        type: 'comment',
        value: 'E notation',
      },
      {
        type: 'number',
        units: undefined,
        value: 4,
      },
      {
        type: 'number',
        units: undefined,
        value: 0.005,
      },
    ]);
  });
});

describe('expressions', () => {
  test('call expression', async () => {
    const program = maapInpParser.parse(await readTestData('call.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests call expressions **',
      },
      {
        type: 'comment',
        value: 'No arguments',
      },
      {
        arguments: [],
        type: 'call_expression',
        value: {
          type: 'identifier',
          value: 'Name',
        },
      },
      {
        type: 'comment',
        value: 'One argument',
      },
      {
        arguments: [
          {
            type: 'number',
            units: undefined,
            value: 1,
          },
        ],
        type: 'call_expression',
        value: {
          type: 'identifier',
          value: 'Name',
        },
      },
      {
        type: 'comment',
        value: 'Many arguments',
      },
      {
        arguments: [
          {
            type: 'number',
            units: undefined,
            value: 1,
          },
          {
            type: 'number',
            units: undefined,
            value: 2,
          },
          {
            type: 'number',
            units: undefined,
            value: 3,
          },
        ],
        type: 'call_expression',
        value: {
          type: 'identifier',
          value: 'Name',
        },
      },
      {
        type: 'comment',
        value: 'Nested calls',
      },
      {
        arguments: [
          {
            arguments: [
              {
                arguments: [
                  {
                    arguments: [],
                    type: 'call_expression',
                    value: {
                      type: 'identifier',
                      value: 'Function',
                    },
                  },
                ],
                type: 'call_expression',
                value: {
                  type: 'identifier',
                  value: 'A',
                },
              },
            ],
            type: 'call_expression',
            value: {
              type: 'identifier',
              value: 'Of',
            },
          },
        ],
        type: 'call_expression',
        value: {
          type: 'identifier',
          value: 'Name',
        },
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(
      '//  Tests call expressions **\n// No arguments\nName()\n// One argument\nName(1)\n// Many arguments\nName(1,2,3)\n// Nested calls\nName(Of(A(Function())))',
    );
  });

  test('is expression', async () => {
    const program = maapInpParser.parse(await readTestData('is.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests IS expressions **',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        target: {
          type: 'identifier',
          value: 'VARNAME',
        },
        type: 'is_expression',
        value: {
          type: 'identifier',
          value: 'Value',
        },
      },
      {
        type: 'comment',
        value: 'Special IS expressions',
      },
      {
        target: {
          type: 'parameter_name',
          value: 'START TIME',
        },
        type: 'is_expression',
        value: {
          type: 'number',
          units: undefined,
          value: 0,
        },
      },
      {
        target: {
          type: 'parameter_name',
          value: 'END TIME',
        },
        type: 'is_expression',
        value: {
          type: 'number',
          units: undefined,
          value: 144000,
        },
      },
      {
        target: {
          type: 'parameter_name',
          value: 'PRINT INTERVAL',
        },
        type: 'is_expression',
        value: {
          type: 'number',
          units: undefined,
          value: 5000,
        },
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests IS expressions **
// Default
VARNAME IS Value
// Special IS expressions
START TIME IS 0
END TIME IS 144000
PRINT INTERVAL IS 5000`);
  });

  test('multi expression', async () => {
    const program = maapInpParser.parse(await readTestData('multi-expression.INP')).output;
    expect(program.value).toStrictEqual([
      {
        blockType: 'IF',
        test: {
          type: 'multi_expression',
          op: 'AND',
          value: [
            {
              type: 'expression',
              value: {
                left: {
                  type: 'identifier',
                  value: 'A',
                },
                op: '!=',
                right: {
                  type: 'number',
                  units: undefined,
                  value: 0,
                },
              },
            },
            {
              type: 'expression',
              value: {
                left: {
                  type: 'identifier',
                  value: 'B',
                },
                op: '>=',
                right: {
                  type: 'identifier',
                  value: 'C',
                },
              },
            },
          ],
        },
        type: 'conditional_block',
        value: [
          {
            type: 'identifier',
            value: 'TEST',
          },
        ],
      },
      {
        blockType: 'IF',
        test: {
          type: 'multi_expression',
          op: 'AND',
          value: [
            {
              type: 'expression',
              value: {
                left: {
                  type: 'identifier',
                  value: 'A',
                },
                op: '!=',
                right: {
                  type: 'number',
                  units: undefined,
                  value: 0,
                },
              },
            },
            {
              type: 'multi_expression',
              op: 'OR',
              value: [
                {
                  type: 'expression',
                  value: {
                    left: {
                      type: 'identifier',
                      value: 'B',
                    },
                    op: '>=',
                    right: {
                      type: 'identifier',
                      value: 'C',
                    },
                  },
                },
                {
                  target: {
                    type: 'identifier',
                    value: 'A',
                  },
                  type: 'is_expression',
                  value: {
                    type: 'identifier',
                    value: 'B',
                  },
                },
              ],
            },
          ],
        },
        type: 'conditional_block',
        value: [
          {
            type: 'identifier',
            value: 'TEST',
          },
        ],
      },
    ]);
  });
});

describe('statements', () => {
  test('sensitivity statements', async () => {
    const program = maapInpParser.parse(await readTestData('sensitivity.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests sensitivity statements **',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        type: 'sensitivity',
        value: 'ON',
      },
      {
        type: 'comment',
        value: 'Alternate value',
      },
      {
        type: 'sensitivity',
        value: 'OFF',
      },
      {
        type: 'comment',
        value: 'No value',
      },
      {
        type: 'comment',
        value: 'Should parse as an identifier, not a sensitivity statement',
      },
      {
        type: 'identifier',
        value: 'SENSITIVITY',
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests sensitivity statements **
// Default
SENSITIVITY ON
// Alternate value
SENSITIVITY OFF
// No value
// Should parse as an identifier, not a sensitivity statement
SENSITIVITY`);
  });

  test('title statements', async () => {
    const program = maapInpParser.parse(await readTestData('title.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests title statements **',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        type: 'title',
        value: 'Valid Title',
      },
      {
        type: 'comment',
        value: 'Many lines',
      },
      {
        type: 'title',
        value: `A title that
extends onto
multiple lines`,
      },
      {
        type: 'comment',
        value: 'Empty title',
      },
      {
        type: 'title',
        value: undefined,
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests title statements **
// Default
TITLE
Valid Title
END
// Many lines
TITLE
A title that
extends onto
multiple lines
END
// Empty title
TITLE

END`);
  });

  test('parameter file statements', async () => {
    const program = maapInpParser.parse(await readTestData('file.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests file statements **',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        fileType: 'PARAMETER FILE',
        type: 'file',
        value: 'parameter_file.PAR',
      },
      {
        type: 'comment',
        value: 'No file specified, should parse as an identifier',
      },
      {
        type: 'parameter_name',
        value: 'PARAMETER FILE',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        fileType: 'INCLUDE',
        type: 'file',
        value: 'file.inc',
      },
      {
        type: 'comment',
        value: 'Empty, should be parsed as an identifier',
      },
      {
        type: 'identifier',
        value: 'INCLUDE',
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests file statements **
// Default
PARAMETER FILE parameter_file.PAR
// No file specified, should parse as an identifier
PARAMETER FILE
// Default
INCLUDE file.inc
// Empty, should be parsed as an identifier
INCLUDE`);
  });

  test('block statements', async () => {
    const program = maapInpParser.parse(await readTestData('block.INP')).output;
    expect(program.value).toStrictEqual([
      { type: 'comment', value: ' Tests block statements **' },
      { type: 'comment', value: 'Default' },
      {
        blockType: 'PARAMETER CHANGE',
        type: 'block',
        value: [
          {
            target: {
              arguments: [
                {
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              type: 'call_expression',
              value: {
                type: 'identifier',
                value: 'VarName',
              },
            },
            type: 'assignment',
            value: {
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
        ],
      },
      {
        type: 'comment',
        value: 'Empty',
      },
      {
        blockType: 'PARAMETER CHANGE',
        type: 'block',
        value: [],
      },
      {
        type: 'comment',
        value: 'With nested source elements',
      },
      {
        blockType: 'PARAMETER CHANGE',
        type: 'block',
        value: [
          {
            blockType: 'IF',
            test: {
              target: {
                arguments: [
                  {
                    type: 'number',
                    units: undefined,
                    value: 1,
                  },
                ],
                type: 'call_expression',
                value: {
                  type: 'identifier',
                  value: 'VarName',
                },
              },
              type: 'is_expression',
              value: {
                type: 'number',
                units: undefined,
                value: 1,
              },
            },
            type: 'conditional_block',
            value: [
              {
                type: 'set_timer',
                value: {
                  type: 'timer',
                  value: 1,
                },
              },
            ],
          },
        ],
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        blockType: 'INITIATORS',
        type: 'block',
        value: [
          {
            target: {
              arguments: [
                {
                  type: 'number',
                  units: undefined,
                  value: 1,
                },
              ],
              type: 'call_expression',
              value: {
                type: 'identifier',
                value: 'VarName',
              },
            },
            type: 'assignment',
            value: {
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
        ],
      },
      {
        type: 'comment',
        value: 'Empty',
      },
      {
        blockType: 'INITIATORS',
        type: 'block',
        value: [],
      },
      {
        type: 'comment',
        value: 'With nested source elements',
      },
      {
        blockType: 'INITIATORS',
        type: 'block',
        value: [
          {
            blockType: 'IF',
            test: {
              target: {
                arguments: [
                  {
                    type: 'number',
                    units: undefined,
                    value: 1,
                  },
                ],
                type: 'call_expression',
                value: {
                  type: 'identifier',
                  value: 'VarName',
                },
              },
              type: 'is_expression',
              value: {
                type: 'number',
                units: undefined,
                value: 1,
              },
            },
            type: 'conditional_block',
            value: [
              {
                type: 'set_timer',
                value: {
                  type: 'timer',
                  value: 1,
                },
              },
            ],
          },
        ],
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests block statements **
// Default
PARAMETER CHANGE
VarName(1) = 1
END
// Empty
PARAMETER CHANGE

END
// With nested source elements
PARAMETER CHANGE
IF VarName(1) IS 1
SET TIMER #1
END
END
// Default
INITIATORS
VarName(1) = 1
END
// Empty
INITIATORS

END
// With nested source elements
INITIATORS
IF VarName(1) IS 1
SET TIMER #1
END
END`);
  });
  test('conditional block statements', async () => {
    const program = maapInpParser.parse(await readTestData('conditionalBlock.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests conditional block statements **',
      },
      {
        type: 'comment',
        value: 'When default',
      },
      {
        blockType: 'WHEN',
        test: {
          target: {
            type: 'identifier',
            value: 'VARIABLE',
          },
          type: 'is_expression',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        type: 'conditional_block',
        value: [
          {
            target: {
              type: 'identifier',
              value: 'VARNAME',
            },
            type: 'assignment',
            value: {
              type: 'number',
              units: undefined,
              value: 1000,
            },
          },
        ],
      },
      {
        type: 'comment',
        value: 'When empty',
      },
      {
        blockType: 'WHEN',
        test: {
          target: {
            type: 'identifier',
            value: 'VARIABLE',
          },
          type: 'is_expression',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        type: 'conditional_block',
        value: [],
      },
      {
        type: 'comment',
        value: 'If default',
      },
      {
        blockType: 'IF',
        test: {
          target: {
            type: 'identifier',
            value: 'VARIABLE',
          },
          type: 'is_expression',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        type: 'conditional_block',
        value: [
          {
            target: {
              type: 'identifier',
              value: 'VARNAME',
            },
            type: 'assignment',
            value: {
              type: 'number',
              units: undefined,
              value: 1000,
            },
          },
        ],
      },
      {
        type: 'comment',
        value: 'If empty',
      },
      {
        blockType: 'IF',
        test: {
          target: {
            type: 'identifier',
            value: 'VARIABLE',
          },
          type: 'is_expression',
          value: {
            type: 'boolean',
            value: true,
          },
        },
        type: 'conditional_block',
        value: [],
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests conditional block statements **
// When default
WHEN VARIABLE IS T
VARNAME = 1000
END
// When empty
WHEN VARIABLE IS T

END
// If default
IF VARIABLE IS T
VARNAME = 1000
END
// If empty
IF VARIABLE IS T

END`);
  });

  test('alias statements', async () => {
    const program = maapInpParser.parse(await readTestData('alias.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests alias statements **',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        type: 'alias',
        value: [
          {
            target: {
              type: 'identifier',
              value: 'VARNAME',
            },
            type: 'as_expression',
            value: {
              type: 'identifier',
              value: 'Value',
            },
          },
        ],
      },
      {
        type: 'comment',
        value: 'Empty',
      },
      {
        type: 'alias',
        value: [],
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests alias statements **
// Default
ALIAS
VARNAME AS Value
END
// Empty
ALIAS

END`);
  });

  test('plotfil statements', async () => {
    const program = maapInpParser.parse(await readTestData('plotfil.INP')).output;
    expect(program.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Tests plotfil statements **',
      },
      {
        type: 'comment',
        value: 'Default',
      },
      {
        n: 3,
        type: 'plotfil',
        value: [
          [
            {
              type: 'identifier',
              value: 'A',
            },
            {
              type: 'identifier',
              value: 'B',
            },
            {
              type: 'identifier',
              value: 'C',
            },
          ],
          [
            {
              type: 'identifier',
              value: 'D',
            },
            {
              type: 'identifier',
              value: 'E',
            },
            {
              type: 'boolean',
              value: false,
            },
          ],
          [
            {
              type: 'identifier',
              value: 'G',
            },
            {
              type: 'identifier',
              value: 'H',
            },
            {
              arguments: [
                {
                  type: 'identifier',
                  value: 'J',
                },
              ],
              type: 'call_expression',
              value: {
                type: 'identifier',
                value: 'I',
              },
            },
          ],
        ],
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests plotfil statements **
// Default
PLOTFIL 3
A,B,C
D,E,F
G,H,I(J)
END`);
  });

  test('userevt statements', async () => {
    const program = maapInpParser.parse(await readTestData('userevt.INP')).output;
    expect(program.value).toEqual([
      { type: 'comment', value: ' Tests userevt statements **' },
      {
        type: 'comment',
        value: ' Also special blocks that appear only in USEREVT: Parameter, Action',
      },
      { type: 'comment', value: 'Default' },
      {
        type: 'user_evt',
        value: [
          {
            flag: {
              type: 'boolean',
              value: true,
            },
            index: 100,
            type: 'parameter',
            value: {
              type: 'parameter_name',
              value: 'Parameter Name',
            },
          },
          {
            flag: undefined,
            index: 102,
            type: 'parameter',
            value: {
              type: 'parameter_name',
              value: 'Parameter 2',
            },
          },
          {
            index: 1,
            type: 'action',
            value: [
              {
                flag: undefined,
                index: 103,
                type: 'parameter',
                value: {
                  type: 'parameter_name',
                  value: 'Parameter 3',
                },
              },
              {
                index: 2,
                type: 'action',
                value: [],
              },
            ],
          },
          {
            blockType: 'IF',
            test: {
              target: {
                type: 'identifier',
                value: 'VALUE',
              },
              type: 'is_expression',
              value: {
                type: 'boolean',
                value: true,
              },
            },
            type: 'conditional_block',
            value: [],
          },
        ],
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests userevt statements **
//  Also special blocks that appear only in USEREVT: Parameter, Action
// Default
USEREVT
100 T Parameter Name
102 Parameter 2
ACTION #1
103 Parameter 3
ACTION #2

END
END
IF VALUE IS T

END
END`);
  });

  test('function statements', async () => {
    const program = maapInpParser.parse(await readTestData('function.INP')).output;
    expect(program.value).toStrictEqual([
      { type: 'comment', value: ' Tests function statements **' },
      { type: 'comment', value: 'Default' },
      {
        name: {
          type: 'identifier',
          value: 'name',
        },
        type: 'function',
        value: {
          type: 'expression',
          value: {
            left: {
              type: 'number',
              units: undefined,
              value: 1,
            },
            op: '+',
            right: {
              type: 'number',
              units: undefined,
              value: 1,
            },
          },
        },
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests function statements **
// Default
FUNCTION name = 1 + 1`);
  });

  test('set timer statements', async () => {
    const program = maapInpParser.parse(await readTestData('timer.INP')).output;
    expect(program.value).toStrictEqual([
      { type: 'comment', value: ' Tests set timer statements **' },
      { type: 'comment', value: 'Default' },
      {
        type: 'set_timer',
        value: {
          type: 'timer',
          value: 1,
        },
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests set timer statements **
// Default
SET TIMER #1`);
  });

  test('lookup variable statements', async () => {
    const program = maapInpParser.parse(await readTestData('lookup.INP')).output;
    expect(program.value).toStrictEqual([
      { type: 'comment', value: ' Tests lookup statements **' },
      { type: 'comment', value: 'Default' },
      {
        name: {
          type: 'identifier',
          value: 'VariableName',
        },
        type: 'lookup_variable',
        value: ['You can type anything in here for now', 'It just gets separated by row'],
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests lookup statements **
// Default
LOOKUP VARIABLE VariableName
You can type anything in here for now
It just gets separated by row
END`);
  });
});

describe('program blocks', () => {
  test('source elements', async () => {
    const program = maapInpParser.parse(await readTestData('sourceElements.INP')).output;
    expect(program.value).toStrictEqual([
      { type: 'comment', value: ' Tests SourceElements **' },
      { type: 'comment', value: 'Statement' },
      {
        type: 'sensitivity',
        value: 'ON',
      },
      {
        type: 'comment',
        value: 'Assignment',
      },
      {
        target: {
          type: 'identifier',
          value: 'Identifier',
        },
        type: 'assignment',
        value: {
          type: 'number',
          units: 'HR',
          value: 1,
        },
      },
      {
        type: 'comment',
        value: 'Expression',
      },
      {
        arguments: [],
        type: 'call_expression',
        value: {
          type: 'identifier',
          value: 'Function',
        },
      },
      {
        type: 'comment',
        value: 'As Expression',
      },
      {
        target: {
          type: 'identifier',
          value: 'Identifier',
        },
        type: 'as_expression',
        value: {
          type: 'identifier',
          value: 'Value',
        },
      },
    ]);
    expect(maapInpParser.toString(program)).toBe(`//  Tests SourceElements **
// Statement
SENSITIVITY ON
// Assignment
Identifier = 1 HR
// Expression
Function()
// As Expression
Identifier AS Value`);
  });
});

describe('safeMode', () => {
  test('safe mode parser', async () => {
    const safeMode = await readTestData('safeMode.INP');
    // Safe mode off
    expect(() => {
      maapInpParser.parse(safeMode, {
        safeMode: false,
      });
    }).toThrow();
    // Safe mode on
    const safeParsed = maapInpParser.parse(safeMode, {
      safeMode: true,
    });
    expect(safeParsed.errors.length).toBe(2);
    expect(safeParsed.output.value).toStrictEqual([
      {
        type: 'comment',
        value: ' Invalid item in block',
      },
      {
        blockType: 'INITIATORS',
        type: 'block',
        value: [
          {
            type: 'parameter_name',
            value: 'A VALID INITIATOR',
          },
          {
            type: 'parameter_name',
            value: 'ANOTHER VALID INITIATOR',
          },
        ],
      },
      {
        type: 'comment',
        value: ' Invalid block',
      },
      {
        type: 'identifier',
        value: 'PLOTFIL',
      },
    ]);
  });
});

test('june 2025 bug fixes', async () => {
  const program = maapInpParser.parse(
    (await fs.readFile(path.join(__dirname, 'Test2.INP'))).toString(),
  ).output;
  expect(program.value).toStrictEqual([
    {
      type: 'sensitivity',
      value: 'ON',
    },
    {
      type: 'title',
      value: 'Test 2',
    },
    {
      type: 'file',
      fileType: 'PARAMETER FILE',
      value: 'Test2.PAR',
    },
    {
      type: 'block',
      blockType: 'PARAMETER CHANGE',
      value: [
        {
          type: 'assignment',
          target: {
            type: 'identifier',
            value: 'A',
          },
          value: {
            type: 'number',
            units: undefined,
            value: 0,
          },
        },
        {
          type: 'assignment',
          target: {
            type: 'identifier',
            value: 'B',
          },
          value: {
            type: 'number',
            units: undefined,
            value: 0,
          },
        },
        {
          type: 'assignment',
          target: {
            type: 'identifier',
            value: 'D',
          },
          value: {
            type: 'number',
            units: undefined,
            value: 0,
          },
        },
        {
          type: 'assignment',
          target: {
            type: 'identifier',
            value: 'E',
          },
          value: {
            type: 'number',
            units: undefined,
            value: 0,
          },
        },
        {
          type: 'assignment',
          target: {
            type: 'identifier',
            value: 'F',
          },
          value: {
            type: 'number',
            units: undefined,
            value: 0,
          },
        },
        {
          type: 'assignment',
          target: {
            type: 'identifier',
            value: 'G',
          },
          value: {
            type: 'number',
            units: 'W',
            value: 2,
          },
        },
      ],
    },
    {
      type: 'is_expression',
      target: {
        type: 'parameter_name',
        value: 'START TIME',
      },
      value: {
        type: 'number',
        units: 'HR',
        value: 0,
      },
    },
    {
      type: 'is_expression',
      target: {
        type: 'parameter_name',
        value: 'END TIME',
      },
      value: {
        type: 'number',
        units: 'HR',
        value: 7,
      },
    },
    {
      type: 'is_expression',
      target: {
        type: 'parameter_name',
        value: 'PRINT INTERVAL',
      },
      value: {
        type: 'number',
        units: 'HR',
        value: 1,
      },
    },
    {
      type: 'block',
      blockType: 'INITIATORS',
      value: [
        {
          type: 'parameter_name',
          value: 'LOSS OF AC POWER',
        },
      ],
    },
    {
      type: 'conditional_block',
      blockType: 'IF',
      test: {
        type: 'multi_expression',
        op: 'AND',
        value: [
          {
            type: 'expression',
            value: {
              left: {
                type: 'identifier',
                value: 'B',
              },
              op: '==',
              right: {
                type: 'number',
                value: 1,
                units: undefined,
              },
            },
          },
          {
            type: 'expression',
            value: {
              left: {
                type: 'identifier',
                value: 'TIM',
              },
              op: '>=',
              right: {
                type: 'expression_block',
                value: {
                  type: 'expression',
                  value: {
                    left: {
                      type: 'identifier',
                      value: 'A',
                    },
                    op: '+',
                    right: {
                      type: 'number',
                      value: 4,
                      units: undefined,
                    },
                  },
                },
                units: 'HR',
              },
            },
          },
        ],
      },
      value: [],
    },
    {
      type: 'conditional_block',
      blockType: 'IF',
      test: {
        type: 'multi_expression',
        op: 'AND',
        value: [
          {
            type: 'expression',
            value: {
              left: {
                type: 'identifier',
                value: 'A',
              },
              op: '!=',
              right: {
                type: 'number',
                value: 0,
                units: undefined,
              },
            },
          },
          {
            type: 'expression',
            value: {
              left: {
                type: 'identifier',
                value: 'TIM',
              },
              op: '>=',
              right: {
                type: 'parameter_name',
                value: 'A HR',
              },
            },
          },
        ],
      },
      value: [],
    },
    {
      type: 'conditional_block',
      blockType: 'WHEN',
      test: {
        type: 'expression',
        value: {
          left: {
            type: 'timer',
            value: 1,
          },
          op: '==',
          right: {
            type: 'parameter_name',
            value: 'D HR',
          },
        },
      },
      value: [],
    },
  ]);
});
