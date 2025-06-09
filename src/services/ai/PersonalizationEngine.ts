
import type { PersonalizationPreferences, PresentationStylePreference, PatternType } from '../../types';
import { LOCALSTORAGE_PERSONALIZATION_KEY } from '../../constants';

const defaultPreferences: PersonalizationPreferences = {
  preferredStyle: 'professional',
  frequentlyUsedPatterns: [],
  customPrompts: {},
};

export const PersonalizationEngine = {
  /**
   * Loads personalization preferences from localStorage.
   * @returns The loaded PersonalizationPreferences or default preferences if none found/invalid.
   */
  loadPreferences: (): PersonalizationPreferences => {
    try {
      const storedPrefs = localStorage.getItem(LOCALSTORAGE_PERSONALIZATION_KEY);
      if (storedPrefs) {
        const parsedPrefs = JSON.parse(storedPrefs);
        // Basic validation to ensure it's somewhat like PersonalizationPreferences
        if (typeof parsedPrefs === 'object' && parsedPrefs !== null) {
          return { ...defaultPreferences, ...parsedPrefs };
        }
      }
    } catch (error) {
      console.error("Failed to load personalization preferences:", error);
    }
    return { ...defaultPreferences };
  },

  /**
   * Saves personalization preferences to localStorage.
   * @param prefs The PersonalizationPreferences to save.
   */
  savePreferences: (prefs: PersonalizationPreferences): void => {
    try {
      localStorage.setItem(LOCALSTORAGE_PERSONALIZATION_KEY, JSON.stringify(prefs));
    } catch (error) {
      console.error("Failed to save personalization preferences:", error);
    }
  },

  /**
   * Updates a specific preference.
   * @param key The key of the preference to update.
   * @param value The new value for the preference.
   */
  updatePreference: <K extends keyof PersonalizationPreferences>(
    key: K,
    value: PersonalizationPreferences[K]
  ): PersonalizationPreferences => {
    const currentPrefs = PersonalizationEngine.loadPreferences();
    const updatedPrefs = { ...currentPrefs, [key]: value };
    PersonalizationEngine.savePreferences(updatedPrefs);
    return updatedPrefs;
  },

  /**
   * Gets a specific preference value.
   * @param key The key of the preference to get.
   * @returns The value of the preference or undefined.
   */
  getPreference: <K extends keyof PersonalizationPreferences>(
    key: K
  ): PersonalizationPreferences[K] | undefined => {
    return PersonalizationEngine.loadPreferences()[key];
  },

  /**
   * Records usage of a pattern to potentially update frequentlyUsedPatterns.
   * (Simplified: keeps last N unique patterns)
   * @param patternType The PatternType that was used.
   */
  recordPatternUsage: (patternType: PatternType): void => {
    const prefs = PersonalizationEngine.loadPreferences();
    let currentFrequent = prefs.frequentlyUsedPatterns || [];
    
    // Remove if exists to add to front (most recent)
    currentFrequent = currentFrequent.filter(p => p !== patternType);
    currentFrequent.unshift(patternType);
    
    // Keep only last 3 unique patterns for simplicity
    const updatedFrequent = Array.from(new Set(currentFrequent)).slice(0, 3);
    
    PersonalizationEngine.updatePreference('frequentlyUsedPatterns', updatedFrequent);
  },
};
