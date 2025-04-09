import { get_order_calc, get_order_calc_export } from '../service/api';
import { downloadFile } from '../service/tools';
import { format } from 'date-fns';
import { loadingToggle } from '../blocks/loading';
import { moduleOpen, updateMore, errorShow, errorHide } from '../service/tools';
import { userCheck, userOpen } from './user';

export function initOrders() {
  document.getElementById('nav-orders').addEventListener('click', ordersOpen);
}

function ordersOpen() {
  loadingToggle();
  moduleOpen('./src/html/orders.html').then(() => {
    document.getElementById('ordersMore').addEventListener('click', ordersMore);
    errorHide();
    ordersLoad();
    loadingToggle();
  });
}

function ordersExport(event) {
  errorHide();
  const id = event.target.closest('[data-id]').dataset.id;
  get_order_calc_export(id)
    .then((response) => {
      downloadFile(response);
    })
    .catch((error) => {
      if (error.status == 403) {
        userOpen(true);
        return;
      }
      errorShow('Во время загрузки произошла ошибка, попробуйте еще раз');
      alert(`Ошибка скачивания файла с id: ${id}`);
      console.error('ordersExport', error);
    });
}

function ordersLoad(page = 1) {
  errorHide();
  if (!userCheck()) {
    return;
  }

  loadingToggle();
  get_order_calc(page)
    .then((response) => {
      const { page_count, results } = response.data;
      ordersRowDraw(results);
      updateMore('ordersMore', {
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
      console.error('ordersLoad', error);
    })
    .finally(() => {
      loadingToggle();
    });
}

function ordersRowDraw(list) {
  const table = document.getElementById('ordersTable').querySelector('tbody');
  let template = '';
  for (const el of list) {
    template += `
    <tr>
        <td align="center"><button class="btn btn-link p-0" data-id="${el['calc_id']}" ${el['status'] != 'complete' ? 'disabled' : ''}><i class="fa fa-cloud-download-alt fa-2x"></i></button></td>
        <td>${el['calc_id']}</td>
        <td>${format(new Date(el['calc_date']), 'dd.LL.yyy')}</td>
        <td>${el['status']}</td>
        <td>${el['upper_bound_coeff']}</td>
        <td>${el['lower_bound_coeff']}</td>
        <td>${el['trust_remains']}</td>
        <td>${el['z_coeff_fluctuations']}</td>
        <td>${el['z_coeff_under_forecast']}</td>
        <td>${el['max_safety_stock_days']}</td>
        <td>${el['max_safety_stock_percent']}</td>
        <td>${el['delivery_frequency']}</td>
        <td>${el['minimum_order_quantity_percent']}</td>
        <td>${el['minimum_order_percent']}</td>
        <td style="max-width: 220px;" title="${el['log'] || ''}">${el['log'] || ''}</td>
      </tr>
    `;
  }
  table.insertAdjacentHTML('beforeend', template);
  for (const btn of table.querySelectorAll('[data-id].btn-link')) {
    btn.addEventListener('click', ordersExport);
  }
}

function ordersMore(event) {
  const page = event.target.dataset.page;
  ordersLoad(page);
}
