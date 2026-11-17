export type JournalSection = 'campaign' | 'party' | 'characters' | 'lore' | 'places' | 'events';

export const journalSections: { key: JournalSection; label: string }[] = [
  { key: 'campaign', label: 'Campaign' },
  { key: 'party', label: 'Party' },
  { key: 'characters', label: 'Characters' },
  { key: 'lore', label: 'Backstory' },
  { key: 'places', label: 'Places' },
  { key: 'events', label: 'Events' },
];
