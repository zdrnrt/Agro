import { get_imported_files } from '../service/api';
import { format } from 'date-fns';
import { loadingToggle } from '../blocks/loading';
import { moduleOpen, updateMore, errorShow, errorHide } from '../service/tools';
import { userCheck, userOpen } from '../modules/user';

export function initLoaded() {
  document.getElementById('nav-loaded').addEventListener('click', loadedOpen);
}

export async function loadedOpen() {
  loadingToggle();
  await moduleOpen('./src/html/loaded.html').then(() => {
    document.getElementById('loadedMore').addEventListener('click', loadedMore);
    errorHide();
    loadedLoad();
    loadingToggle();
  });
}

function loadedLoad(page = 1) {
  if (!userCheck()) {
    return;
  }
  loadingToggle();
  return get_imported_files(page)
    .then((response) => {
      const { page_count, results } = response.data;
      loadedRowDraw(results);
      updateMore('loadedMore', {
        page_count: page_count,
        page: Number(page) + 1,
      });
    })
    .catch((error) => {
      if (error.status == 403) {
        userOpen(true);
        return;
      }
      errorShow('Во время загрузки произошла ошибка, попробуйте еще раз');
      console.error('loadedLoad', error);
    })
    .finally(() => {
      loadingToggle();
    });
}

function loadedRowDraw(list) {
  const table = document.getElementById('loadedTable').querySelector('tbody');
  let template = '';
  for (const el of list) {
    template += `<tr>
          <td data-id="id">${el.id}</td>
          <td data-id="filename">${el.filename}</td>
          <td data-id="status">${el.status}</td>
          <td data-id="create_dt">${format(new Date(el.create_dt), 'dd.LL.yyy HH:mm')}</td>
          <td data-id="change_dt">${format(new Date(el.change_dt), 'dd.LL.yyy HH:mm')}</td>
        </tr>`;
  }
  table.insertAdjacentHTML('beforeend', template);
}

function loadedMore(event) {
  const page = event.target.dataset.page;
  loadedLoad(page);
}
