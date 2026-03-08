import type { MAAPExpression, MAAPVariable } from '../../../../../../../../../types/EMRALD_Model';
import { Expression } from './Expression';
import { Identifier } from './Identifier';

export const IsExpression: React.FC<{
  target: MAAPVariable;
  value: MAAPExpression;
}> = ({ target, value }) => (
  <>
    {typeof target.value === 'object' ? <Identifier value={target.value} /> : target.value}
    IS
    <Expression value={value} />
  </>
);
