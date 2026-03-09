import type { MAAPIdentifier } from '../../../../../../../../../types/EMRALD_Model';

export const Identifier: React.FC<{
  value: MAAPIdentifier;
}> = ({ value }) => <span>{value.value}</span>;
