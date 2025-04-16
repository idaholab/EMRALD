import React from 'react';
import { useReactFlow, getNodesBounds, getViewportForBounds, Node } from 'reactflow';
import { toPng } from 'html-to-image';
import { FaCamera } from 'react-icons/fa';
import { ControlButton } from 'reactflow';

function downloadImage(dataUrl: string, diagramName: string) {
  const a = document.createElement('a');
  a.setAttribute('download', `${diagramName}.png`);
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

interface DownloadButtonProps {
  diagramName: string;
}
const DownloadButton: React.FC<DownloadButtonProps> = ({ diagramName }) => {
  const { getNodes } = useReactFlow();

  const onClick = async () => {
    const nodesBounds = getNodesBounds(getNodes() as Node[]);
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);
    const reactFlowViewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (reactFlowViewport) {
      try {
        const dataUrl = await toPng(reactFlowViewport, {
          backgroundColor: '#ffffff',
          width: imageWidth,
          height: imageHeight,
          style: {
            width: String(imageWidth),
            height: String(imageHeight),
            transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          },
        });
        downloadImage(dataUrl, diagramName);
      } catch (error) {
        console.error('Error generating image:', error);
      }
    } else {
      console.error('React Flow viewport element not found');
    }
  };

  return (
    <ControlButton onClick={onClick}>
      <FaCamera />
    </ControlButton>
  );
};

export default DownloadButton;
