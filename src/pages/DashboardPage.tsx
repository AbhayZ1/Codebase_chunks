import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import FileExplorer from '../components/file/FileExplorer';
import CodeViewer from '../components/code/CodeViewer';
import ChatInterface from '../components/chat/ChatInterface';
import DocumentationPanel from '../components/docs/DocumentationPanel';
import SearchBar from '../components/search/SearchBar';
import ResizableSplitPane from '../components/shared/ResizableSplitPane';
import { SplitScreen, BookOpen, Code, MessageSquare, FileText, Menu } from 'lucide-react';

const DashboardPage: React.FC = () => {
  const { codebase, setCurrentFile, darkMode, showFileExplorer, toggleFileExplorer } = useAppContext();
  const [activeTab, setActiveTab] = useState<'chat' | 'docs'>('chat');

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Bar */}
      <div className={`border-b px-4 py-2 flex items-center justify-between ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center">
          <button
            onClick={toggleFileExplorer}
            className={`p-2 rounded-md mr-2 ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
          >
            <Menu size={20} />
          </button>
          <SearchBar />
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => setActiveTab('chat')}
            className={`p-2 rounded-md ${
              activeTab === 'chat'
                ? 'bg-primary-500 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Chat"
          >
            <MessageSquare size={20} />
          </button>
          <button
            onClick={() => setActiveTab('docs')}
            className={`p-2 rounded-md ${
              activeTab === 'docs'
                ? 'bg-primary-500 text-white'
                : darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
            title="Documentation"
          >
            <BookOpen size={20} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* File Explorer */}
        {showFileExplorer && (
          <div className={`w-64 border-r ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'}`}>
            <FileExplorer
              files={codebase.files}
              onSelectFile={setCurrentFile}
              currentFile={codebase.currentFile}
            />
          </div>
        )}

        {/* Split Pane */}
        <div className="flex-1">
          <ResizableSplitPane
            left={
              <div className="h-full">
                <CodeViewer file={codebase.currentFile} darkMode={darkMode} />
              </div>
            }
            right={
              <div className="h-full">
                {activeTab === 'chat' ? (
                  <ChatInterface />
                ) : (
                  <DocumentationPanel fileName={codebase.currentFile?.path || 'Select a file'} />
                )}
              </div>
            }
            initialLeftWidth={550}
            minLeftWidth={300}
            maxLeftWidth={800}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;