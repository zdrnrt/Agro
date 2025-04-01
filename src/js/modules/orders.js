import {get_order_calc, get_order_calc_export} from '../service/api';
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
      console.log('orderExport', response)
    }  )
} 

window.ordersLoad = (page = 1) => {
/*
  get_order_calc()
  .then((response) => {
    console.log(response.data);
    ordersRowDraw(response.data.results);
  })
  .finally( () => {
    loadingToggle();
  });
*/
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

const ordersRowDraw = (list) => {
  const table = document.getElementById('ordersTable').querySelector('tbody');
  let template = '';
  for (const el of list){
    template += `
      <tr>
        <td align="center"><button class="btn btn-link p-0" data-id="${el['calc_id']}" onclick="orderExport(${el['calc_id']});"><i class="fa fa-cloud-download-alt fa-2x"></i></button></td>
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

window.ordersRowDraw = (list) => {
    const table = document.getElementById('ordersTable').querySelector('tbody');
    table.innerHTML = '';
    let template = '';
    list.forEach(row => {
      template += rowDraw(row);
    });
    table.insertAdjacentHTML('beforeend', template);
}