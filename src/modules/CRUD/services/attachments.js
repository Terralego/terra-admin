import Api from '@terralego/core/modules/Api';
import { sanitizeCustomEndpoint } from './utils';

const attachmentRequest = (endpoint, body, method = 'PUT') =>
  Api.request(`${sanitizeCustomEndpoint(endpoint)}/`, { method, body });

export const saveAttachment = attachmentRequest;

export const deleteAttachment = endpoint =>
  attachmentRequest(endpoint, {}, 'DELETE');
