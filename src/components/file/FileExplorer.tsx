import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown } from 'lucide-react';
import { FileItem } from '../../context/AppContext';

interface FileExplorerProps {
  files: FileItem[];
  onSelectFile: (file: FileItem) => void;
  currentFile?: FileItem | null;
}

const FileExplorer: React.FC<FileExplorerProps> = ({ files, onSelectFile, currentFile }) => {
  return (
    <div className="p-2 h-full overflow-y-auto">
      <h2 className="text-lg font-semibold mb-2 px-2">Files</h2>
      <div className="space-y-1">
        {files.map((file) => (
          <FileNode 
            key={file.id} 
            file={file} 
            onSelectFile={onSelectFile} 
            level={0} 
            currentFile={currentFile}
          />
        ))}
      </div>
    </div>
  );
};

interface FileNodeProps {
  file: FileItem;
  onSelectFile: (file: FileItem) => void;
  level: number;
  currentFile?: FileItem | null;
}

const FileNode: React.FC<FileNodeProps> = ({ file, onSelectFile, level, currentFile }) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = file.children && file.children.length > 0;
  const isCurrentFile = currentFile?.id === file.id;
  
  const toggleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasChildren) {
      setIsOpen(!isOpen);
    }
  };
  
  const handleFileSelect = () => {
    if (file.type === 'file') {
      onSelectFile(file);
    } else {
      setIsOpen(!isOpen);
    }
  };
  
  return (
    <div>
      <div 
        className={`flex items-center py-1 px-2 hover:bg-opacity-10 hover:bg-primary-500 rounded cursor-pointer ${
          isCurrentFile ? 'bg-primary-500 bg-opacity-20 text-primary-500' : ''
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleFileSelect}
      >
        <span className="mr-1" onClick={toggleOpen}>
          {hasChildren && (
            isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />
          )}
          {!hasChildren && <span className="w-4" />}
        </span>
        
        {file.type === 'directory' ? (
          <Folder size={16} className="mr-2 text-primary-500" />
        ) : (
          <File size={16} className="mr-2 text-gray-400" />
        )}
        
        <span className="text-sm truncate">{file.name}</span>
      </div>
      
      {isOpen && hasChildren && (
        <div>
          {file.children?.map((child) => (
            <FileNode 
              key={child.id} 
              file={child} 
              onSelectFile={onSelectFile}
              level={level + 1}
              currentFile={currentFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;