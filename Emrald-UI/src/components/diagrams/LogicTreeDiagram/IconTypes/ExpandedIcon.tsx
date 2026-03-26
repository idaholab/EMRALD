import { FaPlus } from 'react-icons/fa6';
import { FiMinus } from 'react-icons/fi';

interface ExpandedIconProps {
  expanded: boolean;
  className?: string;
}
export const ExpandedIcon: React.FC<ExpandedIconProps> = ({
  expanded,
  className,
}) =>
  expanded ? (
    <FiMinus className={className} />
  ) : (
    <FaPlus className={className} />
  );
