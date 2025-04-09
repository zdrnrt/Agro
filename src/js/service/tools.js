export function downloadFile(response) {
  const { headers, data } = response;

  const name = headers['content-disposition'].split('; ')[1].replaceAll('"', '').split('=')[1];

  const url = window.URL.createObjectURL(new Blob([data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', name);
  document.body.appendChild(link);
  link.click();
  link.remove();
}

export function moduleOpen(path) {
  return fetch(path)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Реакция сети' + response.statusText);
      }
      return response.text();
    })
    .then((html) => {
      document.getElementById('content').innerHTML = html;
    })
    .catch((error) => {
      console.error('Возникла проблема с операцией выборки:', error);
    });
}

export function errorShow(text) {
  const errorText = document.getElementById('error');
  errorText.classList.remove('d-none');
  errorText.textContent = text;
}
export function errorHide() {
  document.getElementById('error').classList.add('d-none');
}

export function updateMore(id, request) {
  const elem = document.getElementById(id);
  const { page_count, page } = request;
  elem.dataset.page = page;
  if (page_count < page) {
    elem.disabled = true;
  }
}
