import { TrialType } from 'jspsych'
import fullscreen from '@jspsych/plugin-fullscreen';

export const enter_fullscreen = {
    type: fullscreen,
    data: {
        trial_name: 'util_enter_fullscreen'
    },
    fullscreen_mode: true
} satisfies Partial<TrialType<typeof fullscreen.info>>

export const exit_fullscreen = {
    type: fullscreen,
    data: {
        trial_name: 'util_exit_fullscreen'
    },
    fullscreen_mode: false
} satisfies Partial<TrialType<typeof fullscreen.info>>