import { Intent, Toaster } from '@blueprintjs/core';

const submitToaster = Toaster.create();

function displayToaster (viewpoint, translationSucess, translationError) {
  submitToaster.show({
    message: viewpoint.id ? translationSucess : translationError,
    intent: viewpoint.id ? Intent.SUCCESS : Intent.DANGER,
  });
}

export const toast = {
  submitToaster,
  displayToaster,
};

export default { toast };
