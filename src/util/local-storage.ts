/**
 * Experiment localStorage conventions:
 *
 * - Requires config.experimentId.
 * - Keys use `exp:<experimentId>:<key>`; values are JSON-serializable.
 * - `lastRun` is reserved for the experiment's last startup timestamp (ms).
 * - Call initLocalStorage once before trials. It refreshes lastRun, then removes
 *   other experiments with missing/invalid lastRun or more than 30 days of
 *   inactivity. Existing values for the current experiment are retained.
 */
import { config } from '../config';
import { escapeRegExp } from './string';

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

/**
 * Read a value from the current experiment's namespace, including prior sessions.
 * Returns null if the key is missing or its JSON is invalid.
 */
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

/** Refresh lastRun and clean up expired experiments before trials start. */
export const initLocalStorage = () => {
    setLocalStorageLastRun();
    cleanUpLocalStorage();
}
