import type {
  MAAPActionStatement,
  MAAPAliasStatement,
  MAAPAsExpression,
  MAAPAssignment,
  MAAPBlockStatement,
  MAAPBooleanLiteral,
  MAAPCallExpression,
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
  MAAPTimerLiteral,
  MAAPTimerStatement,
  MAAPTitleStatement,
  MAAPUserEvtStatement,
  MAAPVariable,
} from '../../../../../../../../types/EMRALD_Model';
import type { Program } from './maap-parser-types';

export class MAAPToString {
  /**
   * The stringified MAAP code.
   */
  public output = '';

  /**
   * Variables detected in the program.
   */
  public variables: string[] = [];

  /**
   * Converts the given object into code.
   *
   * @param input - The object to compile.
   * @returns The compiled program.
   */
  public constructor(input?: Program) {
    if (!input) {
      return;
    }
    this.output = input.value
      .map(sourceElement => this.sourceElementToString(sourceElement))
      .join('\n');
  }

  /**
   * Compiles a NumericLiteral into code.
   *
   * @param numericLiteral - The object to compile.
   * @returns The compiled code.
   */
  public static numberToString(numericLiteral: MAAPNumericLiteral): string {
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
  public static booleanToString(booleanLiteral: MAAPBooleanLiteral): string {
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
  public static timerToString(timerLiteral: MAAPTimerLiteral): string {
    return `TIMER #${timerLiteral.value.toString()}`;
  }

  /**
   * Compiles a Literal into code.
   *
   * @param literal - The object to compile.
   * @returns The compiled code.
   */
  public static literalToString(literal: MAAPLiteral): string {
    switch (literal.type) {
      case 'number': {
        return MAAPToString.numberToString(literal);
      }
      case 'boolean': {
        return MAAPToString.booleanToString(literal);
      }
      default: {
        return MAAPToString.timerToString(literal);
      }
    }
  }

  /**
   * Compiles an Identifier into code.
   *
   * @param identifier - The object to compile.
   * @returns The compiled code.
   */
  public identifierToString(identifier: MAAPIdentifier): string {
    return identifier.value;
  }

  /**
   * Compiles a ParameterName into code.
   *
   * @param parameterName - The object to compile.
   * @returns The compiled code.
   */
  public parameterNameToString(parameterName: MAAPParameterName): string {
    return parameterName.value;
  }

  /**
   * Compiles a Parameter into code.
   *
   * @param parameter - The object to compile.
   * @returns The compiled code.
   */
  public parameterToString(parameter: MAAPParameter): string {
    let re = `${parameter.index?.toString() ?? ''} `;
    if (parameter.flag) {
      re += `${MAAPToString.booleanToString(parameter.flag)} `;
    }
    if (typeof parameter.value === 'string') {
      re += parameter.value;
    } else if (parameter.value.type === 'parameter_name') {
      re += this.parameterNameToString(parameter.value);
    } else {
      re += this.expressionToString(parameter.value);
    }
    return re;
  }

  /**
   * Compiles Arguments into code.
   *
   * @param args - The object to compile.
   * @returns The compiled code.
   */
  public argumentsToString(args: MAAPExpressionType[]): string {
    let re = '';
    for (const arg of args) {
      re += `${this.expressionTypeToString(arg)},`;
    }
    return re.slice(0, Math.max(0, re.length - 1));
  }

  /**
   * Compiles a CallExpression into code.
   *
   * @param callExpression - The object to compile.
   * @returns The compiled code.
   */
  public callExpressionToString(callExpression: MAAPCallExpression): string {
    return `${this.identifierToString(callExpression.value)}(${this.argumentsToString(
      callExpression.arguments,
    )})`;
  }

  /**
   * Compiles PureExpression into code.
   *
   * @param pureExpression - The object to compile.
   * @returns The compiled code.
   */
  public pureExpressionToString(pureExpression: MAAPPureExpression): string {
    let re = `${this.expressionTypeToString(pureExpression.left)} ${pureExpression.op} `;
    if (
      pureExpression.right.useVariable
      && pureExpression.right.type === 'identifier'
    ) {
      re += `" + ${pureExpression.right.value} + @"`;
      this.addVariable(pureExpression.right.value);
    } else if (pureExpression.right.type === 'expression') {
      re += this.pureExpressionToString(pureExpression.right);
    } else {
      re += this.expressionTypeToString(pureExpression.right);
    }
    return re;
  }

  /**
   * Compiles ExpressionBlock into code.
   *
   * @param expressionBlock - The object to compile.
   * @returns The compiled code.
   */
  public expressionBlockToString(expressionBlock: MAAPExpressionBlock): string {
    let s = `(${this.expressionToString(expressionBlock.value)})`;
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
  public expressionTypeToString(expressionType: MAAPExpressionType): string {
    if (expressionType.type === 'call_expression') {
      return this.callExpressionToString(expressionType);
    }
    if (expressionType.type === 'expression_block') {
      return this.expressionBlockToString(expressionType);
    }
    return this.variableToString(expressionType);
  }

  /**
   * Compiles an Assignment into code.
   *
   * @param assignment - The object to compile.
   * @returns The compiled code.
   */
  public assignmentToString(assignment: MAAPAssignment): string {
    const target
      = assignment.target.type === 'call_expression'
        ? this.callExpressionToString(assignment.target)
        : this.identifierToString(assignment.target);
    if (
      assignment.value.useVariable
      && assignment.value.type === 'identifier'
    ) {
      this.addVariable(assignment.value.value);
      return `${target} = " + ${assignment.value.value} + @"`;
    }
    return `${target} = ${this.expressionToString(assignment.value)}`;
  }

  /**
   * Compiles an IsExpression into code.
   *
   * @param isExpression - The object to compile.
   * @returns The compiled code.
   */
  public isExpressionToString(isExpression: MAAPIsExpression): string {
    return `${this.variableToString(isExpression.target)} IS ${this.expressionToString(isExpression.value)}`;
  }

  /**
   * Compiles an AsExpression into code.
   *
   * @param asExpression - The object to compile.
   * @returns The compiled code.
   */
  public asExpressionToString(asExpression: MAAPAsExpression): string {
    return `${this.variableToString(asExpression.target)} AS ${this.variableToString(asExpression.value)}`;
  }

  /**
   * Converts a multi part expression into code.
   * @param multiExpression - The expression to convert.
   */
  public multiExpressionToString(multiExpression: MAAPMultiPartExpression) {
    return `${multiExpression.value[0] ? this.expressionToString(multiExpression.value[0]) : ''} ${multiExpression.op} ${multiExpression.value[1] ? this.expressionToString(multiExpression.value[1]) : ''}`;
  }

  /**
   * Compiles an Expression into code.
   *
   * @param expression - The object to compile.
   * @returns The compiled code.
   */
  public expressionToString(expression: MAAPExpression): string {
    switch (expression.type) {
      case 'is_expression': {
        return this.isExpressionToString(expression);
      }
      case 'expression': {
        return this.pureExpressionToString(expression);
      }
      case 'multi_expression': {
        return this.multiExpressionToString(expression);
      }
      default: {
        return this.expressionTypeToString(expression);
      }
    }
  }

  /**
   * Compiles a Variable into code.
   *
   * @param variable - The object to compile.
   * @returns The compiled code.
   */
  public variableToString(variable: MAAPVariable) {
    switch (variable.type) {
      case 'call_expression': {
        return this.callExpressionToString(variable);
      }
      case 'number':
      case 'boolean':
      case 'timer': {
        return MAAPToString.literalToString(variable as MAAPLiteral);
      }
      case 'parameter_name': {
        return this.parameterNameToString(variable);
      }
      default: {
        return this.identifierToString(variable);
      }
    }
  }

  /**
   * Compiles an SensitivityStatement into code.
   *
   * @param sensitivityStatement - The object to compile.
   * @returns The compiled code.
   */
  public sensitivityToString(
    sensitivityStatement: MAAPSensitivityStatement,
  ): string {
    return `SENSITIVITY ${sensitivityStatement.value}`;
  }

  /**
   * Compiles a TitleStatement into code.
   *
   * @param titleStatement - The object to compile.
   * @returns The compiled code.
   */
  public titleToString(titleStatement: MAAPTitleStatement): string {
    return `TITLE\n${titleStatement.value}\nEND`;
  }

  /**
   * Compiles a FileStatement into code.
   *
   * @param fileStatement - The object to compile.
   * @returns The compiled code.
   */
  public fileToString(fileStatement: MAAPFileStatement): string {
    return `${fileStatement.fileType} ${fileStatement.value}`;
  }

  /**
   * Compiles a BlockStatement into code.
   *
   * @param blockStatement - The object to compile.
   * @returns The compiled code.
   */
  public blockToString(blockStatement: MAAPBlockStatement): string {
    return `${blockStatement.blockType}\n${blockStatement.value
      .map(sourceElement => this.sourceElementToString(sourceElement))
      .join('\n')}\nEND`;
  }

  /**
   * Compiles a ConditionalBlockStatement into code.
   *
   * @param conditionalBlockStatement - The object to compile.
   * @returns The compiled code.
   */
  public conditionalBlockToString(
    conditionalBlockStatement: MAAPConditionalBlockStatement,
  ): string {
    return `${conditionalBlockStatement.blockType} ${this.expressionToString(
      conditionalBlockStatement.test,
    )}\n${conditionalBlockStatement.value
      .map(sourceElement => this.sourceElementToString(sourceElement))
      .join('\n')}\nEND`;
  }

  /**
   * Compiles an AliasStatement into code.
   *
   * @param aliasStatement - The object to compile.
   * @returns The compiled code.
   */
  public aliasToString(aliasStatement: MAAPAliasStatement): string {
    return `ALIAS\n${aliasStatement.value
      .map(aliasBody => this.sourceElementToString(aliasBody))
      .join('\n')}\nEND`;
  }

  /**
   * Compiles a PlotFilStatement into code.
   *
   * @param plotfilStatement - The object to compile.
   * @returns The compiled code.
   */
  public plotfilToString(plotfilStatement: MAAPPlotFilStatement): string {
    return `PLOTFIL ${plotfilStatement.n.toString()}\n${plotfilStatement.value
      .map(plotFilBody =>
        plotFilBody.row
          .map(plotFilList => this.variableToString(plotFilList))
          .join(','),
      )
      .join('\n')}\nEND`;
  }

  /**
   * Compiles a UserEvtStatement into code.
   *
   * @param userEvtStatement - The object to compile.
   * @returns The compiled code.
   */
  public userEvtToString(userEvtStatement: MAAPUserEvtStatement) {
    return `USEREVT\n${this.userEvtBodyToString(userEvtStatement.value)}\nEND`;
  }

  /**
   * Compiles a UserEvtBody into code.
   *
   * @param userEvtBody - The object to compile.
   * @returns The compiled code.
   */
  public userEvtBodyToString(userEvtBody: MAAPSourceElement[]): string {
    return userEvtBody
      .map(userEvtElement => {
        if (userEvtElement.type === 'parameter') {
          return this.parameterToString(userEvtElement);
        }
        if (userEvtElement.type === 'action') {
          return this.actionToString(userEvtElement);
        }
        return this.sourceElementToString(userEvtElement);
      })
      .join('\n');
  }

  /**
   * Compiles an ActionStatement into code.
   *
   * @param actionStatement - The object to compile.
   * @returns The compiled code.
   */
  public actionToString(actionStatement: MAAPActionStatement): string {
    return `ACTION #${actionStatement.index.toString()}\n${this.userEvtBodyToString(actionStatement.value)}\nEND`;
  }

  /**
   * Compiles a FunctionStatement into code.
   *
   * @param functionStatement - The object to compile.
   * @returns The compiled code.
   */
  public functionToString(functionStatement: MAAPFunctionStatement): string {
    return `FUNCTION ${this.identifierToString(
      functionStatement.name,
    )} = ${this.expressionToString(functionStatement.value)}`;
  }

  /**
   * Compiles a TimerStatement into code.
   *
   * @param timerStatement - The object to compile.
   * @returns The compiled code.
   */
  public setTimerToString(timerStatement: MAAPTimerStatement): string {
    return `SET ${MAAPToString.timerToString(timerStatement.value)}`;
  }

  /**
   * Compiles an LookupStatement into code.
   *
   * @param lookupStatement - The object to compile.
   * @returns The compiled code.
   */
  public lookupToString(lookupStatement: MAAPLookupStatement): string {
    return `LOOKUP VARIABLE ${this.variableToString(
      lookupStatement.name,
    )}\n${lookupStatement.value.join('\n')}\nEND`;
  }

  /**
   * Compiles the given SourceElement object into code.
   *
   * @param sourceElement - The object to compile.
   * @returns The compiled code.
   */
  public sourceElementToString(sourceElement: MAAPSourceElement): string {
    switch (sourceElement.type) {
      case 'action': {
        return this.actionToString(sourceElement);
      }
      case 'alias': {
        return this.aliasToString(sourceElement);
      }
      case 'as_expression': {
        return this.asExpressionToString(sourceElement);
      }
      case 'assignment': {
        return this.assignmentToString(sourceElement);
      }
      case 'block': {
        return this.blockToString(sourceElement);
      }
      case 'boolean': {
        return MAAPToString.booleanToString(sourceElement);
      }
      case 'call_expression': {
        return this.callExpressionToString(sourceElement);
      }
      case 'conditional_block': {
        return this.conditionalBlockToString(sourceElement);
      }
      case 'expression': {
        return this.expressionToString(sourceElement);
      }
      case 'expression_block': {
        return this.expressionBlockToString(sourceElement);
      }
      case 'file': {
        return this.fileToString(sourceElement);
      }
      case 'function': {
        return this.functionToString(sourceElement);
      }
      case 'identifier': {
        return this.identifierToString(sourceElement);
      }
      case 'is_expression': {
        return this.isExpressionToString(sourceElement);
      }
      case 'lookup_variable': {
        return this.lookupToString(sourceElement);
      }
      case 'multi_expression': {
        return this.multiExpressionToString(sourceElement);
      }
      case 'number': {
        return MAAPToString.numberToString(sourceElement);
      }
      case 'parameter': {
        return this.parameterToString(sourceElement);
      }
      case 'parameter_name': {
        return this.parameterNameToString(sourceElement);
      }
      case 'plotfil': {
        return this.plotfilToString(sourceElement);
      }
      case 'sensitivity': {
        return this.sensitivityToString(sourceElement);
      }
      case 'set_timer': {
        return this.setTimerToString(sourceElement);
      }
      case 'timer': {
        return MAAPToString.timerToString(sourceElement);
      }
      case 'title': {
        return this.titleToString(sourceElement);
      }
      case 'user_evt': {
        return this.userEvtToString(sourceElement);
      }
    }
  }

  public addVariable(varname: string) {
    if (!this.variables.includes(varname)) {
      this.variables.push(varname);
    }
  }
}
