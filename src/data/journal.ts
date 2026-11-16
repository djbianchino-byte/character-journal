export type JournalSection = 'campaign' | 'party' | 'lore' | 'places' | 'events';

export const journalSections: { key: JournalSection; label: string }[] = [
  { key: 'campaign', label: 'Campaign' },
  { key: 'party', label: 'Party' },
  { key: 'lore', label: 'Backstory' },
  { key: 'places', label: 'Places' },
  { key: 'events', label: 'Events' },
];
