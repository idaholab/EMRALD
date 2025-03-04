import { describe, expect, test } from 'vitest';
import { getDiagram, render, save } from '../../../test-utils';
import DiagramContextProvider from '../../../../contexts/DiagramContext';
import DiagramForm from '../../../../components/forms/DiagramForm/DiagramForm';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import expected from './DiagramForm.expected.json';

describe('Diagram Form', () => {
  test('creates a diagram', async () => {
    const name = 'creates a diagram';
    render(
      <DiagramContextProvider>
        <DiagramForm></DiagramForm>
      </DiagramContextProvider>,
    );
    const user = userEvent.setup();

    // Enter name and description
    await user.type(await screen.findByLabelText('Name'), name);
    await user.type(await screen.findByLabelText('Description'), 'Desc');

    // Select group label
    await user.click(await screen.findByLabelText('Diagram Group Label'));
    await user.click(await screen.findByRole('option', { name: 'Component' }));

    await save();
    expect(getDiagram(name)).toEqual(expected[name]);
  });

  test('edits existing diagram', async () => {
    const name = 'edits existing diagram';
    render(
      <DiagramContextProvider>
        <DiagramForm diagramData={{
          objType: "Diagram",
          name,
          desc: "",
          diagramType: "dtSingle",
          diagramLabel: "Component",
          states: [],
        }}></DiagramForm>
      </DiagramContextProvider>,
    );
    const user = userEvent.setup();

    // Enter new name
    await user.clear(await screen.findByLabelText("Name"));
    await user.type(await screen.findByLabelText('Name'), "edited diagram name");

    await save();
    expect(getDiagram('edited diagram name')).toEqual(expected[name]);
  });
});
