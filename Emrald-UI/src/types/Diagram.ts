export interface Diagram {
  id: number | string;
  name: string;
  desc: string;
  diagramType: string;
  states?: string[];
  diagramLabel?: string;
}

export interface DiagramListItem {
  Diagram: Diagram;
}

export interface DiagramList extends Array<DiagramListItem> {}
