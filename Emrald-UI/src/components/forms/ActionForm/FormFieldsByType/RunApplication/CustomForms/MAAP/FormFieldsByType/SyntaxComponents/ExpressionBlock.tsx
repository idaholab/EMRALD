import type { MAAPExpression } from '../../../../../../../../../types/EMRALD_Model';
import { Expression } from './Expression';

export const ExpressionBlock: React.FC<{
  value: MAAPExpression;
  units?: string;
}> = ({ value, units }) => {
  return (
    <>
      (<Expression value={value} />)
      {units ? <>&nbsp;{units}</> : ''}
    </>
  );
};
