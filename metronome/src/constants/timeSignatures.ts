import type { TimeSignatureId } from '../types';

export interface TimeSignature {
  id: TimeSignatureId;
  beatsPerMeasure: number;
  noteValue: number;
  label: string;
}

export const TIME_SIGNATURES: TimeSignature[] = [
  { id: '4/4', beatsPerMeasure: 4, noteValue: 4, label: '4/4' },
  { id: '3/4', beatsPerMeasure: 3, noteValue: 4, label: '3/4' },
  { id: '6/8', beatsPerMeasure: 6, noteValue: 8, label: '6/8' }
];

export const getSignature = (id: TimeSignatureId): TimeSignature => {
  const sig = TIME_SIGNATURES.find((s) => s.id === id);
  if (!sig) throw new Error(`Unknown signature ${id}`);
  return sig;
};
