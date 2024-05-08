import { FaPlus } from 'react-icons/fa6';
import { FiMinus } from 'react-icons/fi';

interface ExpandedIconProps {
  expanded: boolean;
  className?: string;
}
const ExpandedIcon: React.FC<ExpandedIconProps> = ({
  expanded,
  className,
}) => {

  switch (expanded) {
    case true:
      return <FiMinus className={className} />;
    case false:
      return <FaPlus className={className} />;
    default:
      return <></>;
  }
};

export default ExpandedIcon;
