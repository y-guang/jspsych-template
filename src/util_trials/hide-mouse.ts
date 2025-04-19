import { TrialType } from 'jspsych'
import callFunction from '@jspsych/plugin-call-function';

export const hideMouse = {
    type: callFunction,
    data: {
        trial_name: 'util_hide_mouse'
    },
    func: () => {
        document.body.style.cursor = 'none';
    },
    record_data: false,
} satisfies Partial<TrialType<typeof callFunction.info>>

export const showMouse = {
    type: callFunction,
    data: {
        trial_name: 'util_show_mouse'
    },
    func: () => {
        document.body.style.cursor = 'auto';
    },
    record_data: false,
} satisfies Partial<TrialType<typeof callFunction.info>>