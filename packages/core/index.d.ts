export interface GeophraseAddress {
    phrase: string;
    [key: string]: any;
}

export interface GeophraseToken {
    token: string;
}

export interface GeophraseError {
    type: 'API_ERROR' | 'NETWORK_ERROR';
    status?: number;
    message: string;
}

export interface GeophraseOptions {
    mode?: 'client' | 'server';
    theme?: 'light' | 'dark' | 'system';
    key?: string;
    orderId?: string;
    phone?: string;
    onSuccess: (result: GeophraseAddress | GeophraseToken) => void;
    onError?: (error: GeophraseError) => void;
    onClose?: () => void;
}

export default class Geophrase {
    constructor(options: GeophraseOptions);
    open(): void;
    close(): void;
    destroy(): void;
}
