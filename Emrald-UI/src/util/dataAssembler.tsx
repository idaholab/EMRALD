import { useDiagramContext } from '../contexts/DiagramContext';
import { useLogicNodeContext } from '../contexts/LogicNodeContext';
import { useModelDetailsContext } from '../contexts/ModelDetailsContext';
// ... import other context hooks

export function assembleDataForDownload() {
  const { id, name, desc, version, updateVersion } = useModelDetailsContext();
  const { diagrams } = useDiagramContext();
  const { logicNodes } = useLogicNodeContext();
  // ... get data from other contexts

  updateVersion(Math.round((version + 0.1) * 10) / 10);

  const assembledData = {
    id,
    name,
    desc,
    version,
    DiagramList: diagrams,
    LogicNodeList: logicNodes,
    // ... add other sections
  };

  return assembledData;
}
