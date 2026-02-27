import React from 'react';
import { useReactFlow, getNodesBounds, getViewportForBounds, type Node } from 'reactflow';
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

    const reactFlowViewport = document.querySelector('.react-flow__viewport');

    if (reactFlowViewport) {
      toPng(reactFlowViewport as HTMLElement, {
        backgroundColor: '#ffffff',
        width: imageWidth,
        height: imageHeight,
        style: {
          width: String(imageWidth),
          height: String(imageHeight),
          transform: `translate(${viewport.x.toString()}px, ${viewport.y.toString()}px) scale(${viewport.zoom.toString()})`,
        },
      })
        .then(downloadImage)
        .catch((error: unknown) => {
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
