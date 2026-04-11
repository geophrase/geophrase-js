export interface GeophraseAddress {
    phrase: string;
    [key: string]: any;
}

export interface GeophraseError {
    type: 'API_ERROR' | 'NETWORK_ERROR';
    status?: number;
    message: string;
}

export interface GeophraseOptions {
    key: string;
    order_id?: string;
    phone?: string;
    onSuccess: (address: GeophraseAddress) => void;
    onError?: (error: GeophraseError) => void;
    onClose?: () => void;
}

export default class Geophrase {
    constructor(options: GeophraseOptions);
    open(): void;
    close(): void;
    destroy(): void;
}
