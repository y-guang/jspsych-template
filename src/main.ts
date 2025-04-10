import { initJsPsych, TrialType } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import 'jspsych/css/jspsych.css'
import './style.css'

const jsPsych = initJsPsych();

const hello_trial = {
    type: htmlKeyboardResponse,
    stimulus: 'Hello world!',
    choices: ["NO_KEYS"],
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

jsPsych.run([hello_trial]);