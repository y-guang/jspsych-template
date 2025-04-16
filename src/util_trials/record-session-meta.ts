/**
 * gether metadata for this session.
 */

import { TrialType } from 'jspsych'
import callFunction from '@jspsych/plugin-call-function';
import { getPersistableContext } from '../app-context';
import { assignSnakeKeys } from '../util/string';

export const recordSessionMeta = {
    type: callFunction,
    func: () => {},
    on_finish: (data) => {
        const context = getPersistableContext()
        assignSnakeKeys(data, context)
    }
} satisfies Partial<TrialType<typeof callFunction.info>>