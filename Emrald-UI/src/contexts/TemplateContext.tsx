import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { MainItemTypes } from '../types/ItemTypes';
import { updateModelAndReferences } from '../utils/UpdateModel';

interface TemplateContextType {
  templates: EMRALD_Model[];
  templatesList: ReadonlySignal<EMRALD_Model[]>;
  createTemplate: (Template: EMRALD_Model) => void;
  updateTemplate: (Template: EMRALD_Model) => void;
  deleteTemplate: (TemplateId: string | undefined) => void;
  // getTemplateByTemplateName: (TemplateName: string) => EMRALD_Model;
  // getTemplateByTemplateId: (TemplateId: string | null) => EMRALD_Model;
  newTemplateList: (newTemplateList: EMRALD_Model[]) => void;
  clearTemplateList: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function useTemplateContext() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error(
      'useTemplateContext must be used within an TemplateContextProvider',
    );
  }
  return context;
}

const TemplateContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [templates, setTemplates] = useState<EMRALD_Model[]>(appData.value.templates as EMRALD_Model[]);
  const templatesList = useComputed(() => appData.value.templates as EMRALD_Model[]);
  
  const createTemplate = async (newTemplate: EMRALD_Model) => {
    // var updatedModel: EMRALD_Model = await updateModelAndReferences(newTemplate, MainItemTypes.Template);
    // updateAppData(updatedModel);
    // setTemplates(updatedModel.templates as EMRALD_Model[]);
  };

  const updateTemplate = async (updatedTemplate: EMRALD_Model) => {
    // const updatedTemplateList = TemplatesList.value.map((item) =>
    //   item.id === updatedTemplate.id ? updatedTemplate : item,
    // );

    // var updatedModel : EMRALD_Model = await updateModelAndReferences(updatedTemplate, MainItemTypes.Template);
    // updateAppData(JSON.parse(JSON.stringify(updatedModel)));
    // setTemplates(updatedModel.TemplateList);
  };

  const deleteTemplate = (TemplateId: string | undefined) => {
    // if (!TemplateId) { return; }
    // const updatedTemplateList = TemplatesList.value.filter(
    //   (item) => item.id !== TemplateId,
    // );
    // setTemplates(updatedTemplateList);
  };

  // const getTemplateByTemplateId = (TemplateId: string | null) => {
  //   // return TemplatesList.value.find((Template) => Template.id === TemplateId) || emptyTemplate;
  // };
  // const getTemplateByTemplateName = (TemplateName: string) => {
  //   // return TemplatesList.value.find((Template) => Template.name === TemplateName) || emptyTemplate;
  // };

  // Open New, Merge, and Clear Diagram List
  const newTemplateList = (newTemplateList: EMRALD_Model[]) => {
    setTemplates(newTemplateList);
  };

  const clearTemplateList = () => {
    setTemplates([]);
  }

  return (
    <TemplateContext.Provider
      value={{
        templates,
        templatesList,
        createTemplate,
        updateTemplate,
        deleteTemplate,
        newTemplateList,
        clearTemplateList
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContextProvider;
