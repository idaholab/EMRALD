import React from 'react';
import { useReactFlow, getNodesBounds, getViewportForBounds, Node } from 'reactflow';
import { toPng } from 'html-to-image';
import { FaCamera } from 'react-icons/fa';
import { ControlButton } from 'reactflow';
import { currentDiagram } from './EmraldDiagram';

function downloadImage(dataUrl: string) {
  const a = document.createElement('a');
  a.setAttribute('download', `${currentDiagram.value.name}.png`);
  a.setAttribute('href', dataUrl);
  a.click();
}

const imageWidth = 1024;
const imageHeight = 768;

const DownloadButton: React.FC = () => {
  const { getNodes } = useReactFlow();

  const onClick = () => {
    const nodesBounds = getNodesBounds(getNodes() as Node[]);
    const viewport = getViewportForBounds(nodesBounds, imageWidth, imageHeight, 0.5, 2);

    const reactFlowViewport = document.querySelector('.react-flow__viewport') as HTMLElement;

    if (reactFlowViewport) {
      toPng(reactFlowViewport, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: String(imageWidth),
          height: String(imageHeight),
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
        },
      }).then(downloadImage).catch((error) => {
        console.error('Error generating image:', error);
      });
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