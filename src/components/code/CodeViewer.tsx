import React from 'react';
import { SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomOneDark, atomOneLight } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { FileItem } from '../../context/AppContext';

interface CodeViewerProps {
  file: FileItem | null;
  darkMode: boolean;
  highlightedLines?: number[];
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  file,
  darkMode,
  highlightedLines = [],
}) => {
  if (!file || !file.content) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        <p>Select a file to view its content</p>
      </div>
    );
  }
  
  // Map common file extensions to languages
  const getLanguage = (filePath: string): string => {
    const extension = filePath.split('.').pop() || '';
    const langMap: Record<string, string> = {
      py: 'python',
      js: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      jsx: 'javascript',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
    };
    
    return langMap[extension] || 'text';
  };
  
  return (
    <div className="h-full overflow-hidden flex flex-col">
      <div className={`px-4 py-2 border-b ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-100'}`}>
        <span className="text-sm font-medium">{file.path}</span>
      </div>
      <div className="overflow-auto flex-1">
        <SyntaxHighlighter
          language={getLanguage(file.path)}
          style={darkMode ? atomOneDark : atomOneLight}
          showLineNumbers={true}
          wrapLines={true}
          lineProps={(lineNumber) => ({
            style: { 
              display: 'block',
              backgroundColor: highlightedLines.includes(lineNumber) 
                ? (darkMode ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.1)')
                : undefined,
            },
          })}
          customStyle={{
            margin: 0,
            padding: '1rem',
            backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
            borderRadius: 0,
            height: '100%',
          }}
        >
          {file.content}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;