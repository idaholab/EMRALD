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
  
  const templateGroups = templates
  .map((template) => template?.group)
  .filter((group) => group !== null) as Group[];

function buildHierarchy(groups: Group[]): Group[] {
  const groupMap = new Map<string, Group>();
  console.log(groupMap);

  function addGroup(name: string, subgroup: Group | Group[] | null) {
    if (!groupMap.has(name)) {
      groupMap.set(name, { name, subgroup: [] });
    }
    const group = groupMap.get(name)!;
    
    if (Array.isArray(subgroup)) {
      subgroup.forEach(sub => addGroup(sub.name, sub.subgroup));
    } else if (subgroup) {
      addGroup(subgroup.name, subgroup.subgroup);
    }

    if (subgroup) {
      const subgroupsToAdd = Array.isArray(subgroup) ? subgroup : [subgroup];
      subgroupsToAdd.forEach(sub => {
        if (!group.subgroup!.some(sg => sg.name === sub.name)) {
          group.subgroup!.push(sub);
        }
      });
    }
  }

  groups.forEach(group => addGroup(group.name, group.subgroup));

  // Filtering out non-top-level groups
  const topLevelGroups = Array.from(groupMap.values()).filter(group => 
    !Array.from(groupMap.values()).some(g => g.subgroup!.some(sg => sg.name === group.name))
  );

  return topLevelGroups;
}

/**
 * Merges two arrays of groups into one. If a group with the same name exists in both arrays,
 * their subgroups will be merged recursively.
 * 
 * @param groups1 - The first array of groups to merge.
 * @param groups2 - The second array of groups to merge.
 * @returns The merged array of groups.
 */
function mergeGroupArrays(groups1: Group[], groups2: Group[]): Group[] {
  // Create a map to easily access groups by name
  const groupMap: { [key: string]: Group } = {};

  // Helper function to merge subgroups
  const mergeSubgroups = (subgroup1: Group[], subgroup2: Group[]): Group[] => {
    const subgroupMap: { [key: string]: Group } = {};

    // Add all subgroups from the first array to the map
    for (const sub of subgroup1) {
      subgroupMap[sub.name] = { ...sub };
    }

    // Merge or add subgroups from the second array
    for (const sub of subgroup2) {
      if (subgroupMap[sub.name]) {
        // If a subgroup with the same name exists, merge them recursively
        subgroupMap[sub.name] = mergeGroups(subgroupMap[sub.name], sub);
      } else {
        // If it doesn't exist, just add it
        subgroupMap[sub.name] = { ...sub };
      }
    }

    // Convert the map back to an array
    return Object.values(subgroupMap);
  };

  // Add all groups from the first array to the map
  for (const group of groups1) {
    groupMap[group.name] = { ...group };
  }

  // Merge or add groups from the second array
  for (const group of groups2) {
    if (groupMap[group.name]) {
      // If a group with the same name exists, merge them recursively
      groupMap[group.name] = {
        name: group.name,
        subgroup: mergeSubgroups(groupMap[group.name].subgroup, group.subgroup),
      };
    } else {
      // If it doesn't exist, just add it
      groupMap[group.name] = { ...group };
    }
  }

  // Convert the map back to an array
  return Object.values(groupMap);
}

function convertNullSubgroupsToEmptyArray(groups: Group[]): Group[] {
  return groups.map(group => ({
    ...group,
    subgroup: group.subgroup ? convertNullSubgroupsToEmptyArray(group.subgroup) : []
  }));
}

const hierarchicalGroups = buildHierarchy(templateGroups);
const groups = convertNullSubgroupsToEmptyArray(hierarchicalGroups);
// const groups = [];

useEffect(() => {
  const storedTemplates = JSON.parse(localStorage.getItem('templates') || '[]');
  localStorage.setItem('templates', JSON.stringify([...templates, ...storedTemplates]));

  console.log(templateGroups);
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