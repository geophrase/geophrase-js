import { GeophraseOptions } from '@geophrase/core';

export interface UseGeophraseReturn {
    open: () => void;
    close: () => void;
}

export function useGeophrase(options: GeophraseOptions): UseGeophraseReturn;