import { initJsPsych, TrialType } from 'jspsych'
import { hideMouse, showMouse } from './util_trials/hide-mouse';
import { generateSaveResultTrial } from './util_trials/save-data';
import { enterFullscreen, exitFullscreen } from './util_trials/fullscreen';
import { checkBrowserInfo } from './util_trials/check-browser';
import { recordContext, recordConfig } from './util_trials/record-meta';
import { optionalChinrestCalibration } from './util_trials/calibrate';
import { initContext } from './app-context';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import 'jspsych/css/jspsych.css'
import './style.css'
import { displaySessionInfo } from './util_trials/display-session-info';

// setup
const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.displayData()
    }
});

// prepare the shared context
initContext(jsPsych)

// generate the trials
const saveData = generateSaveResultTrial('json')

const helloTrial = {
    type: htmlKeyboardResponse,
    stimulus: 'Hello world!',
    on_finish: (data) => {
        delete data.stimulus
    },
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

jsPsych.run([
    checkBrowserInfo,
    displaySessionInfo,
    enterFullscreen,
    optionalChinrestCalibration,
    hideMouse,
    helloTrial,
    showMouse,
    exitFullscreen,
    recordContext,
    recordConfig,
    saveData,
]);