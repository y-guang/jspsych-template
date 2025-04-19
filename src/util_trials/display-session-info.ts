import { TrialType } from 'jspsych'
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { getContext } from '../app-context';
import rawStimulusTemplate from './display-session-info.html?raw'
import Handlebars from 'handlebars'
import { toDisplayUid } from '../util/uid';

const stimulusTemplate = Handlebars.compile(rawStimulusTemplate)

export const displaySessionInfo = {
    type: htmlButtonResponse,
    data: {
        trial_name: 'util_display_session_info',
    },
    // @ts-ignore
    stimulus: () => {
        const sessionId = toDisplayUid(getContext('sessionId') as string)
        return stimulusTemplate({
            sessionId,
        })
    },
    choices: [`I've recorded the ID`],
    record_data: false,
} satisfies Partial<TrialType<typeof htmlButtonResponse.info>>