import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus } from 'lucide-react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { atomOneDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { useAppContext } from '../../context/AppContext';

interface ChatMessageProps {
  content: string;
  role: 'user' | 'assistant';
  darkMode: boolean;
  onCodeReference?: (file: string, start: number, end: number) => void;
  codeReferences?: {
    file: string;
    lineStart: number;
    lineEnd: number;
  }[];
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  content,
  role,
  darkMode,
  onCodeReference,
  codeReferences
}) => {
  // Simple regex to detect code blocks with syntax highlighting
  const formatMessage = () => {
    const parts = [];
    const codeBlockRegex = /```(\w*)\n([\s\S]*?)\n```/g;
    let lastIndex = 0;
    let match;
    
    while ((match = codeBlockRegex.exec(content)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        parts.push({
          type: 'text',
          content: content.substring(lastIndex, match.index)
        });
      }
      
      // Add code block
      const language = match[1] || 'text';
      const code = match[2];
      parts.push({
        type: 'code',
        language,
        content: code
      });
      
      lastIndex = match.index + match[0].length;
    }
    
    // Add remaining text
    if (lastIndex < content.length) {
      parts.push({
        type: 'text',
        content: content.substring(lastIndex)
      });
    }
    
    return parts;
  };

  const parts = formatMessage();

  return (
    <div className={`flex ${role === 'assistant' ? 'justify-start' : 'justify-end'} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg p-3 ${
          role === 'assistant'
            ? darkMode
              ? 'bg-gray-700'
              : 'bg-gray-100'
            : 'bg-primary-600 text-white'
        }`}
      >
        {parts.map((part, idx) => (
          <div key={idx} className="mb-3 last:mb-0">
            {part.type === 'text' ? (
              <div className="whitespace-pre-line">{part.content}</div>
            ) : (
              <div className="rounded overflow-hidden">
                <SyntaxHighlighter
                  language={part.language}
                  style={atomOneDark}
                  customStyle={{
                    margin: 0,
                    padding: '0.75rem',
                    fontSize: '0.875rem',
                  }}
                >
                  {part.content}
                </SyntaxHighlighter>
              </div>
            )}
          </div>
        ))}

        {codeReferences && codeReferences.length > 0 && (
          <div className={`mt-3 pt-2 border-t ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
            <p className="text-xs text-gray-400 mb-1">Referenced code:</p>
            <div className="flex flex-wrap gap-1">
              {codeReferences.map((ref, idx) => (
                <button
                  key={idx}
                  className={`text-xs px-2 py-1 ${
                    darkMode ? 'bg-gray-600 hover:bg-gray-500' : 'bg-gray-200 hover:bg-gray-300'
                  } rounded`}
                  onClick={() => onCodeReference && onCodeReference(ref.file, ref.lineStart, ref.lineEnd)}
                >
                  {ref.file.split('/').pop()}:{ref.lineStart}-{ref.lineEnd}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const ChatInterface: React.FC = () => {
  const { messages, addMessage, isLoading, setIsLoading, darkMode, setCurrentFile, codebase } = useAppContext();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      addMessage(input, 'user');
      setInput('');
      
      // Simulate AI response
      setIsLoading(true);
      setTimeout(() => {
        const responses = [
          "Based on the codebase, the `CodeRetriever` class is responsible for connecting to the vector database and retrieving relevant code chunks. It uses OpenAI embeddings to find semantically similar code.",
          "The `RAGEngine` class handles generating answers from the retrieved code chunks. It formats the context and sends it to the LLM with the user query.",
          "Looking at the codebase, I can see that the backend uses FastAPI for the API endpoints and Qdrant for vector storage. The code follows a modular design with separate files for different components."
        ];
        
        // Choose random response and add some code references
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'assistant', [
          {
            file: 'src/retriever.py',
            lineStart: 10,
            lineEnd: 25,
          },
          {
            file: 'src/rag_engine.py',
            lineStart: 30,
            lineEnd: 45,
          }
        ]);
        
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleCodeReference = (filePath: string, lineStart: number, lineEnd: number) => {
    // Find the file in the codebase
    const findFile = (items: any[], path: string): any | null => {
      for (const item of items) {
        if (item.path === path) return item;
        if (item.children) {
          const found = findFile(item.children, path);
          if (found) return found;
        }
      }
      return null;
    };

    const file = findFile(codebase.files, filePath);
    if (file) {
      setCurrentFile(file);
      // We would also highlight lines here
    }
  };

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto px-4 py-4">
        <div className="space-y-2">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              content={message.content}
              role={message.role}
              darkMode={darkMode}
              onCodeReference={handleCodeReference}
              codeReferences={message.codeReferences}
            />
          ))}
          {isLoading && (
            <div className="flex justify-start mb-4">
              <div className={`rounded-lg p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef}></div>
      </div>

      <div className={`border-t p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <form onSubmit={handleSubmit} className="flex items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className={`w-full py-2 px-4 pr-10 rounded-l-lg ${
                darkMode
                  ? 'bg-gray-700 text-white border-gray-600 focus:ring-2 focus:ring-primary-500'
                  : 'bg-gray-100 text-gray-900 border-gray-200 focus:ring-2 focus:ring-primary-500'
              } outline-none`}
              placeholder="Ask about the codebase..."
              disabled={isLoading}
            />
            <button
              type="button"
              className={`absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600`}
            >
              <Plus size={18} />
            </button>
          </div>
          <button
            type="submit"
            className={`rounded-r-lg px-4 py-2 ${
              isLoading || !input.trim()
                ? 'bg-gray-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700'
            } text-white`}
            disabled={isLoading || !input.trim()}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;