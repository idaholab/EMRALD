import { TbLogicAnd, TbLogicOr, TbLogicNot } from "react-icons/tb";
import { GateType } from "../../../../types/ItemTypes";

const GateTypeIcon = ({ type, className }: { type: GateType, className?: string }) => {
  switch (type) {
    case 'gtAnd':
      return <TbLogicAnd className={className}/>;
    case 'gtOr':
      return <TbLogicOr className={className}/>;
    case 'gtNot':
      return (
        <TbLogicNot className={className}/>
      );
    default:
      return <></>;
  }
};

export default GateTypeIcon;