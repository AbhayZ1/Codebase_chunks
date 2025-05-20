import React, { ReactNode, useState, useEffect } from 'react';

interface ResizableSplitPaneProps {
  left: ReactNode;
  right: ReactNode;
  initialLeftWidth?: number;
  minLeftWidth?: number;
  maxLeftWidth?: number;
  direction?: 'horizontal' | 'vertical';
}

const ResizableSplitPane: React.FC<ResizableSplitPaneProps> = ({
  left,
  right,
  initialLeftWidth = 250,
  minLeftWidth = 150,
  maxLeftWidth = 500,
  direction = 'horizontal',
}) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
  const [isResizing, setIsResizing] = useState(false);

  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  const stopResizing = () => {
    setIsResizing(false);
  };

  const resize = (e: MouseEvent) => {
    if (isResizing && direction === 'horizontal') {
      const newLeftWidth = e.clientX;
      if (newLeftWidth >= minLeftWidth && newLeftWidth <= maxLeftWidth) {
        setLeftWidth(newLeftWidth);
      }
    }
  };

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing]);

  return (
    <div className="flex h-full">
      <div className="h-full overflow-hidden" style={{ width: `${leftWidth}px` }}>
        {left}
      </div>
      <div
        className={`w-1 h-full bg-gray-300 hover:bg-primary-500 cursor-col-resize flex-shrink-0 ${
          isResizing ? 'bg-primary-500' : ''
        }`}
        onMouseDown={startResizing}
      />
      <div className="flex-1 h-full overflow-hidden">
        {right}
      </div>
    </div>
  );
};

export default ResizableSplitPane;