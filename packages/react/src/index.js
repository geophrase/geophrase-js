import { useEffect, useCallback } from 'react';
import Geophrase from '@geophrase/core';

export function useGeophrase(apiKey) {

    // Pre-load the widget when the component mounts
    useEffect(() => {
        if (apiKey) Geophrase.initialize(apiKey);
    }, [apiKey]);

    // Expose the open function
    const open = useCallback((options) => {
        Geophrase.open(options);
    }, []);

    // Expose the close function
    const close = useCallback(() => {
        Geophrase.close();
    }, []);

    return { open, close };
}