import { describe, expect, test } from 'vitest';
import { getDiagram, render } from '../../../test-utils';
import ImportForm from '../../../../components/forms/ImportForm/ImportForm';
import userEvent from '@testing-library/user-event';
import fs from 'fs/promises';
import path from 'path';
import { act, screen } from '@testing-library/react';
import expected from './ImportForm.expected.json';
import { updateAppData } from '../../../../hooks/useAppData';
import type { EMRALD_Model } from '../../../../types/EMRALD_Model';
import emraldModel from '../../../../emraldData.json';

const C_CKV_A = JSON.parse((await fs.readFile(path.join(__dirname, 'C-CKV-A.json'))).toString()) as EMRALD_Model;

describe('Import Form', () => {
  test('imports diagram', async () => {
    const name = 'imports diagram';
    render(<ImportForm importedData={C_CKV_A}></ImportForm>);
    const user = userEvent.setup();

    act(() => {
      updateAppData(emraldModel);
    });

    expect(screen.queryAllByText('CONFLICTS').length).toBe(4);

    // Change names to resolve conflicts by appending "2" to all the names
    await user.type((await screen.findAllByLabelText('New Name'))[0], '2');
    await user.type((await screen.findAllByLabelText('New Name'))[1], '2');
    await user.type((await screen.findAllByLabelText('New Name'))[2], '2');
    await user.type((await screen.findAllByLabelText('New Name'))[3], '2');
    expect(screen.queryAllByText('CONFLICTS').length).toBe(0);

    await user.click(await screen.findByText('Create'));
    expect(getDiagram('C-CKV-A2')).toEqual(expected[name]);
  });

  test('ignores conflicts', async () => {
    const name = 'ignores conflicts';
    render(<ImportForm importedData={C_CKV_A}></ImportForm>);
    const user = userEvent.setup();

    act(() => {
      updateAppData(emraldModel);
    });

    expect(screen.queryAllByText('CONFLICTS').length).toBe(4);

    // Ignore all unlocked conflicts
    await user.click(await screen.findByText("Ignore Unlocked"));
    expect(screen.queryAllByText('CONFLICTS').length).toBe(3);

    // Enter new names for the other three conflicts
    await user.type((await screen.findAllByLabelText('New Name'))[1], '3');
    await user.type((await screen.findAllByLabelText('New Name'))[2], '3');
    await user.type((await screen.findAllByLabelText('New Name'))[3], '3');
    expect(screen.queryAllByText('CONFLICTS').length).toBe(0);

    await user.click(await screen.findByText('Create'));
    console.log(getDiagram('C-CKV-A'));
    expect(getDiagram('C-CKV-A')).toEqual(expected[name]);
  });
});
