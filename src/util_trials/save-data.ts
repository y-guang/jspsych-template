import { TrialType } from 'jspsych'
import htmlKeyboardResponse from '@jspsych/plugin-html-keyboard-response';
import { generateLocalDatetimeFilenameSafeString } from '../util/datetime';
import { getContext, setLocalStorage } from '../app-context';
import rawStimulusTemplate from './save-data.html?raw'
import Handlebars from 'handlebars'

const stimulusTemplate = Handlebars.compile(rawStimulusTemplate)

function generateFileStem(): string {
    const startTime = getContext('startTime')!
    const startTimeString = generateLocalDatetimeFilenameSafeString(startTime)
    const participantId = getContext('sessionId') ?? 'unknown'

    return `${startTimeString}_${participantId}`
}

export function generateSaveResultTrial(
    format: string,
    backupInLocalStorage: boolean = true,
) {
    const trial = {
        type: htmlKeyboardResponse,
        data: {
            trial_name: 'util_save_data',
            format,
        },
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
                    setLocalStorage('experimentResult', data)
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