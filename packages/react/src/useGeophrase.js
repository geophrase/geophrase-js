"use client";

import { useEffect, useRef, useCallback } from 'react';
import Geophrase from '@geophrase/core';

export const useGeophrase = (options = {}) => {
    const geoInstance = useRef(null);

    // 1. Keep a mutable reference to the latest callbacks
    // This prevents React from destroying/recreating the iframe just
    // because the parent component re-rendered and created a new function.
    const savedCallbacks = useRef({
        onSuccess: options.onSuccess,
        onError: options.onError,
        onClose: options.onClose
    });

    // 2. Update the callbacks on every render without triggering the useEffect
    useEffect(() => {
        savedCallbacks.current = {
            onSuccess: options.onSuccess,
            onError: options.onError,
            onClose: options.onClose
        };
    });

    // 3. Manage the Vanilla JS Lifecycle safely
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Instantiate the vanilla class EXACTLY once per mount
        geoInstance.current = new Geophrase({
            key: options.key,
            order_id: options.order_id,
            phone: options.phone,
            // Pass wrapper functions to always execute the latest React state
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

        // Cleanup: Destroy the DOM elements if the React component unmounts
        // This perfectly handles React 18's Strict Mode double-mount behavior
        return () => {
            if (geoInstance.current) {
                geoInstance.current.destroy();
                geoInstance.current = null;
            }
        };

        // We only re-run this effect if the CORE configuration changes
    }, [options.key, options.order_id, options.phone]);

    // 4. Provide a stable reference to the open method
    const open = useCallback(() => {
        if (geoInstance.current) {
            geoInstance.current.open();
        } else {
            console.warn("Geophrase widget is not ready yet.");
        }
    }, []);

    return { open };
};