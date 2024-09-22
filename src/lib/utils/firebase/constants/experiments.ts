/**
 * Names for the experiments that are available to be run in the app.
 */
export const EXPERIMENT_NAMES = {
  TEST_EXPERIMENT_NAME: "test_experiment_name",
};

/**
 * Experiments that are available to be run in the app.
 * This object contains the experiment names and their default values.
 * This object will be set as the default config for the Firebase Remote Config object
 */
export const EXPERIMENTS = {
  [EXPERIMENT_NAMES.TEST_EXPERIMENT_NAME]: "test_experiment_value",
};
