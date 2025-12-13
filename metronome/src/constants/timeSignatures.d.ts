import type { TimeSignatureId } from '../types';
export interface TimeSignature {
    id: TimeSignatureId;
    beatsPerMeasure: number;
    noteValue: number;
    label: string;
}
export declare const TIME_SIGNATURES: TimeSignature[];
export declare const getSignature: (id: TimeSignatureId) => TimeSignature;
