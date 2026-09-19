/**
 * Single source of truth for the playable buddies.
 * Keep `landing/src/App.jsx` (`buddies` + `SIZE_MULT`) in sync with this list.
 */
export const CHARACTERS = [
  { id: 'hoppy',   name: 'Hoppy',   trait: 'Energetic & Bouncy', spriteScale: 1.56 },
  { id: 'snapper', name: 'Snapper', trait: 'Playful & Cheeky',   spriteScale: 1.74 },
  { id: 'snoozy',  name: 'Snoozy',  trait: 'Calm & Cozy',        spriteScale: 1.56 },
  { id: 'flutty',  name: 'Flutty',  trait: 'Gentle & Graceful',  spriteScale: 1.62 },
  { id: 'buddy',   name: 'Buddy',   trait: 'Loyal & Friendly',   spriteScale: 1.44 },
];

export const CHARACTER_IDS = CHARACTERS.map((c) => c.id);
export const DEFAULT_CHARACTER_ID = CHARACTERS[0].id;

export function getCharacter(id) {
  return CHARACTERS.find((c) => c.id === id) || CHARACTERS[0];
}
