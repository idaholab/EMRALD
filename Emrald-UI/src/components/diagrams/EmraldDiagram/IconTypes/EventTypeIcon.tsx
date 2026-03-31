import type { EventType } from '../../../../types/EMRALD_Model';
import { GiPerspectiveDiceSixFacesOne } from 'react-icons/gi';
import { HiOutlineVariable } from 'react-icons/hi';
import {
  PiArrowsMergeBold,
  PiArrowSquareDownLeft,
  PiTimer,
} from 'react-icons/pi';
import { TbChartHistogram, TbReplaceFilled } from 'react-icons/tb';

export const EventTypeIcon: React.FC<{ type: EventType }> = ({ type }) => {
  switch (type) {
    case 'etStateCng': {
      return <TbReplaceFilled style={{ width: '15px', height: '15px' }} />;
    }
    case 'etComponentLogic': {
      return (
        <PiArrowsMergeBold
          style={{ width: '15px', height: '15px', transform: 'rotate(270deg)' }}
        />
      );
    }
    case 'etFailRate': {
      return (
        <GiPerspectiveDiceSixFacesOne
          style={{ width: '15px', height: '15px' }}
        />
      );
    }
    case 'etTimer': {
      return <PiTimer style={{ width: '15px', height: '15px' }} />;
    }
    case 'et3dSimEv': {
      return (
        <PiArrowSquareDownLeft style={{ width: '15px', height: '15px' }} />
      );
    }
    case 'etDistribution': {
      return <TbChartHistogram style={{ width: '15px', height: '15px' }} />;
    }
    case 'etVarCond': {
      return <HiOutlineVariable style={{ width: '15px', height: '15px' }} />;
    }
    default: {
      return <></>;
    }
  }
};
