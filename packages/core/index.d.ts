export interface GeophraseAddressDetails {
    city: string;
    state: string;
    digi_pin: string;
    landmark: string;
    latitude: number;
    longitude: number;
    postal_code: number;
    address_type: string;
    address_line_one: string;
    address_line_two: string;
    contact_full_name: string;
    verified_mobile_num: string;
}

export interface GeophraseAddress {
    short_code: string;
    short_link: string;
    qr_code: string;
    captured_at: number;
    order_id: string;
    address: GeophraseAddressDetails;
}

export interface GeophraseRequestId {
    requestId: string;
}

export interface GeophraseError {
    type: 'API_ERROR' | 'NETWORK_ERROR';
    status?: number;
    message: string;
}

export interface GeophraseOptions {
    keyId: string;
    mode?: 'client' | 'server';
    theme?: 'light' | 'dark' | 'system';
    key?: string;
    orderId?: string;
    phone?: string;
    onSuccess: (result: GeophraseAddress | GeophraseRequestId) => void;
    onError?: (error: GeophraseError) => void;
    onClose?: () => void;
}

export default class Geophrase {
    constructor(options: GeophraseOptions);
    open(): void;
    close(): void;
    destroy(): void;
}
