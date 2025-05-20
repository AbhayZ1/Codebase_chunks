import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Code, Search, MessageSquare, FileCode } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const HomePage: React.FC = () => {
  const { darkMode } = useAppContext();
  
  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col">
      <div className={`py-20 ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-accent-500">
                AI-Powered Code Understanding
              </span>
            </h1>
            <p className={`text-xl md:text-2xl mb-8 ${darkMode ? 'text-gray-300' : 'text-gray-600'} animate-fade-in`}>
              Query and understand your codebase with natural language. Get fast, accurate insights powered by AI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
              <Link
                to="/dashboard"
                className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center gap-2"
              >
                Try Demo <ChevronRight size={20} />
              </Link>
              <a
                href="#features"
                className={`px-6 py-3 ${
                  darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
                } rounded-lg transition-colors flex items-center justify-center gap-2`}
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      <div id="features" className={`py-16 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Core Features</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Search className="text-primary-500" size={36} />}
              title="Semantic Code Search"
              description="Find relevant code snippets using natural language queries, powered by AI understanding."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<MessageSquare className="text-accent-500" size={36} />}
              title="AI Code Assistant"
              description="Chat with an AI that understands your codebase context and can answer complex questions."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<FileCode className="text-secondary-500" size={36} />}
              title="Auto Documentation"
              description="Generate comprehensive documentation from your code automatically."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<Code className="text-primary-500" size={36} />}
              title="Code Refactoring"
              description="Get AI-powered suggestions to improve and refactor your code."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<Search className="text-secondary-500" size={36} />}
              title="Hybrid Search"
              description="Combine vector and keyword search for more accurate code discovery."
              darkMode={darkMode}
            />
            <FeatureCard
              icon={<Code className="text-accent-500" size={36} />}
              title="Code Navigation"
              description="Explore your codebase with intelligent file navigation and context awareness."
              darkMode={darkMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  darkMode: boolean;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description, darkMode }) => {
  return (
    <div 
      className={`p-6 rounded-lg ${
        darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'
      } transition-all duration-300 hover:shadow-lg`}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>{description}</p>
    </div>
  );
};

export default HomePage;