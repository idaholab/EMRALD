import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { Group, MainItemTypes } from '../types/ItemTypes';
import { updateModelAndReferences } from '../utils/UpdateModel';

interface TemplateContextType {
  templates: any[];
  groups: Group[];
  templatesList: ReadonlySignal<any[]>;
  createTemplate: (Template: any) => void;
  updateTemplate: (Template: any) => void;
  deleteTemplate: (TemplateId: string | undefined) => void;
  // getTemplateByTemplateName: (TemplateName: string) => EMRALD_Model;
  // getTemplateByTemplateId: (TemplateId: string | null) => EMRALD_Model;
  newTemplateList: (newTemplateList: unknown[]) => void;
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
  const [templates, setTemplates] = useState<any[]>(
    appData.value.templates
      ? JSON.parse(JSON.stringify(appData.value.templates))
      : []
  );
  const templatesList = useComputed(() => appData.value.templates || []);
  
  //combine the single path template groups into a one treestucture
  const hierarchicalGroups: Group[] = templates
  .filter(template => template.group !== undefined) // Filter out templates with null groups
  .reduce((accumulatedGroups, template) => {
    return combineGroups(accumulatedGroups, [template.group]);
  }, []);
  

/**
 * Merges two arrays of groups into one. If a group with the same name exists in both arrays,
 * their subgroups will be merged recursively.
 * 
 * @param groups1 - The first array of groups to merge.
 * @param groups2 - The second array of groups to merge.
 * @returns The merged array of groups.
 */
function combineGroups(groups1: Group[], groups2: Group[]): Group[] {
  const combinedGroups: Group[] = [];

  // Helper function to find a group by name
  const findGroupByName = (groups: Group[], name: string): Group | undefined => {
    return groups.find(group => group.name === name);
  };

  // Add all groups from the first array
  for (const group1 of groups1) {
    const matchingGroup = findGroupByName(groups2, group1.name);
    if (matchingGroup) {
      combinedGroups.push({
        name: group1.name,
        subgroup: combineGroups(group1.subgroup || [], matchingGroup.subgroup || [])
      });
    } else {
      combinedGroups.push(group1);
    }
  }

  // Add any remaining groups from the second array that were not in the first array
  for (const group2 of groups2) {
    if (!findGroupByName(combinedGroups, group2.name)) {
      combinedGroups.push(group2);
    }
  }

  return combinedGroups;
}

function convertNullSubgroupsToEmptyArray(groups: Group[]): Group[] {
  return groups.map(group => ({
    ...group,
    subgroup: group.subgroup ? convertNullSubgroupsToEmptyArray(group.subgroup) : []
  }));
}


//const hierarchicalGroups = buildHierarchy(templateGroups);
const groups = convertNullSubgroupsToEmptyArray(hierarchicalGroups);
// const groups = [];

useEffect(() => {
  const storedTemplates = JSON.parse(localStorage.getItem('templates') || '[]');
  localStorage.setItem('templates', JSON.stringify([...templates, ...storedTemplates]));

  console.log(hierarchicalGroups);
  console.log(groups);
}, [templates]);
  
  const createTemplate = async (newTemplate: any) => {
    // var updatedModel: EMRALD_Model = await updateModelAndReferences(newTemplate, MainItemTypes.Template);
    // updateAppData(updatedModel);
    // setTemplates(updatedModel.templates as EMRALD_Model[]);
  };

  const updateTemplate = async (updatedTemplate: any) => {
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
  const newTemplateList = (newTemplateList: any[]) => {
    setTemplates(newTemplateList);
  };

  const clearTemplateList = () => {
    setTemplates([]);
  }

  return (
    <TemplateContext.Provider
      value={{
        templates,
        groups,
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




[
  {
      "name": "Group 1",
      "subgroup": [
          {
              "name": "Group 1.1",
              "subgroup": [
                {
                  name: "Group 1.1.1",
                  subgroup: []
                }
              ]
          },
          {
              "name": "Group 1.2",
              "subgroup": []
          }
      ]
  },
  {
      "name": "Group 2",
      "subgroup": [
          {
              "name": "Group 2.1",
              "subgroup": []
          },
          {
            "name": "Group 2.2",
            "subgroup": []
        }
      ]
  }
]