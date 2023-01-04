export const Preferences = {
  darkMode: 'Dark mode',
  rangeColors: 'Range color scales'
} as const;

export type PreferencesObject = Partial<Record<keyof typeof Preferences, boolean>>;

export const DEFAULT_PREFERENCES: PreferencesObject = {
  darkMode: false,
  rangeColors: true,
};
