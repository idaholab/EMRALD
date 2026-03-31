import type { ActionType } from '../../../../types/EMRALD_Model';
import { FaCog } from 'react-icons/fa';
import { HiOutlineVariable } from 'react-icons/hi';
import { PiArrowSquareDownLeft } from 'react-icons/pi';
import { TbArrowBarToRight } from 'react-icons/tb';

export const ActionTypeIcon: React.FC<{ type: ActionType }> = ({ type }) => {
  switch (type) {
    case 'atTransition': {
      return <TbArrowBarToRight />;
    }
    case 'atCngVarVal': {
      return <HiOutlineVariable />;
    }
    case 'at3DSimMsg': {
      return (
        <PiArrowSquareDownLeft style={{ width: '15px', height: '15px' }} />
      );
    }
    case 'atRunExtApp': {
      return <FaCog />;
    }
    default: {
      return <></>;
    }
  }
};
