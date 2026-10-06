# jsPsych template

My jsPsych template for creating experiments.

## Usage

General usage:

- Edit the `./src/main.ts` and `./src/style.css` files to customize the experiment.
- Run the `pnpm dev` command to start previewing the experiment in your browser.
- After you are satisfied with the experiment, run the `pnpm build` command to create a static version of the experiment.
- Publish the contents of the `./dist` folder to your web server.

### Commands

```bash
# Install dependencies
pnpm install --frozen-lockfile

# Run the development server
pnpm dev

# Build for production
pnpm build
```

## Conventions

### Dependency Updates

Pin jsPsych and plugin versions; upgrade manually after reviewing changelogs and validating experiment behavior and exported data.

### Variable Naming

- CamelCase is used for all internal variables and functions.
- All field in the data object should be snake_case. As analysis languages like R and Python prefer snake_case for variable names.

### Trial Naming

All trial should contains a data field called `trial_name` which should be a unique name for the trial definition. This can facilitate data analysis later on.

- All utility trials should be prefixed with `util_`. So later on you can filter them out easily.
