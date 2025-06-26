import type { MAAPPureExpression } from '../../../../../../../../../types/EMRALD_Model';
import { PureExpression } from './PureExpression';

export const ExpressionBlock: React.FC<{
  value: MAAPPureExpression;
  units?: string;
}> = ({ value, units }) => {
  return (
    <>
      (<PureExpression value={value} />)
      {units ? <>&nbsp;{units}</> : ''}
    </>
  );
};
