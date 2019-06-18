import { Intent, Toaster } from '@blueprintjs/core';

const submitToaster = Toaster.create();

function displayToaster (data, translationSuccess, translationError) {
  submitToaster.show({
    message: data.id ? translationSuccess : translationError,
    intent: data.id ? Intent.SUCCESS : Intent.DANGER,
  });
}

function displayError (translationError) {
  submitToaster.show({
    message: translationError,
    intent: Intent.DANGER,
  });
}

export const toast = {
  submitToaster,
  displayToaster,
  displayError,
};

export default { toast };
