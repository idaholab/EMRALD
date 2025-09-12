import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { EventEmitter } from 'ee-ts';
import React, { createContext, useContext, useState, type ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { WindowPosition } from '../types/EMRALD_Model';

type Window = {
  id: string;
  title: string;
  isOpen: boolean;
  initialPosition: WindowPosition;
  minimized: boolean;
  maximized: boolean;
  content: React.ReactNode;
};

class WindowResizeListener extends EventEmitter<{
  resize: (windowId: string, position: WindowPosition) => void;
}> {}

interface WindowContextType {
  windows: Window[];
  activeWindowId: string | null;
  addWindow: (
    title: string,
    content: React.ReactNode,
    position?: WindowPosition,
    windowId?: string | null,
    closePrevWindowId?: string,
  ) => void;
  updateTitle: (currentTitle: string, newTitle: string) => void;
  bringToFront: (window: Window) => void;
  handleClose: (id?: string) => void;
  getWindowTitleById: (id: string | null) => string | undefined;
  toggleMaximize: (windowToToggle: Window) => void;
  toggleMinimize: (windowToToggle: Window) => void;
  closeAllWindows: () => void;
  resizeListener: WindowResizeListener;
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
  const theme = useTheme();
  const isMediumScreen = useMediaQuery(theme.breakpoints.between('sm', 'lg'));
  const [windows, setWindows] = useState<Window[]>([]);
  const [nextWindowId, setNextWindowId] = useState<number>(1);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);

  // Bring a window to the front
  const bringToFront = (selectedWindow: Window) => {
    const windowIndex = windows.findIndex((window) => window.id === selectedWindow.id);
    if (windowIndex !== -1) {
      const updatedWindows = [...windows];
      updatedWindows.splice(windowIndex, 1);
      updatedWindows.push(selectedWindow);
      setWindows(updatedWindows);
      setActiveWindowId(selectedWindow.id);
    }
  };

  const handleClose = (id?: string) => {
    const windowIdToClose = id ?? activeWindowId; // Use activeWindowId if id is not provided
    if (windowIdToClose) {
      const filteredWindows = windows.filter((window) => window.id !== windowIdToClose);
      setWindows(filteredWindows);
      if (activeWindowId === windowIdToClose) {
        setActiveWindowId(null); // Reset activeWindowId if the closed window was active
      }
    }
  };

  const addWindow = (
    title: string,
    content: React.ReactNode,
    position?: WindowPosition,
    windowId?: string | null,
    closePrevWindowId?: string,
  ): void => {
    const existingWindow = windows.find(
      (window) => window.title === title || window.id === windowId,
    );

    if (existingWindow) {
      if (existingWindow.title !== title) {
        existingWindow.title = title;
      }
      // If a window with the same name exists, bring it to the front
      existingWindow.minimized = false; // Un-minimize window if existing window is minimized
      bringToFront(existingWindow);
      return;
    }

    console.log(position);
    const newWindow: Window = {
      id: uuidv4(),
      title,
      isOpen: true,
      initialPosition: position ?? {
        x: 100,
        y: 50,
        width: isMediumScreen ? 700 : 900,
        height: isMediumScreen ? 400 : 500,
      },
      minimized: false,
      maximized: false,
      content,
    };
    const updatedWindows = [...windows, newWindow];
    // Close the previous window if closePrevWindowId is provided
    if (closePrevWindowId) {
      setWindows(updatedWindows.filter((window) => window.id !== closePrevWindowId));
    } else {
      setWindows(updatedWindows);
    }
    setActiveWindowId(newWindow.id); // Set the active window ID to the newly added window
    setNextWindowId(nextWindowId + 1);
  };

  const getWindowTitleById = (id: string | null): string | undefined => {
    return windows.find((window) => window.id === id)?.title;
  };

  const updateTitle = (currentTitle: string, newTitle: string) => {
    const windowToUpdate = windows.find((window) => window.title === currentTitle);
    if (windowToUpdate) {
      addWindow(
        newTitle,
        windowToUpdate.content,
        windowToUpdate.initialPosition,
        windowToUpdate.id,
      );
    }
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

    // If the window is being un-minimized, bring it to the front
    if (!windowToToggle.minimized) {
      bringToFront(windowToToggle);
    }

    setWindows(updatedWindows);
  };

  const closeAllWindows = () => {
    setWindows([]);
    setActiveWindowId(null);
  };

  const resizeListener = new WindowResizeListener();

  // Context value to be provided
  const contextValue: WindowContextType = {
    windows,
    activeWindowId,
    addWindow,
    updateTitle,
    bringToFront,
    handleClose,
    getWindowTitleById,
    toggleMaximize,
    toggleMinimize,
    closeAllWindows,
    resizeListener,
  };

  // Provide the context to the children
  return <WindowContext.Provider value={contextValue}>{children}</WindowContext.Provider>;
};
