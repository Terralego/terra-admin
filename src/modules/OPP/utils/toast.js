import { Intent, Toaster } from '@blueprintjs/core';

const submitToaster = Toaster.create();

function displayToaster (viewpoint, translationSucess, translationError) {
  submitToaster.show({
    message: viewpoint.id ? translationSucess : translationError,
    intent: viewpoint.id ? Intent.SUCCESS : Intent.DANGER,
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
