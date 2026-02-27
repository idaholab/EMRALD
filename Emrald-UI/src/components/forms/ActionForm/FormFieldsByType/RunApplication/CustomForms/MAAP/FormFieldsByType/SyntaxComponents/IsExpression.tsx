import type { MAAPExpression, MAAPVariable } from '../../../../../../../../../types/EMRALD_Model';
import { Expression } from './Expression';

export const IsExpression: React.FC<{
  target: MAAPVariable;
  value: MAAPExpression;
}> = ({ target, value }) => {
  return (
    <>
      {target.value}
      IS
      <Expression value={value} />
    </>
  );
};
