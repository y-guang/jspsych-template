/**
 * gether metadata for this session.
 */

import { TrialType } from 'jspsych'
import callFunction from '@jspsych/plugin-call-function';
import { config } from '../config';
import { getPersistableContext } from '../app-context';
import { assignSnakeKeys } from '../util/string';

export const recordSessionMeta = {
    type: callFunction,
    data: {
        trial_name: 'util_record_session_meta',
    },
    func: () => {},
    on_finish: (data) => {
        const context = getPersistableContext()
        assignSnakeKeys(data, context)
    }
} satisfies Partial<TrialType<typeof callFunction.info>>

export const recordConfig = {
    type: callFunction,
    data: {
        trial_name: 'util_record_config',
    },
    func: () => {},
    on_finish: (data) => {
        assignSnakeKeys(data, config)
    }
} satisfies Partial<TrialType<typeof callFunction.info>>
