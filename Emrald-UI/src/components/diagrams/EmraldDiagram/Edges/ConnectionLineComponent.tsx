import type { ConnectionLineComponentProps } from 'reactflow';

const CustomConnectionLine: React.FC<ConnectionLineComponentProps> = ({
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
  connectionStatus,
}) => {
  // Define default style for the connection line
  const defaultStyle: React.CSSProperties = {
    stroke: connectionStatus === 'valid' ? 'green' : 'red',
    strokeWidth: 2,
    ...connectionLineStyle,
  };

  // Render the SVG line
  return (
    <svg className="state-node__connection-svg">
      <line x1={fromX} y1={fromY} x2={toX} y2={toY} style={defaultStyle} />
    </svg>
  );
};

export default CustomConnectionLine;
