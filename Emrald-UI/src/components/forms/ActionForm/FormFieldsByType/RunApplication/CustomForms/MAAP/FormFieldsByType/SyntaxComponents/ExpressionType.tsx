import type { MAAPExpressionType } from '../../../../../../../../../types/EMRALD_Model';
import { CallExpression } from './CallExpression';
import { ExpressionBlock } from './ExpressionBlock';

export const ExpressionType: React.FC<{
  value: MAAPExpressionType;
}> = ({ value }) => {
  return (
    <>
      {value.type === 'call_expression' ? (
        <CallExpression args={value.arguments} value={value.value} />
      ) : value.type === 'expression_block' ? (
        <ExpressionBlock value={value.value} units={value.units} />
      ) : (
        value.value
      )}
    </>
  );
};
