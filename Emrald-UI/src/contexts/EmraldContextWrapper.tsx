import type { PropsWithChildren } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ActionContextProvider } from './ActionContext';
import { AlertProvider } from './AlertContext';
import { DiagramContextProvider } from './DiagramContext';
import { EventContextProvider } from './EventContext';
import { ExtSimContextProvider } from './ExtSimContext';
import { LogicNodeContextProvider } from './LogicNodeContext';
import { ModelDetailsContextProvider } from './ModelDetailsContext';
import { StateContextProvider } from './StateContext';
import { TemplateContextProvider } from './TemplateContext';
import { VariableContextProvider } from './VariableContext';
import { WindowProvider } from './WindowContext';

export const EmraldContextWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => (
  <DndProvider backend={HTML5Backend}>
    <WindowProvider>
      <AlertProvider>
        <ModelDetailsContextProvider>
          <DiagramContextProvider>
            <LogicNodeContextProvider>
              <ActionContextProvider>
                <EventContextProvider>
                  <StateContextProvider>
                    <VariableContextProvider>
                      <ExtSimContextProvider>
                        <TemplateContextProvider>
                          {children}
                        </TemplateContextProvider>
                      </ExtSimContextProvider>
                    </VariableContextProvider>
                  </StateContextProvider>
                </EventContextProvider>
              </ActionContextProvider>
            </LogicNodeContextProvider>
          </DiagramContextProvider>
        </ModelDetailsContextProvider>
      </AlertProvider>
    </WindowProvider>
  </DndProvider>
);
