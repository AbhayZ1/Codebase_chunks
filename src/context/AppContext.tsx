import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockCodebase } from '../data/mockData';

type CodebaseType = {
  files: FileItem[];
  currentFile: FileItem | null;
};

export type FileItem = {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  content?: string;
  children?: FileItem[];
  language?: string;
};

type Message = {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  codeReferences?: {
    file: string;
    lineStart: number;
    lineEnd: number;
  }[];
};

type AppContextType = {
  darkMode: boolean;
  toggleDarkMode: () => void;
  codebase: CodebaseType;
  setCurrentFile: (file: FileItem) => void;
  messages: Message[];
  addMessage: (content: string, role: 'user' | 'assistant', codeReferences?: Message['codeReferences']) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  showFileExplorer: boolean;
  toggleFileExplorer: () => void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [codebase, setCodebase] = useState<CodebaseType>({
    files: mockCodebase,
    currentFile: null,
  });
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to CodeInsight! Ask me anything about this codebase.',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFileExplorer, setShowFileExplorer] = useState(true);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const setCurrentFile = (file: FileItem) => {
    setCodebase((prev) => ({
      ...prev,
      currentFile: file,
    }));
  };

  const addMessage = (
    content: string,
    role: 'user' | 'assistant',
    codeReferences?: Message['codeReferences']
  ) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      role,
      timestamp: new Date(),
      codeReferences,
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  const toggleFileExplorer = () => {
    setShowFileExplorer((prev) => !prev);
  };

  return (
    <AppContext.Provider
      value={{
        darkMode,
        toggleDarkMode,
        codebase,
        setCurrentFile,
        messages,
        addMessage,
        isLoading,
        setIsLoading,
        showFileExplorer,
        toggleFileExplorer,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};