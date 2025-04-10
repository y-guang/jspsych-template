import { TrialType } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

export const hideMouse = {
    type: htmlKeyboardResponse,
    stimulus: '',
    choices: ["NO_KEYS"],
    trial_duration: 0,
    on_load: () => {
        document.body.style.cursor = 'none';
    },
    record_data: false
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

export const showMouse = {
    type: htmlKeyboardResponse,
    stimulus: '',
    choices: ["NO_KEYS"],
    trial_duration: 0,
    on_load: () => {
        document.body.style.cursor = 'auto';
    },
    record_data: false
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>