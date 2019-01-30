import Api from 'mc-tf-test/modules/Api';

export async function fetchAllViewpoints () {
  return Api.request('viewpoints/');
}

export async function fetchViewpoint (id) {
  return Api.request(`viewpoints/${id}`);
}

export async function updateViewpoint (data) {
  return Api.request(`viewpoints/${data.id}`, { method: 'PUT', body: data });
}

export async function createViewpoint (data) {
  const formData = new FormData();
  const coordinate = `{
    "type": "Point",
    "coordinates": [
      ${data.longitude},
      ${data.latitude}
    ]
  }`;
  formData.append('label', data.label);
  formData.append('point', coordinate);
  if (data.datePicture && data.pictureFile) {
    formData.append('picture.date', data.datePicture);
    formData.append('picture.file', data.pictureFile);
  }
  return Api.request('viewpoints/', { method: 'POST', body: formData });
}

export async function saveViewpoint (data) {
  if (data.id) {
    return updateViewpoint(data);
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

export default { fetchAllViewpoints, fetchViewpoint, saveViewpoint, addImageToViewpoint };
