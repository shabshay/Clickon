import type { Setlist, Song } from '../types.js';

export interface MissingSongEntry {
  id: string;
  position: number;
  title: string;
}

export const getMissingSetlistEntries = (
  setlist: Setlist | undefined,
  songMap: Record<string, Song | undefined>
): MissingSongEntry[] => {
  if (!setlist) return [];
  return setlist.songOrder
    .map((id: string, index: number): MissingSongEntry => ({
      id,
      position: index,
      title: songMap[id]?.title ?? 'Unknown title'
    }))
    .filter((entry: MissingSongEntry) => !songMap[entry.id]);
};

export const removeMissingFromSetlist = (setlist: Setlist, songMap: Record<string, Song | undefined>) =>
  setlist.songOrder.filter((id: string) => !!songMap[id]);
