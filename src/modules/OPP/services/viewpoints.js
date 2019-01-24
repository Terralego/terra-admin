import Api from 'mc-tf-test/modules/Api';

export async function fetchAllViewpoints () {
  return Api.request('viewpoints/');
}

export async function fetchViewpoint (id) {
  return Api.request(`viewpoints/${id}`);
}

export async function editViewpoint (data) {
  return Api.request(`viewpoints/${data.id}`, { method: 'PUT', body: data });
}

export async function createViewpoint (data) {
  return data;
}

export async function saveDataInViewpoint (data) {
  if (data.id) {
    return editViewpoint(data);
  }
  return createViewpoint(data);
}

export async function addImageToViewpoint (data) {
  const formData = new FormData();
  formData.append('label', data.label);
  formData.append('picture.date', data.picture.date);
  formData.append('picture.file', data.picture.file);
  return Api.request(`viewpoints/${data.id}`, { method: 'PUT', body: formData });
}

export default { fetchAllViewpoints, fetchViewpoint, saveDataInViewpoint, addImageToViewpoint };
