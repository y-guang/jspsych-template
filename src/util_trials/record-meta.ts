/**
 * gether metadata for this session.
 */

import { TrialType } from 'jspsych'
import callFunction from '@jspsych/plugin-call-function';
import { config } from '../config';
import { getPersistableContext } from '../app-context';
import { assignSnakeKeys } from '../util/string';

export const recordContext = {
    type: callFunction,
    data: {
        trial_name: 'util_record_context',
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
