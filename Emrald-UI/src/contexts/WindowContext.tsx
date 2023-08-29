import React, { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Window {
  id: string;
  title: string;
  isOpen: boolean;
  minimized: boolean;
  maximized: boolean;
  content: React.ReactNode;
}

interface WindowContextType {
  windows: Window[];
  addWindow: (title: string, content: React.ReactNode) => void;
  bringToFront: (window: Window) => void;
  handleClose: (id?: string) => void;
  toggleMaximize: (windowToToggle: Window) => void;
  toggleMinimize: (windowToToggle: Window) => void;
}

// Create a context for window management
const WindowContext = createContext<WindowContextType | undefined>(undefined);

// Custom hook to access the window context
export const useWindowContext = (): WindowContextType => {
  const context = useContext(WindowContext);
  if (!context) {
    throw new Error('useWindowContext must be used within a WindowProvider');
  }
  return context;
};

// Props interface for the WindowProvider component
interface WindowProviderProps {
  children: ReactNode;
}

// Provider component to manage windows
export const WindowProvider: React.FC<WindowProviderProps> = ({ children }) => {
  const [windows, setWindows] = useState<Window[]>([]);
  const [nextWindowId, setNextWindowId] = useState<number>(1);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // Bring a window to the front
  const bringToFront = (selectedWindow: Window) => {
    const windowIndex = windows.findIndex(
      (window) => window.id === selectedWindow.id,
    );
    if (windowIndex !== -1) {
      const updatedWindows = [...windows];
      updatedWindows.splice(windowIndex, 1);
      updatedWindows.push(selectedWindow);
      setWindows(updatedWindows);
      setActiveWindowId(selectedWindow.id);
    }
  };

  const handleClose = (id?: string) => {
    const windowIdToClose = id || activeWindowId; // Use activeWindowId if id is not provided
    if (windowIdToClose) {
      const filteredWindows = windows.filter((window) => window.id !== windowIdToClose);
      setWindows(filteredWindows);
      if (activeWindowId === windowIdToClose) {
        setActiveWindowId(null); // Reset activeWindowId if the closed window was active
      }
    }
  };

  const addWindow = (title: string, content: React.ReactNode): void => {
    const existingWindow = windows.find((window) => window.title === title);

    if (existingWindow) {
      // If a window with the same name exists, bring it to the front
      bringToFront(existingWindow);
      return;
    }

    const newWindow: Window = {
      id: uuidv4(),
      title,
      isOpen: true,
      minimized: false,
      maximized: false,
      content,
    };
  
    setWindows([...windows, newWindow]);
    setActiveWindowId(newWindow.id); // Set the active window ID to the newly added window
    setNextWindowId(nextWindowId + 1);
  };

  const toggleMaximize = (windowToToggle: Window) => {
    const updatedWindows = windows.map((window) =>
      window.id === windowToToggle.id
        ? { ...window, maximized: !window.maximized, minimized: false }
        : window,
    );
    setWindows(updatedWindows);
  };

  const toggleMinimize = (windowToToggle: Window) => {
    const updatedWindows = windows.map((window) =>
      window.id === windowToToggle.id
        ? { ...window, minimized: !window.minimized, maximized: false }
        : window,
    );
    setWindows(updatedWindows);
  };

  // Context value to be provided
  const contextValue: WindowContextType = {
    windows,
    addWindow,
    bringToFront,
    handleClose,
    toggleMaximize,
    toggleMinimize,
  };

  // Provide the context to the children
  return (
    <WindowContext.Provider value={contextValue}>
      {children}
    </WindowContext.Provider>
  );
};
