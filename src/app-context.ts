/**
 * This module provides a simple context management system for the application.
 * It manages all runtime state.
 * If anything is determined before the experiment starts, it should be in the config module.
 */
import type { JsPsych } from 'jspsych';
import { config } from './config';
import { generateUid } from './util/uid';
import { escapeRegExp } from './util/string';

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

export const setLocalStorage = (key: string, value: unknown) => {
    const prefix = config.experimentId;
    const fullKey = `exp:${prefix}:${key}`;
    const stringValue = JSON.stringify(value);

    try {
        localStorage.setItem(fullKey, stringValue);
    } catch (e) {
        console.warn(`Failed to set localStorage for key ${fullKey}`, e);
    }
};

export const getLocalStorage = (key: string): unknown => {
    const prefix = config.experimentId;
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

const setLocalStorageLastRun = () => {
    const lastRun = Date.now();
    setLocalStorage('lastRun', lastRun);
}

const getLocalStorageExperiments = () => {
    const experimentIds = new Set<string>();

    for (let i = 0; i < localStorage.length; i++) {
        const fullKey = localStorage.key(i);
        if (!fullKey || !fullKey.startsWith('exp:')) continue;

        const match = fullKey.match(/^exp:([^:]+):/);
        if (match) {
            const experimentId = match[1];
            experimentIds.add(experimentId);
        }
    }

    return experimentIds;
}

const classifyExperimentExpiry = (experimentIds: Set<string>, maxAgeMs: number) => {
    const expired = new Set<string>();
    const unexpired = new Set<string>();
    const now = Date.now()

    for (const experimentId of experimentIds) {
        const lastRunStr = localStorage.getItem(`exp:${experimentId}:lastRun`);

        if (!lastRunStr) {
            expired.add(experimentId);
            continue;
        }

        let lastRun: unknown;
        try {
            lastRun = JSON.parse(lastRunStr);
        } catch (e) {
            expired.add(experimentId);
            continue;
        }
        if (typeof lastRun !== 'number') {
            expired.add(experimentId);
            continue;
        }

        const age = now - lastRun;
        if (age > maxAgeMs) {
            expired.add(experimentId);
        } else {
            unexpired.add(experimentId);
        }
    }

    return { expired, unexpired };
}

/**
 * Clean up the local storage.
 * @param maxAgeMs The maximum age of the experiments in milliseconds. Default is 30 days.
 * @param aggressive If true, remove all local storage except for the unexpired experiments, even if not experiment-related.
 *                   Recommended to set to true if run on participant's computer.
 */
const cleanUpLocalStorage = (
    maxAgeMs: number = 30 * 24 * 60 * 60 * 1000, // 30 days
    aggressive: boolean = false
): void => {
    const makePrefixRegex = (prefixes: Set<string>): RegExp | null => {
        if (prefixes.size === 0) return null;
        const escaped = [...prefixes].map(escapeRegExp);
        return new RegExp(`^(${escaped.join('|')})`);
    };

    const makeExperimentPrefixes = (experimentIds: Set<string>): Set<string> => {
        const prefixes = new Set<string>();
        for (const id of experimentIds) {
            prefixes.add(`exp:${id}:`);
        }
        return prefixes;
    };

    const experimentIds = getLocalStorageExperiments();
    const { expired, unexpired } = classifyExperimentExpiry(experimentIds, maxAgeMs);

    if (aggressive) {
        // Keep only keys belonging to unexpired experiments
        const unexpiredPrefixes = makeExperimentPrefixes(unexpired);
        const keepRegex = makePrefixRegex(unexpiredPrefixes);

        for (let i = localStorage.length - 1; i >= 0; i--) {
            const storageKey = localStorage.key(i);
            if (!storageKey) continue;

            if (!keepRegex || !keepRegex.test(storageKey)) {
                localStorage.removeItem(storageKey);
            }
        }
    } else {
        // Remove keys belonging to expired experiments only
        const expiredPrefixes = makeExperimentPrefixes(expired);
        const removeRegex = makePrefixRegex(expiredPrefixes);

        if (!removeRegex) return;
        for (let i = localStorage.length - 1; i >= 0; i--) {
            const storageKey = localStorage.key(i);
            if (!storageKey) continue;

            if (removeRegex.test(storageKey)) {
                localStorage.removeItem(storageKey);
            }
        }
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

    // prepare the local storage
    setLocalStorageLastRun();
    cleanUpLocalStorage();
}