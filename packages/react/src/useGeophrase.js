"use client";

import { useEffect, useRef, useCallback } from 'react';
import Geophrase from '@geophrase/core';

export const useGeophrase = (options = {}) => {
    const geoInstance = useRef(null);

    const savedCallbacks = useRef({
        onSuccess: options.onSuccess,
        onError: options.onError,
        onClose: options.onClose
    });

    useEffect(() => {
        savedCallbacks.current = {
            onSuccess: options.onSuccess,
            onError: options.onError,
            onClose: options.onClose
        };
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            geoInstance.current = new Geophrase({
                mode: options.mode,
                theme: options.theme,
                key: options.key,
                order_id: options.order_id,
                phone: options.phone,
                onSuccess: (data) => {
                    if (savedCallbacks.current.onSuccess) savedCallbacks.current.onSuccess(data);
                },
                onError: (error) => {
                    if (savedCallbacks.current.onError) savedCallbacks.current.onError(error);
                },
                onClose: () => {
                    if (savedCallbacks.current.onClose) savedCallbacks.current.onClose();
                }
            });
        } catch (error) {
            console.error(error.message);
        }

        return () => {
            if (geoInstance.current) {
                geoInstance.current.destroy();
                geoInstance.current = null;
            }
        };
        // Include mode and theme in the dependency array so the instance rebuilds if they change state
    }, [options.mode, options.theme, options.key, options.order_id, options.phone]);

    const open = useCallback(() => {
        if (geoInstance.current) {
            geoInstance.current.open();
        } else {
            console.warn("Geophrase widget is not ready yet or failed to initialize.");
        }
    }, []);

    const close = useCallback(() => {
        if (geoInstance.current) {
            geoInstance.current.close();
        }
    }, []);

    return { open, close };
};