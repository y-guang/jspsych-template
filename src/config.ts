/**
 * Record all experiment config.
 * Typically, you put all theoretical parameters here. E.g. what is in your method section.
 * Put all runtime parameters in the app context.
 */

// TODO: add your own experiment config here

// static field
const debug = false
const experimentId = 'placeholder' // TODO: replace with actual experiment ID
const pixPerDeg = 100 // pixels per degree of visual angle.

// computed

export const config = {
    debug,
    pixPerDeg,
    experimentId,
} as const