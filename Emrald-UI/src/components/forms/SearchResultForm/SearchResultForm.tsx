import ItemTypeMenuResults from '../../layout/Header/SearchBar/ItemTypeMenuResults';
import { Diagram } from '../../../types/Diagram';
import { State } from '../../../types/State';
import { Action } from '../../../types/Action';
import { ExtSim } from '../../../types/ExtSim';
import { LogicNode } from '../../../types/LogicNode';
import { Variable } from '../../../types/Variable';
import { Event } from '../../../types/Event';
import { ReactNode } from 'react';

interface searchFormProps {
  diagrams: Diagram[];
  states: State[];
  actions: Action[];
  events: Event[];
  extSims: ExtSim[];
  logicNodes: LogicNode[];
  variables: Variable[];
  handleItemClick: (event: any, item: any) => void;
  getModel: (item: Diagram | State | Action | Event, direction: any) => ReactNode;
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
