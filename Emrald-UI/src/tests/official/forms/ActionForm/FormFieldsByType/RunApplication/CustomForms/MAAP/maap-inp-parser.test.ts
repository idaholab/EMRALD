import fs from 'fs/promises';
import path from 'path';
import maapInpParser from '../../../../../../../../components/forms/ActionForm/FormFieldsByType/RunApplication/CustomForms/MAAP/Parser/index';
import { beforeAll, describe, expect, test } from 'vitest';
import type { Program } from '../../../../../../../../components/forms/ActionForm/FormFieldsByType/RunApplication/CustomForms/MAAP/Parser/maap-parser-types';

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
    const expected: Program = {
      type: 'program',
      comments: [['Tests boolean literals **', 'Main'], []],
      value: [
        {
          type: 'boolean',
          value: true,
          comments: [[], []],
        },
        {
          type: 'boolean',
          value: false,
          comments: [[], []],
        },
        {
          type: 'boolean',
          value: true,
          comments: [['Shorthand'], []],
        },
        {
          type: 'boolean',
          value: false,
          comments: [[], []],
        },
      ],
    };
    expect(program).toEqual(expected);
  });

  test('numerical literal', async () => {
    const program = maapInpParser.parse(await readTestData('numeric.INP')).output;
    const expected: Program = {
      type: 'program',
      value: [
        {
          type: 'number',
          value: 1,
          units: undefined,
          comments: [[], []],
        },
        {
          type: 'number',
          value: 2,
          units: undefined,
          comments: [['Decimal'], []],
        },
        {
          type: 'number',
          value: 3,
          units: undefined,
          comments: [[], []],
        },
        {
          type: 'number',
          units: undefined,
          value: 4,
          comments: [['E notation'], []],
        },
        {
          type: 'number',
          units: undefined,
          value: 0.005,
          comments: [[], []],
        },
      ],
      comments: [['Tests numeric literals **', 'Basic number'], []],
    };
    expect(program).toEqual(expected);
  });
});

describe('expressions', () => {
  test('call expression', async () => {
    const program = maapInpParser.parse(await readTestData('call.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests call expressions **', 'No arguments'], []],
      value: [
        {
          arguments: [],
          type: 'call_expression',
          value: {
            type: 'identifier',
            value: 'Name',
          },
          comments: [[], []],
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
          comments: [['One argument'], []],
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
          comments: [['Many arguments'], []],
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
          comments: [['Nested calls'], []],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`Name()
Name(1)
Name(1,2,3)
Name(Of(A(Function())))`);
  });

  test('is expression', async () => {
    const program = maapInpParser.parse(await readTestData('is.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests IS expressions **', 'Default'], []],
      value: [
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
          comments: [[], []],
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
          comments: [['Special IS expressions'], []],
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
          comments: [[], []],
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
          comments: [[], []],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`VARNAME IS Value
START TIME IS 0
END TIME IS 144000
PRINT INTERVAL IS 5000`);
  });

  test('multi expression', async () => {
    const program = maapInpParser.parse(await readTestData('multi-expression.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [[], []],
      value: [
        {
          type: 'conditional_block',
          blockType: 'IF',
          test: {
            type: 'multi_expression',
            op: 'AND',
            value: [
              {
                type: 'expression',
                op: '!=',
                left: {
                  type: 'identifier',
                  value: 'A',
                },
                right: {
                  type: 'number',
                  value: 0,
                  units: undefined,
                },
              },
              {
                type: 'expression',
                op: '>=',
                left: {
                  type: 'identifier',
                  value: 'B',
                },
                right: {
                  type: 'identifier',
                  value: 'C',
                },
              },
            ],
            comments: ['Comment 1', 'Comment 2', 'Comment 3'],
          },
          value: [
            {
              type: 'identifier',
              value: 'TEST',
              comments: [['Comment 5', 'Comment 6'], ['Comment 7']],
            },
          ],
          comments: [['Comment 4'], ['Comment 8', 'Comment 9', 'Comment 10']],
        },
        {
          type: 'conditional_block',
          blockType: 'IF',
          test: {
            type: 'multi_expression',
            comments: [],
            op: 'AND',
            value: [
              {
                type: 'expression',
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
              {
                type: 'multi_expression',
                comments: [],
                op: 'OR',
                value: [
                  {
                    type: 'expression',
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
                  {
                    type: 'is_expression',
                    target: {
                      type: 'identifier',
                      value: 'A',
                    },
                    value: {
                      type: 'identifier',
                      value: 'B',
                    },
                  },
                ],
              },
            ],
          },
          value: [
            {
              comments: [[], []],
              type: 'identifier',
              value: 'TEST',
            },
          ],
          comments: [[], []],
        },
        {
          type: 'conditional_block',
          blockType: 'IF',
          test: {
            type: 'multi_expression',
            comments: [],
            op: 'AND',
            value: [
              {
                type: 'expression',
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
              {
                type: 'expression',
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
            ],
          },
          value: [],
          comments: [['Comment 1'], ['Comment 2', 'Comment 3']],
        },
        {
          type: 'conditional_block',
          blockType: 'IF',
          comments: [[], []],
          test: {
            type: 'multi_expression',
            comments: [],
            op: 'AND',
            value: [
              {
                type: 'expression_block',
                value: {
                  type: 'expression',
                  left: {
                    type: 'identifier',
                    value: 'A',
                  },
                  op: '>',
                  right: {
                    type: 'identifier',
                    value: 'B',
                  },
                },
                units: undefined,
              },
              {
                type: 'expression_block',
                value: {
                  type: 'expression',
                  left: {
                    type: 'expression_block',
                    value: {
                      type: 'multi_expression',
                      op: 'AND',
                      value: [
                        {
                          type: 'expression',
                          left: {
                            type: 'number',
                            units: undefined,
                            value: 0,
                          },
                          op: '<',
                          right: {
                            type: 'number',
                            units: undefined,
                            value: 1,
                          },
                        },
                        {
                          type: 'boolean',
                          value: true,
                        },
                      ],
                      comments: [],
                    },
                    units: undefined,
                  },
                  op: '==',
                  right: {
                    type: 'expression_block',
                    value: {
                      type: 'multi_expression',
                      op: 'AND',
                      value: [
                        {
                          type: 'expression',
                          left: {
                            type: 'identifier',
                            value: 'B',
                          },
                          op: '>',
                          right: {
                            type: 'number',
                            units: undefined,
                            value: 1,
                          },
                        },
                        {
                          type: 'boolean',
                          value: false,
                        },
                      ],
                      comments: [],
                    },
                    units: undefined,
                  },
                },
                units: undefined,
              },
            ],
          },
          value: [],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`IF A != 0 AND B >= C
TEST
END
IF A != 0 AND B >= C OR A IS B
TEST
END
IF A != 0 AND B >= C

END
IF (A > B) AND ((0 < 1 AND T) == (B > 1 AND F))

END`);
  });
});

describe('statements', () => {
  test('sensitivity statements', async () => {
    const program = maapInpParser.parse(await readTestData('sensitivity.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests sensitivity statements **', 'Default'], []],
      value: [
        {
          type: 'sensitivity',
          value: 'ON',
          comments: [[], []],
        },
        {
          type: 'sensitivity',
          value: 'OFF',
          comments: [['Alternate value'], []],
        },
        {
          type: 'identifier',
          value: 'SENSITIVITY',
          comments: [
            ['No value', 'Should parse as an identifier, not a sensitivity statement'],
            [],
          ],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`SENSITIVITY ON
SENSITIVITY OFF
SENSITIVITY`);
  });

  test('title statements', async () => {
    const program = maapInpParser.parse(await readTestData('title.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests title statements **', 'Default'], []],
      value: [
        {
          type: 'title',
          value: 'Valid Title ',
          comments: [
            ['Comment 1', 'Comment 2', 'Comment 3', 'Comment 4'],
            ['Comment 5', 'Comment 6'],
          ],
        },
        {
          type: 'title',
          value: 'A title that\nextends onto\nmultiple lines',
          comments: [['Many lines'], []],
        },
        {
          type: 'title',
          value: '',
          comments: [['Empty title'], []],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`TITLE
Valid Title 
END
TITLE
A title that
extends onto
multiple lines
END
TITLE

END`);
  });

  test('block statements', async () => {
    const program = maapInpParser.parse(await readTestData('block.INP')).output;
    const expected: Program = {
      type: 'program',
      value: [
        {
          type: 'title',
          value: 'Tests syntax for block statements',
          comments: [[], []],
        },
        {
          type: 'block',
          blockType: 'PARAMETER CHANGE',
          comments: [
            ['Default', 'Comment 1', 'Comment 2', 'Comment 3'],
            ['Comment 7', 'Comment 8', 'Comment 9'],
          ],
          value: [
            {
              type: 'assignment',
              target: {
                type: 'call_expression',
                value: {
                  type: 'identifier',
                  value: 'VarName',
                },
                arguments: [
                  {
                    type: 'number',
                    value: 1,
                    units: undefined,
                  },
                ],
              },
              value: {
                type: 'number',
                value: 1,
                units: undefined,
              },
              comments: [['Comment 4', 'Comment 5'], ['Comment 6']],
            },
          ],
        },
        {
          type: 'block',
          blockType: 'PARAMETER CHANGE',
          comments: [
            ['Empty', 'Comment 1'],
            ['Comment 2', 'Comment 3', 'Comment 4'],
          ],
          value: [],
        },
        {
          type: 'block',
          blockType: 'PARAMETER CHANGE',
          comments: [['With nested source elements', 'Comment 1', 'Comment 2'], ['Comment 12']],
          value: [
            {
              type: 'conditional_block',
              blockType: 'IF',
              test: {
                type: 'is_expression',
                target: {
                  type: 'identifier',
                  value: 'VarName',
                },
                value: {
                  type: 'number',
                  value: 1,
                  units: undefined,
                },
              },
              value: [
                {
                  type: 'set_timer',
                  value: {
                    type: 'timer',
                    value: 1,
                  },
                  comments: [['Comment 6', 'Comment 7'], ['Comment 8']],
                },
              ],
              comments: [
                ['Comment 3', 'Comment 4', 'Comment 5'],
                ['Comment 9', 'Comment 10', 'Comment 11'],
              ],
            },
          ],
        },
        {
          type: 'block',
          blockType: 'INITIATORS',
          comments: [
            ['Default', 'Comment 1', 'Comment 2'],
            ['Comment 9', 'Comment 10', 'Comment 11'],
          ],
          value: [
            {
              type: 'assignment',
              target: {
                type: 'identifier',
                value: 'VarName',
              },
              value: {
                type: 'number',
                value: 1,
                units: undefined,
              },
              comments: [['Comment 3', 'Comment 4'], ['Comment 5']],
            },
            {
              type: 'assignment',
              target: {
                type: 'identifier',
                value: 'INIT1',
              },
              value: {
                type: 'boolean',
                value: true,
              },
              comments: [['Comment 6', 'Comment 7'], ['Comment 8']],
            },
          ],
        },
        {
          type: 'block',
          blockType: 'INITIATORS',
          value: [],
          comments: [['Empty'], []],
        },
        {
          type: 'block',
          blockType: 'INITIATORS',
          comments: [['With nested source elements', 'Comment 1', 'Comment 2'], ['Comment 12']],
          value: [
            {
              type: 'conditional_block',
              blockType: 'IF',
              test: {
                type: 'is_expression',
                target: {
                  type: 'identifier',
                  value: 'VarName',
                },
                value: {
                  type: 'number',
                  value: 1,
                  units: undefined,
                },
              },
              comments: [
                ['Comment 3', 'Comment 4', 'Comment 5'],
                ['Comment 9', 'Comment 10', 'Comment 11'],
              ],
              value: [
                {
                  type: 'set_timer',
                  value: {
                    type: 'timer',
                    value: 1,
                  },
                  comments: [['Comment 6', 'Comment 7'], ['Comment 8']],
                },
              ],
            },
          ],
        },
      ],
      comments: [['Block'], []],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`TITLE
Tests syntax for block statements
END
PARAMETER CHANGE
VarName(1) = 1
END
PARAMETER CHANGE

END
PARAMETER CHANGE
IF VarName IS 1
SET TIMER #1
END
END
INITIATORS
VarName = 1
INIT1 = T
END
INITIATORS

END
INITIATORS
IF VarName IS 1
SET TIMER #1
END
END`);
  });

  test('conditional block statements', async () => {
    const program = maapInpParser.parse(await readTestData('conditionalBlock.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests conditional block statements **', 'When default', 'Comment 1'], []],
      value: [
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
              comments: [['Comment 3', 'Comment 4'], ['Comment 5']],
            },
          ],
          comments: [['Comment 2'], ['Comment 6', 'Comment 7', 'Comment 8']],
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
          comments: [['When empty'], []],
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
              comments: [[], []],
            },
          ],
          comments: [['If default'], []],
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
          comments: [['If empty'], []],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`WHEN VARIABLE IS T
VARNAME = 1000
END
WHEN VARIABLE IS T

END
IF VARIABLE IS T
VARNAME = 1000
END
IF VARIABLE IS T

END`);
  });

  test('alias statements', async () => {
    const program = maapInpParser.parse(await readTestData('alias.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Alias'], ['End alias statements **']],
      value: [
        {
          type: 'title',
          value: 'Tests syntax for alias statements',
          comments: [[], []],
        },
        {
          type: 'alias',
          comments: [
            ['Default', 'Comment 1', 'Comment 2', 'Comment 3'],
            ['Comment 10', 'Comment 11', 'Comment 12'],
          ],
          value: [
            {
              type: 'as_expression',
              target: {
                type: 'identifier',
                value: 'VARNAME',
              },
              value: {
                type: 'identifier',
                value: 'Value',
              },
              comments: [['Comment 4', 'Comment 5'], ['Comment 6']],
            },
            {
              type: 'as_expression',
              target: {
                type: 'identifier',
                value: 'VARNAME2',
              },
              value: {
                type: 'identifier',
                value: 'Value2',
              },
              comments: [['Comment 7', 'Comment 8'], ['Comment 9']],
            },
          ],
        },
        {
          type: 'alias',
          comments: [
            ['Empty', 'Comment 1', 'Comment 2', 'Comment 3'],
            ['Comment 4', 'Comment 5', 'Comment 12'],
          ],
          value: [],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`TITLE
Tests syntax for alias statements
END
ALIAS
VARNAME AS Value
VARNAME2 AS Value2
END
ALIAS

END`);
  });

  test('plotfil statements', async () => {
    const program = maapInpParser.parse(await readTestData('plotfil.INP')).output;
    const expected: Program = {
      type: 'program',
      value: [
        {
          n: 4,
          type: 'plotfil',
          value: [
            {
              row: [
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
              comments: ['Comment 2', 'Comment 3'],
            },
            {
              row: [
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
              comments: ['Comment 4', 'Comment 5'],
            },
            {
              row: [
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
              comments: [],
            },
          ],
          comments: [['Comment 1'], []],
        },
        {
          n: 3,
          type: 'plotfil',
          value: [],
          comments: [
            ['Empty', 'Comment 1'],
            ['Comment 2', 'Comment 3', 'Comment 4'],
          ],
        },
      ],
      comments: [['Tests plotfil statements **', 'Default'], []],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`PLOTFIL 4
A,B,C
D,E,F
G,H,I(J)
END
PLOTFIL 3

END`);
  });

  test('userevt statements', async () => {
    const program = maapInpParser.parse(await readTestData('userevt.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [
        [
          'Tests userevt statements **',
          'Also special blocks that appear only in USEREVT: Parameter, Action',
          'Default',
        ],
        [],
      ],
      value: [
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
              comments: [['Parameter with T/F value'], []],
            },
            {
              flag: undefined,
              index: 102,
              type: 'parameter',
              value: {
                type: 'parameter_name',
                value: 'Parameter 2',
              },
              comments: [['Parameter without T/F value'], []],
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
                  comments: [['Comment 3', 'Comment 4'], ['Comment 5']],
                },
                {
                  index: 2,
                  type: 'action',
                  value: [],
                  comments: [
                    ['Comment 6', 'Comment 7', 'Comment 8'],
                    ['Comment 9', 'Comment 10', 'Comment 11'],
                  ],
                },
              ],
              comments: [['Comment 1', 'Action', 'Comment 2'], ['Comment 12']],
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
              comments: [['Any other source element'], []],
            },
          ],
          comments: [['Comment 1'], []],
        },
      ],
    };
    expect(program).toEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`USEREVT
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
    const expected: Program = {
      type: 'program',
      comments: [['Tests function statements **', 'Default'], []],
      value: [
        {
          name: {
            type: 'identifier',
            value: 'name',
          },
          type: 'function',
          value: {
            type: 'expression',
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
          comments: [[], ['Comment']],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`FUNCTION name = 1 + 1`);
  });

  test('set timer statements', async () => {
    const program = maapInpParser.parse(await readTestData('timer.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests set timer statements **', 'Default'], []],
      value: [
        {
          type: 'set_timer',
          value: {
            type: 'timer',
            value: 1,
          },
          comments: [[], []],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`SET TIMER #1`);
  });

  test('lookup variable statements', async () => {
    const program = maapInpParser.parse(await readTestData('lookup.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests lookup statements **', 'Default'], []],
      value: [
        {
          name: {
            type: 'identifier',
            value: 'VariableName',
          },
          type: 'lookup_variable',
          value: ['You can type anything in here for now', 'It just gets separated by row'],
          comments: [['Comment 1'], ['Comment 2']],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`LOOKUP VARIABLE VariableName
You can type anything in here for now
It just gets separated by row
END`);
  });
});

describe('program blocks', () => {
  test('source elements', async () => {
    const program = maapInpParser.parse(await readTestData('sourceElements.INP')).output;
    const expected: Program = {
      type: 'program',
      comments: [['Tests SourceElements **', 'Statement'], []],
      value: [
        {
          type: 'sensitivity',
          value: 'ON',
          comments: [[], []],
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
          comments: [['Assignment'], []],
        },
        {
          arguments: [],
          type: 'call_expression',
          value: {
            type: 'identifier',
            value: 'Function',
          },
          comments: [['Expression'], []],
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
          comments: [['As Expression'], []],
        },
      ],
    };
    expect(program).toStrictEqual(expected);
    expect(maapInpParser.toString(program)).toBe(`SENSITIVITY ON
Identifier = 1 HR
Function()
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
        blockType: 'INITIATORS',
        type: 'block',
        value: [
          {
            type: 'parameter_name',
            value: 'A VALID INITIATOR',
            comments: [[], []],
          },
          {
            type: 'parameter_name',
            value: 'ANOTHER VALID INITIATOR',
            comments: [[], []],
          },
        ],
        comments: [[], ['IS NOT VALID']],
      },
      {
        type: 'identifier',
        value: 'PLOTFIL',
        comments: [['Invalid block'], []],
      },
    ]);
  });
});

test('june 2025 bug fixes', async () => {
  const program = maapInpParser.parse(
    (await fs.readFile(path.join(__dirname, 'Test2.INP'))).toString(),
  ).output;
  const expected: Program = {
    type: 'program',
    comments: [[], []],
    value: [
      {
        type: 'sensitivity',
        value: 'ON',
        comments: [[], []],
      },
      {
        type: 'title',
        value: 'Test 2',
        comments: [[], []],
      },
      {
        type: 'file',
        fileType: 'PARAMETER FILE',
        value: 'Test2.PAR',
        comments: [[], []],
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
            comments: [[], []],
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
            comments: [[], []],
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
            comments: [[], []],
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
            comments: [[], []],
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
            comments: [[], []],
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
            comments: [[], []],
          },
        ],
        comments: [[], []],
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
        comments: [[], []],
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
        comments: [[], []],
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
        comments: [[], []],
      },
      {
        type: 'block',
        blockType: 'INITIATORS',
        value: [
          {
            type: 'parameter_name',
            value: 'LOSS OF AC POWER',
            comments: [[], []],
          },
        ],
        comments: [[], []],
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
            {
              type: 'expression',
              left: {
                type: 'identifier',
                value: 'TIM',
              },
              op: '>=',
              right: {
                type: 'expression_block',
                value: {
                  type: 'expression',
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
                units: 'HR',
              },
            },
          ],
          comments: [],
        },
        value: [],
        comments: [[], []],
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
            {
              type: 'expression',
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
          ],
          comments: [],
        },
        value: [],
        comments: [[], []],
      },
      {
        type: 'conditional_block',
        blockType: 'WHEN',
        test: {
          type: 'expression',
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
        value: [],
        comments: [[], []],
      },
    ],
  };
  expect(program).toStrictEqual(expected);
});
