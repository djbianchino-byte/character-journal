export type JournalSection = 'hero' | 'lore' | 'campaign' | 'places' | 'events';

export const journalSections: { key: JournalSection; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'lore', label: 'Backstory' },
  { key: 'campaign', label: 'Campaign' },
  { key: 'places', label: 'Places' },
  { key: 'events', label: 'Events' },
];
