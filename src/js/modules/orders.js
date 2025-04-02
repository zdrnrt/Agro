import {get_order_calc, get_order_calc_export} from '../service/api';
import {downloadFile} from '../service/tools'
import {format} from 'date-fns';

window.orderOpen = async () => {
  loadingToggle();
  await moduleOpen('./src/html/orders.html')
  .then( () => {
    ordersLoad();
    loadingToggle();
  })
}

window.orderExport = (id) => {
  get_order_calc_export(id)
    .then( (response) => {
      downloadFile(response)
    }  )
    .catch( (error) => {
      alert(`Ошибка скачивания файла с id: ${id}`);
      console.error(error);
    })
} 

window.ordersLoad = (page = 1) => {
  loadingToggle();
  return get_order_calc(page)
    .then( (response) => {
      const { page_count, results } = response.data;
      ordersRowDraw(results);
      ordersUpdateMore({page_count: page_count, page: Number(page) + 1})
    })
    .finally( () => {
      loadingToggle();
    })
}

function ordersRowDraw(list) {
  const table = document.getElementById('ordersTable').querySelector('tbody');
  let template = '';
  for (const el of list){
    template += `
      <tr>
        <td align="center"><button class="btn btn-link p-0" data-id="${el['calc_id']}" onclick="orderExport(${el['calc_id']});"><i class="fa fa-cloud-download-alt fa-2x"></i></button></td>
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
}

function ordersUpdateMore(request){
  const {page_count, page} = request;
  const btn = document.getElementById('ordersMore');
  btn.dataset.page = page;
  if (page_count < page){
    btn.disabled = true;
  }
}