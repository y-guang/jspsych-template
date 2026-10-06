import { initJsPsych, type TrialType } from 'jspsych'
import { hideMouse, showMouse } from './util_trials/hide-mouse';
import { generateSaveResultTrial } from './util_trials/save-data';
import { enterFullscreen, exitFullscreen } from './util_trials/fullscreen';
import { checkBrowserInfo } from './util_trials/check-browser';
import { recordContext, recordConfig } from './util_trials/record-meta';
import { optionalChinrestCalibration } from './util_trials/calibrate';
import { initContext } from './app-context';
import { initLocalStorage } from './util/local-storage';
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import 'jspsych/css/jspsych.css'
import './style.css'
import { displaySessionId } from './util_trials/display-session-id';

// setup
const jsPsych = initJsPsych({
    on_finish: () => {
        jsPsych.data.displayData()
    }
});

// prepare the shared context
initContext(jsPsych)
initLocalStorage()

// generate the trials
const saveData = generateSaveResultTrial('json')

const helloTrial = {
    type: htmlKeyboardResponse,
    data: {
        trial_name: 'hello',
    },
    stimulus: 'Hello world!',
    wait_for_key_release: false,
    on_finish: (data) => {
        delete data.stimulus
    },
} satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

jsPsych.run([
    checkBrowserInfo,
    displaySessionId,
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
