/**
 * This file is for use with the "view results" button in the simulation engine.
 */
import ReactDOM from 'react-dom/client';
import { SankeyTimelineDiagram, TimelineOptions } from './SankeyTimelineDiagram';

declare global {
  interface Window {
    data: TimelineOptions
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SankeyTimelineDiagram data={window.data} />,
);
