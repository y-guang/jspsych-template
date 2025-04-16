/**
 * This module provides a simple context management system for the application.
 * It manages all runtime state.
 */
import type { JsPsych } from 'jspsych';

// Define your context type
type AppContext = {
    jsPsych: JsPsych;
    startTime: Date;
    sessionId: string;
    externalId: string | null;
}

// Internal mutable object
const appContext: Partial<AppContext> = {}

export const setContext = <K extends keyof AppContext>(key: K, value: AppContext[K]) => {
    appContext[key] = value
}

export const getContext = <K extends keyof AppContext>(key: K): AppContext[K] | undefined => {
    const value = appContext[key];
    return value;
}

export const getAllContext = () => {
    return appContext
}