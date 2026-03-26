/**
 * This file is for use with the "view results" button in the simulation engine.
 */
import ReactDOM from 'react-dom/client';
import {
  SankeyTimelineDiagram,
  type TimelineOptions,
} from './SankeyTimelineDiagram';

declare global {
  interface Window {
    data: TimelineOptions;
  }
}

const root = document.querySelector('#root');
if (root) {
  ReactDOM.createRoot(root).render(
    <SankeyTimelineDiagram data={window.data} />,
  );
}
