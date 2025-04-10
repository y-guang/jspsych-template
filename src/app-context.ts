import type { JsPsych } from 'jspsych';

// Define your context type
type AppContext = {
    jsPsych: JsPsych;
    startTime: Date;
    participantId: string;
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
    return appContext as AppContext;
}