import { TbReplaceFilled, TbChartHistogram } from 'react-icons/tb';
import { GiPerspectiveDiceSixFacesOne } from 'react-icons/gi';
import { PiTimer, PiArrowsMergeBold, PiArrowSquareDownLeft } from 'react-icons/pi';
import { HiOutlineVariable } from 'react-icons/hi';
import { EventType } from '../../../../types/EMRALD_Model';

const EventTypeIcon = ({ type }: { type: EventType }) => {
  switch (type) {
    case 'etStateCng':
      return <TbReplaceFilled style={{ width: '15px', height: '15px' }} />;
    case 'etComponentLogic':
      return (
        <PiArrowsMergeBold style={{ width: '15px', height: '15px', transform: 'rotate(270deg)' }} />
      );
    case 'etFailRate':
      return <GiPerspectiveDiceSixFacesOne style={{ width: '15px', height: '15px' }} />;
    case 'etTimer':
      return <PiTimer style={{ width: '15px', height: '15px' }} />;
    case 'et3dSimEv':
      return <PiArrowSquareDownLeft style={{ width: '15px', height: '15px' }} />;
    case 'etDistribution':
      return <TbChartHistogram style={{ width: '15px', height: '15px' }} />;
    case 'etVarCond':
      return <HiOutlineVariable style={{ width: '15px', height: '15px' }} />;
    default:
      return <></>;
  }
};

export default EventTypeIcon;
