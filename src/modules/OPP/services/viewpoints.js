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

export async function createViewpoint ({ label, longitude, latitude, pictureFile, date }) {
  const formData = new FormData();

  const coordinate = JSON.stringify({
    type: 'Point',
    coordinates: [
      +longitude,
      +latitude,
    ],
  });

  formData.append('label', label);
  formData.append('point', coordinate);
  if (date && pictureFile) {
    formData.append('picture.date', date.toISOString());
    formData.append('picture.file', pictureFile);
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
