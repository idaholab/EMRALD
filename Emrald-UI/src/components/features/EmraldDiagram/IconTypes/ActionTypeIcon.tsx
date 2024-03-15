import {
  TbArrowBarToRight,
} from 'react-icons/tb';
import {
  PiArrowSquareDownLeft,
} from 'react-icons/pi';
import { HiOutlineVariable } from 'react-icons/hi';
import { FaCog } from 'react-icons/fa';
import { ActionType } from '../../../../types/ItemTypes';

const ActionTypeIcon = ({ type }: { type: ActionType }) => {
  switch (type) {
    case 'atTransition':
      return <TbArrowBarToRight />;
    case 'atCngVarVal':
      return <HiOutlineVariable />;
    case 'at3DSimMsg':
      return (
        <PiArrowSquareDownLeft style={{ width: '15px', height: '15px' }} />
      );
    case 'atRunExtApp':
      return <FaCog />;
    default:
      return <></>;
  }
};

export default ActionTypeIcon;