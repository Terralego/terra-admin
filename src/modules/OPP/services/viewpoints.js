import Api from 'mc-tf-test/modules/Api';

export async function fetchViewpoints ({ data = {}, itemsPerPage = 10, page = 1 }) {
  if (data) {
    return Api.request('viewpoints/', {
      querystring: {
        ...data,
        page_size: itemsPerPage,
        page,
      },
    });
  }
  return Api.request('viewpoints/', { querystring: { page_size: itemsPerPage, page } });
}

export async function fetchViewpoint (id) {
  return Api.request(`viewpoints/${id}`);
}

export async function updateViewpoint (data) {
  const point = {
    type: 'Point',
    coordinates: [
      +data.geometry.coordinates[0],
      +data.geometry.coordinates[1],
    ],
  };

  return Api.request(`viewpoints/${data.id}`, { method: 'PUT', body: { ...data, point } });
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
  const point = JSON.stringify({
    type: 'Point',
    coordinates: [
      +data.geometry.coordinates[0],
      +data.geometry.coordinates[1],
    ],
  });

  formData.append('label', data.label);
  formData.append('point', point);
  formData.append('picture.date', data.date.toISOString());
  formData.append('picture.file', data.pictureFile);
  return Api.request(`viewpoints/${data.id}`, { method: 'PUT', body: formData });
}

export default {
  fetchViewpoints,
  fetchViewpoint,
  saveViewpoint,
  addImageToViewpoint,
};
