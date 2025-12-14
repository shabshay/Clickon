import assert from 'node:assert';
import test from 'node:test';
import { getMissingSetlistEntries, removeMissingFromSetlist } from '../src/utils/setlistHelpers.js';
import type { Setlist, Song } from '../src/types.js';

test('detects missing songs with positions and titles', () => {
  const songA: Song = { id: 'song-a', title: 'Alive', bpm: 120, timeSignature: '4/4' };
  const songs: Record<string, Song> = { [songA.id]: songA };
  const setlist: Setlist = { id: 'list-1', name: 'Friday', songOrder: ['song-a', 'missing-1'] };

  const missing = getMissingSetlistEntries(setlist, songs);

  assert.strictEqual(missing.length, 1);
  assert.strictEqual(missing[0].id, 'missing-1');
  assert.strictEqual(missing[0].position, 1);
  assert.strictEqual(missing[0].title, 'Unknown title');
});

test('cleanup removes missing ids while preserving order', () => {
  const songA: Song = { id: 'song-a', title: 'Alive', bpm: 120, timeSignature: '4/4' };
  const songB: Song = { id: 'song-b', title: 'Bloom', bpm: 90, timeSignature: '3/4' };
  const songs: Record<string, Song> = { [songA.id]: songA, [songB.id]: songB };
  const setlist: Setlist = { id: 'list-1', name: 'Friday', songOrder: ['missing-1', 'song-a', 'song-b'] };

  const cleaned = removeMissingFromSetlist(setlist, songs);

  assert.deepStrictEqual(cleaned, ['song-a', 'song-b']);
});
