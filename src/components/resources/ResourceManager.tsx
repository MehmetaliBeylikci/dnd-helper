/**
 * ResourceManager Component
 * Main panel for managing all character class resources
 */

import React from 'react';
import { Flame } from 'lucide-react';
import type { Character } from '../../types/character';
import { useCharacterStore } from '../../store/characterStore';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import ResourceBar from './ResourceBar';

interface ResourceManagerProps {
  character: Character;
}

export const ResourceManager: React.FC<ResourceManagerProps> = ({ character }) => {
  const {
    useResource,
    restoreResource,
    setResourceValue,
  } = useCharacterStore();

  // Safety check for resources
  if (!character.resources || !character.resources.classResources) {
    return null;
  }

  const { classResources } = character.resources;

  // If no resources, show empty state
  if (classResources.length === 0) {
    return (
      <Card glass>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="w-5 h-5" />
            Class Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-parchment-600 dark:text-parchment-400">
            No class resources available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Group resources by reset type
  const shortRestResources = classResources.filter(r => r.resetOn === 'short-rest');
  const longRestResources = classResources.filter(r => r.resetOn === 'long-rest');
  const otherResources = classResources.filter(r => r.resetOn !== 'short-rest' && r.resetOn !== 'long-rest');

  return (
    <Card glass>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Flame className="w-5 h-5" />
          Class Resources ({classResources.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Short Rest Resources */}
        {shortRestResources.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-parchment-700 dark:text-parchment-300 flex items-center gap-1">
              Short Rest Resources
            </h3>
            {shortRestResources.map((resource) => (
              <ResourceBar
                key={resource.id}
                resource={resource}
                onUse={(amount) => useResource(character.id, resource.resourceKey, amount)}
                onRestore={(amount) => restoreResource(character.id, resource.resourceKey, amount)}
                onSetValue={(value) => setResourceValue(character.id, resource.resourceKey, value)}
              />
            ))}
          </div>
        )}

        {/* Long Rest Resources */}
        {longRestResources.length > 0 && (
          <div className="space-y-2">
            {shortRestResources.length > 0 && (
              <div className="border-t border-parchment-200 dark:border-dark-border my-3" />
            )}
            <h3 className="text-sm font-semibold text-parchment-700 dark:text-parchment-300 flex items-center gap-1">
              Long Rest Resources
            </h3>
            {longRestResources.map((resource) => (
              <ResourceBar
                key={resource.id}
                resource={resource}
                onUse={(amount) => useResource(character.id, resource.resourceKey, amount)}
                onRestore={(amount) => restoreResource(character.id, resource.resourceKey, amount)}
                onSetValue={(value) => setResourceValue(character.id, resource.resourceKey, value)}
              />
            ))}
          </div>
        )}

        {/* Other Resources */}
        {otherResources.length > 0 && (
          <div className="space-y-2">
            {(shortRestResources.length > 0 || longRestResources.length > 0) && (
              <div className="border-t border-parchment-200 dark:border-dark-border my-3" />
            )}
            {otherResources.map((resource) => (
              <ResourceBar
                key={resource.id}
                resource={resource}
                onUse={(amount) => useResource(character.id, resource.resourceKey, amount)}
                onRestore={(amount) => restoreResource(character.id, resource.resourceKey, amount)}
                onSetValue={(value) => setResourceValue(character.id, resource.resourceKey, value)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResourceManager;
