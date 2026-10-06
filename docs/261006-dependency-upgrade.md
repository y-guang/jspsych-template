# Dependency upgrade audit (2026-10-06)

## Baseline

The reference is commit `8c27b58e71a35c5a900a07db1d8bf5b20a3c8e51` (2025-04-20).
Versions below were recovered from its `package-lock.json`, rather than inferred from the ranges in `package.json`.
The lockfile records the intended installation; it does not prove which packages were on the machine used for manual validation.

```powershell
git show 8c27b58e71a35c5a900a07db1d8bf5b20a3c8e51:package-lock.json
```

## jsPsych and every installed plugin

Each linked official changelog was checked, including plugins whose version did not change.
The jsPsych versions in the current pnpm lockfile already existed before the TypeScript upgrade; the manifest now reflects those versions.

| Package | Baseline | Current | Changes since baseline and project impact |
| --- | --- | --- | --- |
| [jspsych](https://github.com/jspsych/jsPsych/blob/main/packages/jspsych/CHANGELOG.md) | 8.2.1 | 8.3.0 | 8.2.2 adds a camera recorder MIME default (unused here). 8.2.3 validates parameter types and SELECT options. 8.3.0 adds keycap CSS and optional key-release response handling. |
| [browser-check](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-browser-check/CHANGELOG.md) | 2.1.0 | 2.1.0 | No plugin version change. |
| [call-function](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-call-function/CHANGELOG.md) | 2.1.0 | 2.1.0 | No plugin version change. |
| [fullscreen](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-fullscreen/CHANGELOG.md) | 2.1.0 | 2.1.0 | No plugin version change. |
| [html-button-response](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-html-button-response/CHANGELOG.md) | 2.1.0 | 2.1.0 | No plugin version change. Earlier button layout and `button_html` changes predate the baseline. |
| [html-keyboard-response](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-html-keyboard-response/CHANGELOG.md) | 2.1.0 | 2.2.0 | Adds `wait_for_key_release` (default false) and `rt_key_duration`. See behavior and data details below. |
| [survey-text](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-survey-text/CHANGELOG.md) | 2.1.0 | 2.1.1 | Corrects the response field documentation; no documented response behavior change. Installed but unused by the template timeline. |
| [virtual-chinrest](https://github.com/jspsych/jsPsych/blob/main/packages/plugin-virtual-chinrest/CHANGELOG.md) | 3.1.0 | 3.1.0 | No plugin version change. Calibration and scaling parameters remain unchanged. |

Unchanged plugin versions still execute against the newer jsPsych core; version equality alone is not a complete runtime compatibility guarantee.

## Behavior and data

- Both HTML keyboard trial definitions explicitly set `wait_for_key_release: false`. Responses continue to complete on keydown; `rt` measures time to keydown.
- Completed HTML keyboard trials now include `rt_key_duration`, which is `null` when key-release measurement is disabled. This is an additive export schema change; downstream analysis should allow the new column.
- The updated core clears held-key state on window blur. This avoids a key becoming permanently unavailable when the browser misses its keyup event.
- Installed core source also shows that fractional INT parameters are warned about and truncated. The template uses integer values for `blindspot_reps` and `pixels_per_unit`; its SELECT value `resize_units: 'deg'` is valid.
- The save screen uses the documented scalar `choices: 'NO_KEYS'`. It remains a terminal screen: download happens on load and can be repeated with its button. Its trial record is not included in that download because the trial has not finished. This existing behavior was preserved.
- The hello trial now records `trial_name: 'hello'`. Recorded utility trials retain their `util_` names; custom exported fields remain in snake_case. Utility trials with `record_data: false` remain excluded.
- The three dynamic stimuli retain function evaluation at trial execution. Each uses a documented `@ts-expect-error` for the mismatch between runtime support and the published string-only stimulus type. The other parameters retain their original type checks, and an upstream type fix will make the directive fail as unused. `Partial<TrialType<...>>` is retained because the published types incorrectly require some parameters with null defaults under strict null checking.

## TypeScript

TypeScript changed from baseline 5.8.3 (previous pnpm installation: 5.9.3) to 7.0.2.
The [TypeScript 7 release notes](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/) and [TypeScript 6 migration notes](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-6-0.html) describe the compiler transition.
The project uses the `tsc` CLI, not the compiler's programmatic API. Existing `tsconfig.json` options compile successfully without compatibility flags or weakened checks.
TrialType imports are now type-only, and the save format is limited to `'json' | 'csv'`.

## Validation

- `pnpm install --frozen-lockfile` verifies the final manifest and lockfile.
- `pnpm build` runs TypeScript 7 checking and the Vite 8 production build.
- An ad hoc Node regression check exercised the installed keyboard plugin with the installed core KeyboardListenerAPI and synthetic EventTarget events: keydown completes immediately, RT is numeric, `rt_key_duration` is null, NO_KEYS does not finish the save screen, held-key repeats are ignored, and blur clears held-key state. The display and finish callback were test doubles; this does not establish browser timing precision or visual correctness.
- Vite 8 visual validation was performed by the maintainer before this step.
- Browser validation after these changes remains to be done: keyboard continuation, full calibration and cached-calibration skip, JSON download contents, repeat download, and local backup. No connected browser was available to the agent for this step.
