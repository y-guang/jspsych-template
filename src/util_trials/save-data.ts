import { TrialType } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { getContext } from '../app-context';

function getFilenameSafeISOString(date: Date): string {
    return date.toISOString()
        .replace(/:/g, '-')
        .replace('T', '_')
}

export const util_save_to_json = {
    type: htmlKeyboardResponse,
    stimulus: '',
    choices: ["NO_KEYS"],
    trial_duration: 0,
    on_load: () => {
        const jsPsych = getContext('jsPsych')!
        const startTime = getContext('startTime')!
        const startTimeString = getFilenameSafeISOString(startTime)
        const participantId = getContext('participantId') ?? 'unknown'
        const filename = `${startTimeString}_${participantId}.json`
        jsPsych.data.get().localSave('json', filename)
    },
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>