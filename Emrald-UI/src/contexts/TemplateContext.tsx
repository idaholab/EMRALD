import React, { createContext, useContext, useEffect, useState } from 'react';
import { EmraldContextWrapperProps } from './EmraldContextWrapper';
import { appData, updateAppData } from '../hooks/useAppData';
import { ReadonlySignal, useComputed, useSignal } from '@preact/signals-react';
import { EMRALD_Model } from '../types/EMRALD_Model';
import { Group, MainItemTypes } from '../types/ItemTypes';
import { updateModelAndReferences } from '../utils/UpdateModel';
import { v4 as uuidv4 } from 'uuid';

interface TemplateContextType {
  templates: EMRALD_Model[];
  temporaryTemplates: ReadonlySignal<EMRALD_Model[]>;
  groups: Group[];
  templatesList: ReadonlySignal<EMRALD_Model[]>;
  findGroupHierarchyByGroupName: (groups: Group[], groupName: string) => Group | undefined;
  findTemplatesByGroupName: (groupName: string) => EMRALD_Model[];
  setGroups: (groups: Group[]) => void;
  addTemplateToModel: (newTemplate: EMRALD_Model) => void;
  createTemplate: (template: EMRALD_Model) => void;
  deleteTemplate: (templateId: string) => void;
  newTemplateList: (newTemplateList: unknown[]) => void;
  mergeTemplateToList: (newTemplate: EMRALD_Model) => void;
  clearTemplateList: () => void;
}

const TemplateContext = createContext<TemplateContextType | undefined>(undefined);

export function useTemplateContext() {
  const context = useContext(TemplateContext);
  if (!context) {
    throw new Error('useTemplateContext must be used within an TemplateContextProvider');
  }
  return context;
}

const TemplateContextProvider: React.FC<EmraldContextWrapperProps> = ({ children }) => {
  const [templates, setTemplates] = useState<EMRALD_Model[]>(
    appData.value.templates ? JSON.parse(JSON.stringify(appData.value.templates.map((template) => ({ ...template, id: uuidv4() })))) : [],
  );
  
  const temporaryTemplates = useSignal<EMRALD_Model[]>(templates);
  const templatesList = useComputed(() => appData.value.templates || []);

  //combine the single path template groups into a one tree structure
  const hierarchicalGroups: Group[] = templates
    .filter((template) => template.group !== undefined) // Filter out templates with null groups
    .reduce((accumulatedGroups: Group[], template: EMRALD_Model) => {
      return combineGroups(accumulatedGroups, [template.group!]);
    }, [] as Group[]);

  const [groups, setGroups] = useState<Group[]>(convertNullSubgroupsToEmptyArray(hierarchicalGroups));

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
    const findGroupByName = (groups: Group[], name: string | null): Group | null => {
      const foundGroup = groups.find((group) => group.name === name);
      return foundGroup ? foundGroup : null;
    };

    // Add all groups from the first array
    for (const group1 of groups1) {
      const matchingGroup = findGroupByName(groups2, group1.name);
      if (matchingGroup) {
        combinedGroups.push({
          name: group1.name,
          subgroup: combineGroups(group1.subgroup || [], matchingGroup.subgroup || []),
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
    return groups.map((group) => ({
      ...group,
      subgroup: group.subgroup ? convertNullSubgroupsToEmptyArray(group.subgroup) : [],
    }));
  }

  // const groups = convertNullSubgroupsToEmptyArray(hierarchicalGroups);

  useEffect(() => {
    const storedTemplates = JSON.parse(localStorage.getItem('templates') || '[]');

    // Create a set of existing template IDs to avoid duplicates
    const storedTemplateIds = new Set(storedTemplates.map((template: EMRALD_Model) => template.name));

    // Filter out templates that are already in local storage
    const newTemplates = templates.filter((template) => !storedTemplateIds.has(template.name));

    if (newTemplates.length > 0) {
      localStorage.setItem('templates', JSON.stringify([...storedTemplates, ...newTemplates]));
      temporaryTemplates.value = [...storedTemplates, ...newTemplates];
    }

    // Update the groups if templates are added or imported. Make sure to include groups from session storage.
    const groupsFromTemplates = convertNullSubgroupsToEmptyArray(hierarchicalGroups);
    const storedGroups: Group[] = JSON.parse(localStorage.getItem('templateGroups') || '[]');
    const storedGroupNames = new Set(storedGroups.map(group => group.name));
    
    const newGroups = groupsFromTemplates.filter(group => !storedGroupNames.has(group.name));
    const mergedGroups = [...storedGroups, ...newGroups];
    setGroups(mergedGroups);

  }, [templates]);

  // Load initial groups from local storage when the component mounts
  useEffect(() => {
    const storedGroups = JSON.parse(localStorage.getItem('templateGroups') || '[]');
    temporaryTemplates.value = JSON.parse(localStorage.getItem('templates') || '[]');
    setGroups(storedGroups);
  }, []);

  // Effect to store groups in local storage whenever groups state changes
  useEffect(() => {
    const storedGroups: Group[] = JSON.parse(localStorage.getItem('templateGroups') || '[]');
    const storedGroupNames = new Set(storedGroups.map(group => group.name));
    
    const newGroups = groups.filter(group => !storedGroupNames.has(group.name));
    const mergedGroups = [...storedGroups, ...newGroups];

    localStorage.setItem('templateGroups', JSON.stringify(mergedGroups));
  }, [groups]);

  const addTemplateToModel = async (newTemplate: EMRALD_Model) => {
    if (!newTemplate) { return; }
    var updatedModel: EMRALD_Model = await updateModelAndReferences(
      newTemplate,
      MainItemTypes.Template,
    );
    updateAppData(updatedModel);
  };

  const createTemplate = async (newTemplate: EMRALD_Model) => {
    temporaryTemplates.value = [...temporaryTemplates.value, newTemplate];
    localStorage.setItem('templates', JSON.stringify(temporaryTemplates.value));
    setTemplates(temporaryTemplates.value as EMRALD_Model[]);
  };

  const deleteTemplate = (templateId: string) => {
    if (!templateId) {
      return;
    }
    const updatedTemplateList = templatesList.value.filter((item) => item.id !== templateId);
    updateAppData({
      ...appData.value,
      templates: updatedTemplateList,
    });
    setTemplates(updatedTemplateList);
  };

  const findGroupHierarchyByGroupName = (groups: Group[], groupName: string): Group | undefined => {
    for (const group of groups) {
      if (group.name === groupName) {
        group.subgroup = [];
        return group;
      }
      if (group.subgroup && group.subgroup.length > 0) {
        const foundGroup = findGroupHierarchyByGroupName(group.subgroup, groupName);
        if (foundGroup) {
          return {
            name: group.name,
            subgroup: [foundGroup],
          };
        }
      }
    }
    return;
  }

  const findTemplatesByGroupName = (groupName: string): EMRALD_Model[] => {
    const result: EMRALD_Model[] = [];
  
    const searchGroup = (groups: Group[], groupName: string): boolean => {
      for (const group of groups) {
        if (group.name === groupName && (!group.subgroup || group.subgroup.length === 0)) {
          return true;
        }
        if (group.subgroup && group.subgroup.length > 0) {
          if (searchGroup(group.subgroup, groupName)) {
            return true;
          }
        }
      }
      return false;
    };
  
    for (const template of temporaryTemplates.value) {
      if (template.group && searchGroup([template.group], groupName)) {
        result.push(template);
      }
      if (template.group === undefined && groupName === '') {
        result.push(template);
      }
    }
    return result;
  };

  // Open New, Merge, and Clear Diagram List
  /**
   * Merge a new list of templates into the temporaryTemplates list.
   * 
   * @param newTemplateList - The new list of templates to merge into temporaryTemplates.
   */
  const newTemplateList = (newTemplateList: any[]): void => {
    // Spread the current and new templates into a new array
    temporaryTemplates.value = [...temporaryTemplates.value, ...newTemplateList];
    // Update the state with the new merged list of templates
    setTemplates(temporaryTemplates.value);
  };

  /**
   * Merge the new template into the temporaryTemplates list.
   * Update the groups list with the new template's group structure.
   * Save the updated temporaryTemplates to localStorage.
   * 
   * @param newTemplate - The new template to merge into temporaryTemplates.
   */
  const mergeTemplateToList = (newTemplate: EMRALD_Model) => {
    // Check if the new template already exists in the temporaryTemplates
    const templateExists = temporaryTemplates.value.some(template => template.name === newTemplate.name);

    if (!templateExists) {
    // Add the new template to temporaryTemplates
    temporaryTemplates.value = [...temporaryTemplates.value, newTemplate];

    // Get the hierarchicalGroups of the new template
    // by combining all the groups in temporaryTemplates
    const hierarchicalGroups: Group[] = temporaryTemplates.value
    .filter((template) => template.group !== undefined) // Filter out templates with null groups
    .reduce((accumulatedGroups: Group[], template: EMRALD_Model) => {
      return combineGroups(accumulatedGroups, [template.group!]);
    }, [] as Group[]);

    // Update the groups list with the new template's group structure
    setGroups(convertNullSubgroupsToEmptyArray(hierarchicalGroups));

    // Save the updated temporaryTemplates to localStorage
    localStorage.setItem('templates', JSON.stringify(temporaryTemplates.value));
    }
  };

  const clearTemplateList = () => {
    localStorage.removeItem('templates');
    appData.value.templates = [];
    temporaryTemplates.value = [];
    setTemplates([]);
  };

  return (
    <TemplateContext.Provider
      value={{
        templates,
        temporaryTemplates,
        groups,
        templatesList,
        findGroupHierarchyByGroupName,
        findTemplatesByGroupName,
        setGroups,
        addTemplateToModel,
        createTemplate,
        deleteTemplate,
        newTemplateList,
        mergeTemplateToList,
        clearTemplateList,
      }}
    >
      {children}
    </TemplateContext.Provider>
  );
};

export default TemplateContextProvider;
