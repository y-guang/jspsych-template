/**
 * This module provides a simple context management system for the application.
 * It manages all runtime state.
 * If anything is determined before the experiment starts, it should be in the config module.
 */
import type { JsPsych } from 'jspsych';
import { generateUid } from './util/uid';

// Define your context type
type AppContext = {
    jsPsych: JsPsych;
    startTime: Date;
    sessionId: string;
    externalId: string | null;
}

const persistableFields: (keyof AppContext)[] = [
    'startTime',
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

/**
 * Initialize the context with the jsPsych instance and other runtime data.
 * called at the beginning of the experiment.
 * @param jsPsych The jsPsych instance to use for the experiment.
 */
export const initContext = (
    jsPsych: JsPsych
) => {
    appContext.jsPsych = jsPsych;
    appContext.startTime = new Date();
    appContext.sessionId = generateUid();
    setContext('externalId', jsPsych.data.getURLVariable('external_id') ?? null);

}