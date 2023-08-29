export interface DraggableContainerProps {
  id: string;
  initialPosition: { x: number; y: number; width: number; height: number };
  fullScreen: boolean;
  children: React.ReactNode;
}
