import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { UserPlus } from 'lucide-react';
import './i18n/config';
import { Layout } from './components/layout/Layout';
import { Button } from './components/ui/Button';
import { Dashboard } from './components/dashboard/Dashboard';
import { CharacterCreator } from './components/character/CharacterCreator';
import { TemplateSelector } from './components/character/TemplateSelector';
import { useCharacterStore } from './store/characterStore';
import { characterStorage } from './lib/storage';

// Initialize dark mode from localStorage
if (localStorage.getItem('theme') === 'dark' || 
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.classList.add('dark');
}

function App() {
  const { t } = useTranslation();
  const { characters, selectedCharacterId, setCharacters, selectCharacter } = useCharacterStore();
  const [showCreator, setShowCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const selectedCharacter = characters.find(c => c.id === selectedCharacterId);

  // Load characters on mount
  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const loadedCharacters = await characterStorage.getAll();
        setCharacters(loadedCharacters);
        
        // Auto-select first character if none selected
        if (loadedCharacters.length > 0 && !selectedCharacterId) {
          selectCharacter(loadedCharacters[0].id);
        }
      } catch (error) {
        console.error('Failed to load characters:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCharacters();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-burgundy-600 mb-4"></div>
            <p className="text-parchment-600 dark:text-parchment-400">{t('common.loading')}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-full">
        {/* Character Selector Bar */}
        {characters.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-parchment-700 dark:text-parchment-300">
              {t('character.select')}:
            </span>
            {characters.map((char) => (
              <button
                key={char.id}
                onClick={() => selectCharacter(char.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  char.id === selectedCharacterId
                    ? 'bg-burgundy-600 text-white shadow-lg scale-105'
                    : 'bg-parchment-200 dark:bg-dark-border text-parchment-900 dark:text-parchment-100 hover:bg-parchment-300 dark:hover:bg-parchment-800'
                }`}
              >
                {char.name}
              </button>
            ))}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowCreator(true)}
              className="ml-auto"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              {t('character.create')}
            </Button>
          </div>
        )}

        {/* Main Content */}
        {selectedCharacter ? (
          <Dashboard character={selectedCharacter} />
        ) : (
          /* Welcome Screen - No Characters */
          <div className="w-full">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="font-heading text-4xl md:text-5xl font-bold text-parchment-900 dark:text-parchment-100 mb-4">
                {t('app.welcome')}
              </h1>
              <p className="text-lg text-parchment-600 dark:text-parchment-400">
                Create your first character to begin your adventure
              </p>
            </div>

            {/* Template Selector */}
            <div className="mb-6">
              <TemplateSelector />
            </div>

            {/* Or Create Custom */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="h-px bg-parchment-300 dark:bg-dark-border w-20"></div>
                <span className="text-sm text-parchment-600 dark:text-parchment-400">or</span>
                <div className="h-px bg-parchment-300 dark:bg-dark-border w-20"></div>
              </div>
              <br />
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowCreator(true)}
              >
                <UserPlus className="w-5 h-5 mr-2" />
                Create Custom Character
              </Button>
            </div>
          </div>
        )}

        {/* Character Creator Modal */}
        {showCreator && (
          <CharacterCreator onClose={() => setShowCreator(false)} />
        )}
      </div>
    </Layout>
  );
}

export default App;
