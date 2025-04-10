import { TrialType } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { getContext } from '../app-context';
import rawStimulusTemplate from './save-data.html?raw'
import Handlebars from 'handlebars'

function generateFilenameSafeISOString(date: Date): string {
    return date.toISOString()
        .replace(/:/g, '-')
        .replace('T', '_')
}

const stimulusTemplate = Handlebars.compile(rawStimulusTemplate)

function generateFileStem(): string {
    const startTime = getContext('startTime')!
    const startTimeString = generateFilenameSafeISOString(startTime)
    const participantId = getContext('participantId') ?? 'unknown'

    return `${startTimeString}_${participantId}`
}

export function generateSaveResultTrial(
    format: string,
    backupInLocalStorage: boolean = true,
) {
    const trial = {
        type: htmlKeyboardResponse,
        // @ts-ignore
        stimulus: () => {
            return stimulusTemplate({
                format,
            })
        },
        choices: ["NO_KEYS"],
        on_load: () => {
            const jsPsych = getContext('jsPsych')!
            const filename = `${generateFileStem()}.${format}`

            if (backupInLocalStorage) {
                try {
                    const data = jsPsych.data.get().json()
                    localStorage.setItem('jsPsychExperimentResult', data)
                } catch (e) {
                    console.warn('Failed to backup data to localStorage', e)
                }
            }

            function saveFile() {
                jsPsych.data.get().localSave(format, filename)
            }

            saveFile()
            const btn = document.getElementById('save-data-btn')!
            btn.addEventListener('click', saveFile)
        },
    } satisfies Partial<TrialType<typeof htmlKeyboardResponse.info>>

    return trial
}