import type { Arguments, Program } from './maap-parser-types';
import type {
  MAAPActionStatement,
  MAAPAliasStatement,
  MAAPAsExpression,
  MAAPAssignment,
  MAAPBlockStatement,
  MAAPBooleanLiteral,
  MAAPCallExpression,
  MAAPComment,
  MAAPConditionalBlockStatement,
  MAAPExpression,
  MAAPExpressionBlock,
  MAAPExpressionType,
  MAAPFileStatement,
  MAAPFunctionStatement,
  MAAPIdentifier,
  MAAPIsExpression,
  MAAPLiteral,
  MAAPLookupStatement,
  MAAPMultiPartExpression,
  MAAPNumericLiteral,
  MAAPParameter,
  MAAPParameterName,
  MAAPPlotFilStatement,
  MAAPPureExpression,
  MAAPSensitivityStatement,
  MAAPSourceElement,
  MAAPStatement,
  MAAPTimerLiteral,
  MAAPTimerStatement,
  MAAPTitleStatement,
  MAAPUserEvtElement,
  MAAPUserEvtStatement,
  MAAPVariable,
} from '../../../../../../../../types/EMRALD_Model';

/**
 * Checks if a type is a literal.
 *
 * @param type - The type to check.
 * @returns If the type is a statement.
 */
function isLiteral(type: string) {
  return ['number', 'boolean', 'timer'].includes(type);
}

/**
 * Checks if a type is a statement.
 *
 * @param type - The type to check.
 * @returns If the type is a statement.
 */
function isStatement(type: string) {
  return [
    'sensitivity',
    'title',
    'file',
    'block',
    'conditional_block',
    'alias',
    'plotfil',
    'user_evt',
    'function',
    'set_timer',
    'lookup_variable',
    'action',
  ].includes(type);
}

/**
 * Compiles a NumericLiteral into code.
 *
 * @param numericLiteral - The object to compile.
 * @returns The compiled code.
 */
function numberToString(numericLiteral: MAAPNumericLiteral): string {
  let re = numericLiteral.value.toString();
  if (numericLiteral.units) {
    re += ` ${numericLiteral.units}`;
  }
  return re;
}

/**
 * Compiles a BooleanLiteral into code.
 *
 * @param booleanLiteral - The object to compile.
 * @returns The compiled code.
 */
function booleanToString(booleanLiteral: MAAPBooleanLiteral): string {
  if (booleanLiteral.value) {
    return 'T';
  }
  return 'F';
}

/**
 * Compiles a TimerLiteral into code.
 *
 * @param timerLiteral - The object to compile.
 * @returns The compiled code.
 */
function timerToString(timerLiteral: MAAPTimerLiteral): string {
  return `TIMER #${timerLiteral.value.toString()}`;
}

/**
 * Compiles a Literal into code.
 *
 * @param literal - The object to compile.
 * @returns The compiled code.
 */
function literalToString(literal: MAAPLiteral): string {
  switch (literal.type) {
    case 'number':
      return numberToString(literal);
    case 'boolean':
      return booleanToString(literal);
    case 'timer':
    default:
      return timerToString(literal);
  }
}

/**
 * Compiles an Identifier into code.
 *
 * @param identifier - The object to compile.
 * @returns The compiled code.
 */
export function identifierToString(identifier: MAAPIdentifier): string {
  return identifier.value;
}

/**
 * Compiles a ParameterName into code.
 *
 * @param parameterName - The object to compile.
 * @returns The compiled code.
 */
function parameterNameToString(parameterName: MAAPParameterName): string {
  return parameterName.value;
}

/**
 * Compiles a Parameter into code.
 *
 * @param parameter - The object to compile.
 * @returns The compiled code.
 */
function parameterToString(parameter: MAAPParameter): string {
  let re = `${parameter.index?.toString() ?? ''} `;
  if (parameter.flag) {
    re += `${booleanToString(parameter.flag)} `;
  }
  if (typeof parameter.value === 'string') {
    re += parameter.value;
  } else if (parameter.value.type === 'parameter_name') {
    re += parameterNameToString(parameter.value);
  } else {
    re += expressionToString(parameter.value);
  }
  return re;
}

/**
 * Compiles Arguments into code.
 *
 * @param args - The object to compile.
 * @returns The compiled code.
 */
function argumentsToString(args: Arguments): string {
  let re = '';
  args.forEach((arg) => {
    re += `${expressionTypeToString(arg)},`;
  });
  return re.substring(0, re.length - 1);
}

/**
 * Compiles a CallExpression into code.
 *
 * @param callExpression - The object to compile.
 * @returns The compiled code.
 */
export function callExpressionToString(callExpression: MAAPCallExpression): string {
  return `${identifierToString(callExpression.value)}(${argumentsToString(
    callExpression.arguments,
  )})`;
}

/**
 * Compiles PureExpression into code.
 *
 * @param pureExpression - The object to compile.
 * @returns The compiled code.
 */
function pureExpressionToString(pureExpression: MAAPPureExpression): string {
  let re = `${expressionTypeToString(pureExpression.value.left)} ${pureExpression.value.op} `;
  if (pureExpression.value.right.type === 'expression') {
    re += pureExpressionToString(pureExpression.value.right);
  } else {
    re += expressionTypeToString(pureExpression.value.right);
  }
  return re;
}

/**
 * Compiles ExpressionBlock into code.
 *
 * @param expressionBlock - The object to compile.
 * @returns The compiled code.
 */
export function expressionBlockToString(expressionBlock: MAAPExpressionBlock): string {
  let s = `(${pureExpressionToString(expressionBlock.value)})`;
  if (expressionBlock.units) {
    s += ` ${expressionBlock.units}`;
  }
  return s;
}

/**
 * Compiles ExpressionType into code.
 *
 * @param expressionType - The object to compile.
 * @returns The compiled code.
 */
export function expressionTypeToString(expressionType: MAAPExpressionType): string {
  if (expressionType.type === 'call_expression') {
    return callExpressionToString(expressionType);
  }
  if (expressionType.type === 'expression_block') {
    return expressionBlockToString(expressionType);
  }
  return variableToString(expressionType);
}

/**
 * Compiles an Assignment into code.
 *
 * @param assignment - The object to compile.
 * @returns The compiled code.
 */
function assignmentToString(assignment: MAAPAssignment): string {
  let target = '';
  if (assignment.target.type === 'call_expression') {
    target = callExpressionToString(assignment.target);
  } else {
    target = identifierToString(assignment.target);
  }
  return `${target} = ${expressionToString(assignment.value)}`;
}

/**
 * Compiles an IsExpression into code.
 *
 * @param isExpression - The object to compile.
 * @returns The compiled code.
 */
export function isExpressionToString(isExpression: MAAPIsExpression): string {
  if (typeof isExpression.value === 'string') {
    return `${variableToString(isExpression.target)} IS ${isExpression.value}`;
  }
  return `${variableToString(isExpression.target)} IS ${expressionToString(isExpression.value)}`;
}

/**
 * Compiles an AsExpression into code.
 *
 * @param asExpression - The object to compile.
 * @returns The compiled code.
 */
function asExpressionToString(asExpression: MAAPAsExpression): string {
  return `${variableToString(asExpression.target)} AS ${identifierToString(asExpression.value)}`;
}

/**
 * Converts a multi part expression into code.
 * @param multiExpression - The expression to convert.
 */
function multiExpressionToString(multiExpression: MAAPMultiPartExpression) {
  return `${expressionToString(multiExpression.value[0])} ${multiExpression.op} ${expressionToString(multiExpression.value[1])}`;
}

/**
 * Compiles an Expression into code.
 *
 * @param expression - The object to compile.
 * @returns The compiled code.
 */
export function expressionToString(expression: MAAPExpression): string {
  switch (expression.type) {
    case 'is_expression':
      return isExpressionToString(expression);
    case 'expression':
      return pureExpressionToString(expression);
    case 'multi_expression':
      return multiExpressionToString(expression);
    default:
      return expressionTypeToString(expression);
  }
}

/**
 * Compiles a Variable into code.
 *
 * @param variable - The object to compile.
 * @returns The compiled code.
 */
export function variableToString(variable: MAAPVariable) {
  if (variable.type === 'call_expression') {
    return callExpressionToString(variable);
  } else if (
    variable.type === 'number' ||
    variable.type === 'boolean' ||
    variable.type === 'timer'
  ) {
    return literalToString(variable as MAAPLiteral);
  } else if (variable.type === 'parameter_name') {
    return parameterNameToString(variable);
  }
  return identifierToString(variable);
}

/**
 * Compiles a Statement into code.
 *
 * @param statement - The object to compile.
 * @returns The compiled code.
 */
function statementToString(statement: MAAPStatement): string {
  switch (statement.type) {
    case 'sensitivity':
      return sensitivityToString(statement);
    case 'title':
      return titleToString(statement);
    case 'file':
      return fileToString(statement);
    case 'block':
      return blockToString(statement);
    case 'conditional_block':
      return conditionalBlockToString(statement);
    case 'alias':
      return aliasToString(statement);
    case 'plotfil':
      return plotfilToString(statement);
    case 'user_evt':
      return userEvtToString(statement);
    case 'function':
      return functionToString(statement);
    case 'set_timer':
      return setTimerToString(statement);
    case 'lookup_variable':
    default:
      return lookupToString(statement);
  }
}

/**
 * Compiles an SensitivityStatement into code.
 *
 * @param sensitivityStatement - The object to compile.
 * @returns The compiled code.
 */
function sensitivityToString(sensitivityStatement: MAAPSensitivityStatement): string {
  return `SENSITIVITY ${sensitivityStatement.value}`;
}

/**
 * Compiles a TitleStatement into code.
 *
 * @param titleStatement - The object to compile.
 * @returns The compiled code.
 */
function titleToString(titleStatement: MAAPTitleStatement): string {
  return `TITLE\n${titleStatement.value ?? ''}\nEND`;
}

/**
 * Compiles a FileStatement into code.
 *
 * @param fileStatement - The object to compile.
 * @returns The compiled code.
 */
function fileToString(fileStatement: MAAPFileStatement): string {
  return `${fileStatement.fileType} ${fileStatement.value}`;
}

/**
 * Compiles a BlockStatement into code.
 *
 * @param blockStatement - The object to compile.
 * @returns The compiled code.
 */
function blockToString(blockStatement: MAAPBlockStatement): string {
  return `${blockStatement.blockType}\n${blockStatement.value
    .map((sourceElement) => sourceElementToString(sourceElement))
    .join('\n')}\nEND`;
}

/**
 * Compiles a ConditionalBlockStatement into code.
 *
 * @param conditionalBlockStatement - The object to compile.
 * @returns The compiled code.
 */
function conditionalBlockToString(
  conditionalBlockStatement: MAAPConditionalBlockStatement,
): string {
  return `${conditionalBlockStatement.blockType} ${expressionToString(
    conditionalBlockStatement.test,
  )}\n${conditionalBlockStatement.value
    .map((sourceElement) => sourceElementToString(sourceElement))
    .join('\n')}\nEND`;
}

/**
 * Compiles an AliasStatement into code.
 *
 * @param aliasStatement - The object to compile.
 * @returns The compiled code.
 */
function aliasToString(aliasStatement: MAAPAliasStatement): string {
  return `ALIAS\n${aliasStatement.value
    .map((aliasBody) => asExpressionToString(aliasBody))
    .join('\n')}\nEND`;
}

/**
 * Compiles a PlotFilStatement into code.
 *
 * @param plotfilStatement - The object to compile.
 * @returns The compiled code.
 */
function plotfilToString(plotfilStatement: MAAPPlotFilStatement): string {
  return `PLOTFIL ${plotfilStatement.n.toString()}\n${plotfilStatement.value
    .map((plotFilBody) => plotFilBody.map((plotFilList) => variableToString(plotFilList)).join(','))
    .join('\n')}\nEND`;
}

/**
 * Compiles a UserEvtStatement into code.
 *
 * @param userEvtStatement - The object to compile.
 * @returns The compiled code.
 */
function userEvtToString(userEvtStatement: MAAPUserEvtStatement) {
  return `USEREVT\n${userEvtBodyToString(userEvtStatement.value)}\nEND`;
}

/**
 * Compiles a UserEvtBody into code.
 *
 * @param userEvtBody - The object to compile.
 * @returns The compiled code.
 */
function userEvtBodyToString(userEvtBody: MAAPUserEvtElement[]): string {
  return userEvtBody
    .map((userEvtElement) => {
      if (userEvtElement.type === 'parameter') {
        return parameterToString(userEvtElement);
      }
      if (userEvtElement.type === 'action') {
        return actionToString(userEvtElement);
      }
      return sourceElementToString(userEvtElement);
    })
    .join('\n');
}

/**
 * Compiles an ActionStatement into code.
 *
 * @param actionStatement - The object to compile.
 * @returns The compiled code.
 */
function actionToString(actionStatement: MAAPActionStatement): string {
  return `ACTION #${actionStatement.index.toString()}\n${userEvtBodyToString(actionStatement.value)}\nEND`;
}

/**
 * Compiles a FunctionStatement into code.
 *
 * @param functionStatement - The object to compile.
 * @returns The compiled code.
 */
function functionToString(functionStatement: MAAPFunctionStatement): string {
  return `FUNCTION ${identifierToString(
    functionStatement.name,
  )} = ${expressionToString(functionStatement.value)}`;
}

/**
 * Compiles a TimerStatement into code.
 *
 * @param timerStatement - The object to compile.
 * @returns The compiled code.
 */
function setTimerToString(timerStatement: MAAPTimerStatement): string {
  return `SET ${timerToString(timerStatement.value)}`;
}

/**
 * Compiles an LookupStatement into code.
 *
 * @param lookupStatement - The object to compile.
 * @returns The compiled code.
 */
function lookupToString(lookupStatement: MAAPLookupStatement): string {
  return `LOOKUP VARIABLE ${variableToString(
    lookupStatement.name,
  )}\n${lookupStatement.value.join('\n')}\nEND`;
}

/**
 * Compiles the given SourceElement object into code.
 *
 * @param sourceElement - The object to compile.
 * @returns The compiled code.
 */
export function sourceElementToString(sourceElement: MAAPSourceElement | MAAPComment): string {
  if (sourceElement.type === 'comment') {
    return `// ${sourceElement.value}`;
  }
  if (isStatement(sourceElement.type)) {
    return statementToString(sourceElement as MAAPStatement);
  }
  if (sourceElement.type === 'assignment') {
    return assignmentToString(sourceElement);
  }
  if (sourceElement.type === 'as_expression') {
    return asExpressionToString(sourceElement);
  }
  return expressionToString(sourceElement as MAAPExpression);
}

/**
 * Converts the given object into code.
 *
 * @param input - The object to compile.
 * @returns The compiled program.
 */
export function MAAPToString(
  input: Program | MAAPUserEvtElement | MAAPLiteral | MAAPIdentifier,
): string {
  if (isStatement(input.type)) {
    return statementToString(input as MAAPStatement);
  }
  if (isLiteral(input.type)) {
    return literalToString(input as MAAPLiteral);
  }
  switch (input.type) {
    case 'program':
      return input.value.map((sourceElement) => sourceElementToString(sourceElement)).join('\n');
    case 'parameter':
      return parameterToString(input);
    case 'call_expression':
      return callExpressionToString(input);
    case 'expression':
      return pureExpressionToString(input);
    case 'expression_block':
      return expressionBlockToString(input);
    case 'assignment':
      return assignmentToString(input);
    case 'is_expression':
      return isExpressionToString(input);
    case 'as_expression':
      return asExpressionToString(input);
    case 'identifier':
      return identifierToString(input);
    case 'parameter_name':
      return parameterNameToString(input);
    case 'comment':
      return sourceElementToString(input);
    default:
      throw new Error(`Unexpected input type: ${input.type}`);
  }
}
