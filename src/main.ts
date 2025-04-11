import { initJsPsych, TrialType } from 'jspsych'
import { hideMouse, showMouse } from './util_trials/hide-mouse';
import { generateSaveResultTrial } from './util_trials/save-data';
import { enterFullscreen, exitFullscreen } from './util_trials/fullscreen';
import { generateUid } from './util/uid';
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
setContext('experimentId', generateUid())

const saveData = generateSaveResultTrial('json')

const helloTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Hello world!',
    on_finish: (data) => {
        delete data.stimulus
    },
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

jsPsych.run([
    enterFullscreen,
    hideMouse, 
    helloTrial,
    showMouse,
    exitFullscreen,
    saveData,
]);