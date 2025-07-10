import ItemTypeMenuResults from '../../layout/Header/SearchBar/ItemTypeMenuResults';
import type {
  Diagram,
  State,
  Action,
  ExtSim,
  LogicNode,
  Variable,
  Event,
} from '../../../types/EMRALD_Model';
import type { ReactNode } from 'react';
import type { ModelItem } from '../../../types/ModelUtils';

interface searchFormProps {
  diagrams: Diagram[];
  states: State[];
  actions: Action[];
  events: Event[];
  extSims: ExtSim[];
  logicNodes: LogicNode[];
  variables: Variable[];
  handleItemClick: (event: React.MouseEvent, item: ModelItem) => void;
  getModel: (item: ModelItem, direction: string) => ReactNode;
}

const SearchResultForm: React.FC<React.PropsWithChildren<searchFormProps>> = ({
  diagrams,
  states,
  actions,
  events,
  extSims,
  logicNodes,
  variables,
  handleItemClick,
  getModel,
}) => {
  return (
    <>
      <ItemTypeMenuResults
        diagrams={diagrams}
        states={states}
        actions={actions}
        events={events}
        handleItemClick={handleItemClick}
        getModel={getModel}
        extSims={extSims}
        logicNodes={logicNodes}
        variables={variables}
      />
    </>
  );
};

export default SearchResultForm;
