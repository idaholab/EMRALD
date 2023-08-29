import React, { PropsWithChildren } from 'react';
import DiagramContextProvider from './DiagramContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { WindowProvider } from './WindowContext';
import LogicNodeContextProvider from './LogicNodeContext';
import ModelDetailsContextProvider from './ModelDetailsContext';
import ActionContextProvider from './ActionContext';
import EventContextProvider from './EventContext';

const EmraldContextWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <DndProvider backend={HTML5Backend}>
      <WindowProvider>
        <ModelDetailsContextProvider>
          <DiagramContextProvider>
            <LogicNodeContextProvider>
              <ActionContextProvider>
                <EventContextProvider>{children}</EventContextProvider>
              </ActionContextProvider>
            </LogicNodeContextProvider>
          </DiagramContextProvider>
        </ModelDetailsContextProvider>
      </WindowProvider>
    </DndProvider>
  );
};

export default EmraldContextWrapper;
