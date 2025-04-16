import { TrialType } from 'jspsych'
import browserCheck from '@jspsych/plugin-browser-check';

export const checkBrowserInfo = {
    type: browserCheck,
    data: {
        trial_name: 'util_browser_check',
    },
} satisfies Partial<TrialType<typeof browserCheck.info>>