export const SUCCESS = 'datasource.refreshStatus.success';
export const WARNING = 'datasource.refreshStatus.warning';
export const ERROR = 'datasource.refreshStatus.error';
export const SYNC_NEEDED = 'datasource.refreshStatus.syncNeeded';
export const PENDING = 'datasource.refreshStatus.pending';
export const DONE = 'datasource.refreshStatus.done';
export const NOT_NEEDED = 'datasource.refreshStatus.notNeeded';
export const IN_PROGRESS = 'datasource.refreshStatus.inProgress';

export default {
  success: SUCCESS,
  warning: WARNING,
  error: ERROR,
  syncNeeded: SYNC_NEEDED,
  pending: PENDING,
  done: DONE,
  notNeeded: NOT_NEEDED,
  inProgress: IN_PROGRESS,
};

export const sourceStatus = {
  0: 'syncNeeded',
  1: 'pending',
  2: 'done',
  3: 'inProgress',
};

export const reportStatus = {
  0: 'success',
  1: 'error',
  2: 'warning',
  3: 'pending',
};
