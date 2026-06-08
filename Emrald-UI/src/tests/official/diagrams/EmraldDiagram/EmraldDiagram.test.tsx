import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { App } from '@/App';
import { click, getState, rightClick } from '@/tests/test-utils';

describe('EmraldDiagram', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('saves diagram snapshot', async () => {
    render(<App></App>);
    const user = userEvent.setup();

    // Capture the anchor element at the moment .click() is called
    let capturedAnchor: HTMLAnchorElement | null = null;
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (
      this: HTMLAnchorElement,
    ) {
      // eslint-disable-next-line unicorn/no-this-assignment, @typescript-eslint/no-this-alias
      capturedAnchor = this;
    });

    // Open a diagram
    await click((await screen.findAllByText('Diagrams'))[0]);
    await click((await screen.findAllByText('Component'))[0]);
    await user.dblClick(await screen.findByText('C-CKV-A'));

    // Wait for the diagram to render
    await waitFor(async () => {
      expect(await screen.findByLabelText('Download Snapshot')).not.toBe(
        undefined,
      );
    });

    await user.click(await screen.findByLabelText('Download Snapshot'));

    // Assert the download was triggered with the correct file
    await waitFor(() => {
      expect(capturedAnchor).not.toBeNull();
      expect(capturedAnchor!.getAttribute('href')).toBe('mocked image');
      expect(capturedAnchor!.getAttribute('download')).toBe('C-CKV-A.png');
    });
  });

  test('creates a new state', async () => {
    render(<App></App>);
    const user = userEvent.setup();

    // Open a diagram
    await click((await screen.findAllByText('Diagrams'))[0]);
    await click((await screen.findAllByText('Component'))[0]);
    await user.dblClick(await screen.findByText('C-CKV-A'));

    // Right-click on the diagram background and click "New State"
    await rightClick(
      (await screen.findByTestId('rf__wrapper')).children[0]?.children[0],
    );
    await user.click(await screen.findByText('New State'));

    // Wait for the state properties form to render
    await waitFor(async () => {
      expect(await screen.findByText('Create State')).not.toBeUndefined();
    });

    // Enter a name & create the state
    await user.type(await screen.findByLabelText('Name'), 'StateFromDiagram');
    await click((await screen.findAllByText('Save'))[0]);

    expect(getState('StateFromDiagram')).not.toBeUndefined();
  });

  // Regression test: a state added to an already-open diagram must render on
  // the canvas without closing and reopening the window. Previously the
  // diagram built its nodes from a stale snapshot of the diagram's state list.
  test('renders a newly created state on the canvas without reopening', async () => {
    render(<App></App>);
    const user = userEvent.setup();

    // Open a diagram
    await click((await screen.findAllByText('Diagrams'))[0]);
    await click((await screen.findAllByText('Component'))[0]);
    await user.dblClick(await screen.findByText('C-CKV-A'));

    // Right-click on the diagram background and click "New State"
    await rightClick(
      (await screen.findByTestId('rf__wrapper')).children[0]?.children[0],
    );
    await user.click(await screen.findByText('New State'));

    await waitFor(async () => {
      expect(await screen.findByText('Create State')).not.toBeUndefined();
    });

    // Enter a name & create the state
    await user.type(await screen.findByLabelText('Name'), 'LiveRenderedState');
    await click((await screen.findAllByText('Save'))[0]);

    // The new state's node shows up in the canvas without reopening it.
    const canvas = await screen.findByTestId('rf__wrapper');
    await waitFor(async () => {
      expect(
        await within(canvas).findByText('LiveRenderedState'),
      ).toBeInTheDocument();
    });
  });
});
