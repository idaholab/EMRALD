import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import App from '../../../App';
import userEvent from '@testing-library/user-event';
import { appData } from '../../../hooks/useAppData';
import { ensureState, ensureVariable } from '../../test-utils';
import type { EMRALD_Model } from '../../../types/EMRALD_Model';

describe('Compare Models', () => {
  test('compares models', async () => {
    const name = 'compares models';
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
      ActionList: [],
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
    });
  });
});
