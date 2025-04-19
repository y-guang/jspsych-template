import { TrialType } from 'jspsych'
import virtualChinrest from '@jspsych/plugin-virtual-chinrest';
import callFunction from '@jspsych/plugin-call-function';
import htmlButtonResponse from '@jspsych/plugin-html-button-response';
import { config } from '../config';
import { getContext, setLocalStorage, getLocalStorage } from '../app-context';
import Handlebars from 'handlebars'
import rawAskSkipChinrestTemplate from './calibrate-ask-skip-chinrest.html?raw'

let skipChinrest = false
let scaleFactor: number | null = null

export const calibrateChinrest = {
    type: virtualChinrest,
    data: {
        trial_name: 'util_calibrate_chinrest'
    },
    blindspot_reps: 3,
    resize_units: "deg",
    pixels_per_unit: config.pixPerDeg,
    on_finish: (data) => {
        scaleFactor = data.scale_factor

        // setup local storage for askSkipChinrest
        setLocalStorage('scaleFactor', data.scale_factor)
        setLocalStorage('viewDistMm', data.view_dist_mm)
    }
} satisfies Partial<TrialType<typeof virtualChinrest.info>>

/**
 * Purely util trial, scale content to the scale factor.
 * If no calibration was performed, it will check local storage for the scale factor.
 * Otherwise, it will skip the scaling.
 */
export const scaleContent = {
    type: callFunction,
    data: {
        trial_name: 'util_scale_content',
    },
    func: () => {
        const jsPsych = getContext('jsPsych')

        // if no calibration, use scaleFactor from local storage
        if (!scaleFactor) {
            scaleFactor = getLocalStorage('scaleFactor') as number | null
        }

        if (scaleFactor) {
            const el = jsPsych?.getDisplayElement()
            if (el) {
                el.style.transform = `scale(${scaleFactor})`
            }
        } else {
            console.warn('No scale factor found. Skipping scaling content.')
        }
    },
    on_finish: (data) => {
        data.scale_factor = scaleFactor
    }
} satisfies Partial<TrialType<typeof callFunction.info>>


/**
 * ask if the user wants to skip chinrest calibration.
 * Assuming no calibrateChinrest trial was performed before.
 */
const askSkipChinrest = {
    type: htmlButtonResponse,
    data: {
        trial_name: 'util_ask_skip_chinrest',
    },
    // @ts-ignore
    stimulus: () => {
        const template = Handlebars.compile(rawAskSkipChinrestTemplate)

        // get local storage values
        const viewDistMm = getLocalStorage('viewDistMm') as number | null
        const scaleFactor = getLocalStorage('scaleFactor') as number | null

        // generate prompt
        let prompt = ''
        if (viewDistMm && scaleFactor) {
            prompt = `Otherwise, <strong>previous calibration</strong> will be used: viewing distance = ${(viewDistMm / 10).toFixed(2)} cm, scale factor = ${(scaleFactor * 100).toFixed(2)}%`
        } else {
            prompt = 'NO calibration was performed before. <strong>Strongly recommended to perform calibration.</strong>'
        }

        return template({ prompt })
    },
    choices:['Calibration', 'Skip calibration'],
    on_finish: (data) => {
        if (data.response === 1) {
            skipChinrest = true
        } else {
            skipChinrest = false
        }
        delete data.stimulus
    }
} satisfies Partial<TrialType<typeof htmlButtonResponse.info>>

const conditionalCalibrateChinrest = {
    timeline: [calibrateChinrest],
    conditional_function: () => {
        return !skipChinrest
    },
}

export const optionalChinrestCalibration = {
    timeline: [
        askSkipChinrest,
        conditionalCalibrateChinrest,
        scaleContent,
    ]
}