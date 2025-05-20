import React from 'react';
import { BookOpen, Code } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface DocumentationPanelProps {
  fileName: string;
}

const DocumentationPanel: React.FC<DocumentationPanelProps> = ({ fileName }) => {
  const { darkMode } = useAppContext();

  // Mock documentation data
  const documentation = {
    overview: `# CodeRetriever Class

A utility class for retrieving and searching code from a vector database. This class handles:

1. Connecting to the Qdrant vector database
2. Converting queries to embeddings
3. Performing semantic vector search
4. Supporting hybrid search (vector + keyword)`,
    
    methods: [
      {
        name: 'retrieve',
        signature: 'def retrieve(self, query: str, top_k: int = 5, file_path: Optional[str] = None) -> List[Dict[str, Any]]:',
        description: 'Retrieve relevant code chunks for a given query with vector similarity search.',
        parameters: [
          { name: 'query', type: 'str', description: 'The search query text' },
          { name: 'top_k', type: 'int', description: 'Number of results to return', default: '5' },
          { name: 'file_path', type: 'Optional[str]', description: 'Optional filter by file path', default: 'None' }
        ],
        returns: { type: 'List[Dict[str, Any]]', description: 'List of relevant code chunks with metadata' }
      },
      {
        name: 'hybrid_search',
        signature: 'def hybrid_search(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:',
        description: 'Perform hybrid search combining vector similarity and keyword matching.',
        parameters: [
          { name: 'query', type: 'str', description: 'The search query text' },
          { name: 'top_k', type: 'int', description: 'Number of results to return', default: '5' }
        ],
        returns: { type: 'List[Dict[str, Any]]', description: 'List of relevant code chunks with metadata' }
      }
    ],
    
    dependencies: [
      { name: 'qdrant_client', description: 'Vector database client' },
      { name: 'openai', description: 'For generating embeddings' }
    ],
    
    examples: [
      {
        title: 'Basic Usage',
        code: `retriever = CodeRetriever()
results = retriever.retrieve("how to search for code chunks", top_k=3)
for result in results:
    print(f"File: {result['file_path']}")
    print(f"Code: {result['code'][:100]}...")`,
      }
    ]
  };

  return (
    <div className={`h-full overflow-y-auto p-4 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="text-primary-500" size={20} />
        <h2 className="text-lg font-semibold">{fileName.split('/').pop()} Documentation</h2>
      </div>
      
      <div className="space-y-6">
        {/* Overview section */}
        <div className="markdown prose prose-sm max-w-none">
          <div className={darkMode ? 'text-gray-300' : 'text-gray-800'}>
            <div dangerouslySetInnerHTML={{ __html: documentation.overview.replace(/\n/g, '<br />') }} />
          </div>
        </div>
        
        {/* Methods section */}
        <div>
          <h3 className="text-md font-medium mb-2 flex items-center">
            <Code size={16} className="mr-2" />
            Methods
          </h3>
          
          <div className="space-y-4">
            {documentation.methods.map((method, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-md ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
              >
                <h4 className="font-medium text-sm">{method.name}</h4>
                <pre className={`text-xs font-mono mt-1 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {method.signature}
                </pre>
                <p className="text-sm mt-2">{method.description}</p>
                
                {method.parameters.length > 0 && (
                  <div className="mt-3">
                    <h5 className="text-xs font-medium">Parameters:</h5>
                    <ul className="mt-1 space-y-1">
                      {method.parameters.map((param, paramIndex) => (
                        <li key={paramIndex} className="text-xs">
                          <span className="font-mono">{param.name}</span>
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>: {param.type}</span>
                          {param.default && (
                            <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}> = {param.default}</span>
                          )}
                          <span> - {param.description}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="mt-3">
                  <h5 className="text-xs font-medium">Returns:</h5>
                  <p className="text-xs mt-1">
                    <span className="font-mono">{method.returns.type}</span>
                    <span> - {method.returns.description}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Dependencies section */}
        <div>
          <h3 className="text-md font-medium mb-2">Dependencies</h3>
          <ul className={`list-disc pl-5 ${darkMode ? 'text-gray-300' : 'text-gray-700'} space-y-1 text-sm`}>
            {documentation.dependencies.map((dep, index) => (
              <li key={index}>
                <span className="font-medium">{dep.name}</span> - {dep.description}
              </li>
            ))}
          </ul>
        </div>
        
        {/* Examples section */}
        <div>
          <h3 className="text-md font-medium mb-2">Examples</h3>
          {documentation.examples.map((example, index) => (
            <div key={index} className="mt-2">
              <h4 className="text-sm font-medium">{example.title}</h4>
              <pre className={`mt-1 p-3 rounded-md text-xs font-mono ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                {example.code}
              </pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentationPanel;