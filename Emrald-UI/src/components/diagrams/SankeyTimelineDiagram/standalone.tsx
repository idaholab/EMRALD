/**
 * This file is for use with the "view results" button in the simulation engine.
 */
import ReactDOM from 'react-dom/client';
import { SankeyTimelineDiagram } from './SankeyTimelineDiagram';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <SankeyTimelineDiagram data={window.data} />,
);
