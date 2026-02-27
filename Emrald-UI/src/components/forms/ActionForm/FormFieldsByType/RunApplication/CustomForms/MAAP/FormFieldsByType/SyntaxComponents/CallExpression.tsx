import type {
  MAAPExpressionType,
  MAAPIdentifier,
} from '../../../../../../../../../types/EMRALD_Model';
import { ExpressionType } from './ExpressionType';

export const CallExpression: React.FC<{
  args: MAAPExpressionType[];
  value: MAAPIdentifier;
}> = ({ args, value }) => {
  return (
    <>
      {value.value}(
      {args.map((arg) => (
        <ExpressionType value={arg} />
      ))}
      )
    </>
  );
};
