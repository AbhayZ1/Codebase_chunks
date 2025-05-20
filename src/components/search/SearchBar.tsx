import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const { darkMode } = useAppContext();
  
  // Mock search results
  const mockResults = [
    {
      id: '1',
      name: 'retrieve method',
      file: 'src/retriever.py',
      snippet: 'def retrieve(self, query: str, top_k: int = 5, file_path: Optional[str] = None) -> List[Dict[str, Any]]:',
      line: 42
    },
    {
      id: '2',
      name: 'answer_query method',
      file: 'src/rag_engine.py',
      snippet: 'def answer_query(self, query: str, file_path: Optional[str] = None, top_k: int = 5) -> Dict[str, Any]:',
      line: 12
    },
    {
      id: '3',
      name: 'hybrid_search method',
      file: 'src/retriever.py',
      snippet: 'def hybrid_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:',
      line: 92
    }
  ];
  
  const handleFocus = () => {
    if (query.trim().length > 0) {
      setShowDropdown(true);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setShowDropdown(value.trim().length > 0);
  };
  
  const clearSearch = () => {
    setQuery('');
    setShowDropdown(false);
  };
  
  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onFocus={handleFocus}
          className={`w-full pl-10 pr-10 py-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
              : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
          } focus:ring-2 focus:ring-primary-500 focus:border-transparent`}
          placeholder="Search codebase..."
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
            aria-label="Clear search"
          >
            <X size={18} className={darkMode ? 'text-gray-400' : 'text-gray-500'} />
          </button>
        )}
      </div>
      
      {showDropdown && (
        <div 
          className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${
            darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
          } max-h-60 overflow-auto`}
        >
          <div className="py-1">
            {mockResults.map((result) => (
              <button
                key={result.id}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <div className="font-medium">{result.name}</div>
                <div className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{result.file}:{result.line}</div>
                <div className="mt-1 text-xs font-mono truncate">{result.snippet}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;