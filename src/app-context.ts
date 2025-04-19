/**
 * This module provides a simple context management system for the application.
 * It manages all runtime state.
 * If anything is determined before the experiment starts, it should be in the config module.
 */
import type { JsPsych } from 'jspsych';

// Define your context type
type AppContext = {
    jsPsych: JsPsych;
    startTime: Date;
    experimentId: string;
    sessionId: string;
    externalId: string | null;
}

const persistableFields: (keyof AppContext)[] = [
    'startTime',
    'experimentId',
    'sessionId',
    'externalId',
]

// Internal mutable object
const appContext: Partial<AppContext> = {}

export const setContext = <K extends keyof AppContext>(key: K, value: AppContext[K]) => {
    appContext[key] = value
}

export const getContext = <K extends keyof AppContext>(key: K): AppContext[K] | undefined => {
    const value = appContext[key];
    return value;
}

export const setLocalStorage = (key: string, value: unknown) => {
    const prefix = appContext.experimentId ?? 'unknown';
    const fullKey = `exp:${prefix}:${key}`;
    const stringValue = JSON.stringify(value);

    try {
        localStorage.setItem(fullKey, stringValue);
    } catch (e) {
        console.warn(`Failed to set localStorage for key ${fullKey}`, e);
    }
};

export const getLocalStorage = (key: string): unknown => {
    const prefix = appContext.experimentId ?? 'unknown';
    const fullKey = `exp:${prefix}:${key}`;
    const value = localStorage.getItem(fullKey);
    if (value === null) return null;

    try {
        return JSON.parse(value);
    } catch (e) {
        console.warn(`Failed to parse localStorage for key ${fullKey}`, e);
        return null;
    }
};

export const getAllContext = () => {
    return appContext
}

export const getPersistableContext = () => {
    const persistableContext: Partial<AppContext> = {};
    persistableFields.forEach(<K extends keyof AppContext>(field: K) => {
        const value = appContext[field];
        if (value !== undefined) {
            persistableContext[field] = value;
        }
    });
    return persistableContext;
}