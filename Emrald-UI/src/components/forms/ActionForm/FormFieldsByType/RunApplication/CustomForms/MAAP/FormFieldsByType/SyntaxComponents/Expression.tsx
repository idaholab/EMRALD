import type { MAAPExpression } from '../../../../../../../../../types/EMRALD_Model';
import { CallExpression } from './CallExpression';
import { ExpressionBlock } from './ExpressionBlock';
import { IsExpression } from './IsExpression';
import { MultiExpression } from './MultiExpression';
import { PureExpression } from './PureExpression';

export const Expression: React.FC<{
  value?: MAAPExpression;
}> = ({ value }) =>
  value === undefined ? (
    <></>
  ) : (
    <>
      {value.type === 'multi_expression' ? (
        <MultiExpression op={value.op} value={value.value} />
      ) : value.type === 'is_expression' ? (
        <IsExpression target={value.target} value={value.value} />
      ) : value.type === 'call_expression' ? (
        <CallExpression args={value.arguments} value={value.value} />
      ) : value.type === 'expression_block' ? (
        <ExpressionBlock value={value.value} />
      ) : value.type === 'expression' ? (
        <PureExpression value={value} />
      ) : value.type === 'timer' ? (
        `TIMER #${value.value.toString()}`
      ) : (
        value.value
      )}
    </>
  );
