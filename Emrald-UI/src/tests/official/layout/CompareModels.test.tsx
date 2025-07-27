import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from '../../../App';
import userEvent from '@testing-library/user-event';
import type { EMRALD_Model } from '../../../types/EMRALD_Model';

describe('Compare Models', () => {
  test('compares models', async () => {
    render(<App></App>);
    const user = userEvent.setup();

    // Open a model to compare
    const compareModel: EMRALD_Model = {
      objType: 'EMRALD_Model',
      name: 'Compare Model',
      desc: 'Model to compare to',
      emraldVersion: 3.0,
      versionHistory: [],
      version: 4,
      DiagramList: [
        {
          objType: 'Diagram',
          name: 'C-CKV-C',
          desc: 'CKV C',
          diagramType: 'dtSingle',
          diagramLabel: '',
          states: [],
        },
        {
          objType: 'Diagram',
          name: 'C-MOV-1',
          desc: 'Different Description',
          diagramType: 'dtMulti',
          diagramLabel: '',
          states: ['C-MOV-1_Active', 'Different State 2'],
          diagramTemplate: 'Test',
        },
      ],
      ExtSimList: [],
      StateList: [],
      ActionList: [
        {
          name: '_Goto_ECS_Sys_Failed',
          desc: '',
          actType: 'atTransition',
          mainItem: false,
          mutExcl: true,
          newStates: [
            {
              toState: 'Different State',
              prob: 100,
              failDesc: '',
            },
          ],
          objType: 'Action',
        },
      ],
      EventList: [],
      LogicNodeList: [],
      VariableList: [],
    };
    await user.click(await screen.findByText('Project'));
    await user.click(await screen.findByText('Compare'));
    await user.upload(
      await screen.findByLabelText('Upload Model To Compare'),
      new File([JSON.stringify(compareModel)], 'Compare.emrald', { type: 'text' }),
    );

    // Process the table HTML in to an object for assertions
    const differences: Record<string, string[]> = {};
    let x = 1;
    for (const row of (await screen.findByRole('table')).children[1].children) {
      const [property, current, compare] = Array.from(row.children).map((e) => e.innerHTML);
      if (Object.prototype.hasOwnProperty.call(differences, property)) {
        differences[`${property}-${x.toString()}`] = [current, compare];
        x += 1;
      } else {
        differences[property] = [current, compare];
      }
    }

    expect(differences).toStrictEqual({
      'EMRALD Version': ['3.1', '3'],
      'Project Name': ['(Empty)', 'Compare Model'],
      'Project Description': ['(Empty)', 'Model to compare to'],
      'Project Version': ['1', '4'],
      Diagram: ['Does not exist', 'C-CKV-C'],
      'Diagram-1': ['C-CKV-A', 'Does not exist'],
      'Diagram-2': ['C-CKV-B', 'Does not exist'],
      'Diagram-3': ['C-MOV-A', 'Does not exist'],
      'Diagram-4': ['C-MOV-B', 'Does not exist'],
      'Diagram-5': ['C-PMP-A', 'Does not exist'],
      'Diagram-6': ['C-PMP-B', 'Does not exist'],
      'Diagram-7': ['CCS_Sys', 'Does not exist'],
      'Diagram-8': ['E-CKV-A', 'Does not exist'],
      'Diagram-9': ['E-CKV-B', 'Does not exist'],
      'Diagram-10': ['E-MOV-1', 'Does not exist'],
      'Diagram-11': ['E-MOV-A', 'Does not exist'],
      'Diagram-12': ['E-MOV-B', 'Does not exist'],
      'Diagram-13': ['E-PMP-A', 'Does not exist'],
      'Diagram-14': ['E-PMP-B', 'Does not exist'],
      'Diagram-15': ['ECS_Sys', 'Does not exist'],
      'Diagram-16': ['S-DGN-A', 'Does not exist'],
      'Diagram-17': ['S-DGN-B', 'Does not exist'],
      'Diagram-18': ['S-TNK-T1', 'Does not exist'],
      'Diagram-19': ['Test Diagram', 'Does not exist'],
      'C-MOV-1 Desc': ['(Empty)', 'Different Description'],
      'C-MOV-1 DiagramLabel': ['Component', '(Empty)'],
      'C-MOV-1 DiagramType': ['dtSingle', 'dtMulti'],
      'C-MOV-1 States': [
        'C-MOV-1_Active, C-MOV-1_Failed, C-MOV-1_Standby',
        'C-MOV-1_Active, Different State 2',
      ],
      'C-MOV-1 DiagramTemplate': ['Does not exist', 'Test'],
      'C-MOV-1 Required': ['false', 'Does not exist'],
      Action: ['_Goto_CCS_Sys_Active', 'Does not exist'],
      'Action-20': ['_Goto_CCS_Sys_Failed', 'Does not exist'],
      'Action-21': ['_Goto_ECS_Sys_Active', 'Does not exist'],
      'Action-22': ['Goto_C-CKV-A_ActOrFail', 'Does not exist'],
      'Action-23': ['Goto_C-CKV-A_Off', 'Does not exist'],
      'Action-24': ['Goto_C-CKV-B_ActOrFail', 'Does not exist'],
      'Action-25': ['Goto_C-CKV-B_Off', 'Does not exist'],
      'Action-26': ['Goto_C-MOV-1_ActOrFail', 'Does not exist'],
      'Action-27': ['Goto_C-MOV-1_Off', 'Does not exist'],
      'Action-28': ['Goto_C-MOV-A_ActOrFail', 'Does not exist'],
      'Action-29': ['Goto_C-MOV-A_Off', 'Does not exist'],
      'Action-30': ['Goto_C-MOV-B_ActOrFail', 'Does not exist'],
      'Action-31': ['Goto_C-MOV-B_Off', 'Does not exist'],
      'Action-32': ['Goto_C-PMP-A_ActOrFail', 'Does not exist'],
      'Action-33': ['Goto_C-PMP-A_Failed', 'Does not exist'],
      'Action-34': ['Goto_C-PMP-A_Off', 'Does not exist'],
      'Action-35': ['Goto_C-PMP-B_ActOrFail', 'Does not exist'],
      'Action-36': ['Goto_C-PMP-B_Failed', 'Does not exist'],
      'Action-37': ['Goto_C-PMP-B_Off', 'Does not exist'],
      'Action-38': ['Goto_E-CKV-A_ActOrFail', 'Does not exist'],
      'Action-39': ['Goto_E-CKV-A_Off', 'Does not exist'],
      'Action-40': ['Goto_E-CKV-B_ActOrFail', 'Does not exist'],
      'Action-41': ['Goto_E-CKV-B_Off', 'Does not exist'],
      'Action-42': ['Goto_E-MOV-1_ActOrFail', 'Does not exist'],
      'Action-43': ['Goto_E-MOV-1_Off', 'Does not exist'],
      'Action-44': ['Goto_E-MOV-A_ActOrFail', 'Does not exist'],
      'Action-45': ['Goto_E-MOV-A_Off', 'Does not exist'],
      'Action-46': ['Goto_E-MOV-B_ActOrFail', 'Does not exist'],
      'Action-47': ['Goto_E-MOV-B_Off', 'Does not exist'],
      'Action-48': ['Goto_E-PMP-A_ActOrFail', 'Does not exist'],
      'Action-49': ['Goto_E-PMP-A_Failed', 'Does not exist'],
      'Action-50': ['Goto_E-PMP-A_Off', 'Does not exist'],
      'Action-51': ['Goto_E-PMP-B_ActOrFail', 'Does not exist'],
      'Action-52': ['Goto_E-PMP-B_Failed', 'Does not exist'],
      'Action-53': ['Goto_E-PMP-B_Off', 'Does not exist'],
      'Action-54': ['Goto_Large_Release', 'Does not exist'],
      'Action-55': ['Goto_LOSP', 'Does not exist'],
      'Action-56': ['Goto_Mission_Time_Up', 'Does not exist'],
      'Action-57': ['Goto_Normal_Operations', 'Does not exist'],
      'Action-58': ['Goto_S-DGN-A_ActOrFail', 'Does not exist'],
      'Action-59': ['Goto_S-DGN-A_Failed', 'Does not exist'],
      'Action-60': ['Goto_S-DGN-A_Off', 'Does not exist'],
      'Action-61': ['Goto_S-DGN-B_ActOrFail', 'Does not exist'],
      'Action-62': ['Goto_S-DGN-B_Failed', 'Does not exist'],
      'Action-63': ['Goto_S-DGN-B_Off', 'Does not exist'],
      'Action-64': ['Goto_S-TNK-T1_Active', 'Does not exist'],
      'Action-65': ['Goto_S-TNK-T1_Failed', 'Does not exist'],
      'Action-66': ['Goto_S-TNK-T1_Off', 'Does not exist'],
      'Action-67': ['Goto_Small_Release', 'Does not exist'],
      'Action-68': ['Goto_StartSystems', 'Does not exist'],
      'Action-69': ['Goto_StopSystems', 'Does not exist'],
      'Action-70': ['Goto_Terminate', 'Does not exist'],
      '_Goto_ECS_Sys_Failed NewStates[0] Prob': ['-1', '100'],
      '_Goto_ECS_Sys_Failed NewStates[0] ToState': ['ECS_Sys_Failed', 'Different State'],
    });
  });
});
