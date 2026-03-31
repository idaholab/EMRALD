import type { GateType } from '../../../../types/EMRALD_Model';
import { TbLogicAnd, TbLogicNot, TbLogicOr } from 'react-icons/tb';

export const GateTypeIcon: React.FC<{ type: GateType; className?: string }> = ({
  type,
  className,
}) => {
  switch (type) {
    case 'gtAnd': {
      return <TbLogicAnd className={className} />;
    }
    case 'gtOr': {
      return <TbLogicOr className={className} />;
    }
    case 'gtNot': {
      return <TbLogicNot className={className} />;
    }
    default: {
      return <></>;
    }
  }
};
