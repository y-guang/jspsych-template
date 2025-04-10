import { initJsPsych, TrialType } from 'jspsych'
import { hideMouse, showMouse } from './util_trials/hide-mouse';
import { generateSaveResultTrial } from './util_trials/save-data';
import { setContext } from './app-context';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import 'jspsych/css/jspsych.css'
import './style.css'

const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.displayData()
    }
});
setContext('jsPsych', jsPsych)
setContext('startTime', new Date())

const saveData = generateSaveResultTrial('csv')

const helloTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Hello world!',
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

jsPsych.run([
    hideMouse, 
    helloTrial,
    showMouse,
    saveData
]);