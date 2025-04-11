import { TrialType } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';

export const hideMouse = {
    type: htmlKeyboardResponse,
    data: {
        trial_name: 'util_hide_mouse'
    },
    stimulus: '',
    choices: ["NO_KEYS"],
    trial_duration: 0,
    on_load: () => {
        document.body.style.cursor = 'none';
    },
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

export const showMouse = {
    type: htmlKeyboardResponse,
    data: {
        trial_name: 'util_show_mouse'
    },
    stimulus: '',
    choices: ["NO_KEYS"],
    trial_duration: 0,
    on_load: () => {
        document.body.style.cursor = 'auto';
    },
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>