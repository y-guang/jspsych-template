import { TrialType } from 'jspsych'
import fullscreen from '@jspsych/plugin-fullscreen';

export const enterFullscreen = {
    type: fullscreen,
    data: {
        trial_name: 'util_enter_fullscreen'
    },
    fullscreen_mode: true
} satisfies Partial<TrialType<typeof fullscreen.info>>

export const exitFullscreen = {
    type: fullscreen,
    data: {
        trial_name: 'util_exit_fullscreen'
    },
    fullscreen_mode: false
} satisfies Partial<TrialType<typeof fullscreen.info>>