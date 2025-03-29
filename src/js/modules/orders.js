import {get_order_calc, get_order_calc_export} from '../service/api'

window.orderOpen = async () => {
  loadingToggle();
  await moduleOpen('./src/html/orders.html')
    .then( () => {
      get_order_calc()
        .then((response) => {
          console.log(response.data);
          ordersRowDraw(response.data.results);
        })
        .finally( () => {
          loadingToggle();
        });
    })
}

window.orderExport = (id) => {
  get_order_calc_export(id)
    .then( (response) => {
      console.log('orderExport', response)
    }  )
} 


const rowDraw = (row) => {
  const template = `
      <tr>
        <td align="center"><button class="btn btn-link p-0" data-id="${row['calc_id']}" onclick="orderExport(${row['calc_id']});"><i class="fa fa-cloud-download-alt fa-2x"></i></button></td>
        <td>${row['calc_date']}</td>
        <td>${row['status']}</td>
        <td>${row['upper_bound_coeff']}</td>
        <td>${row['lower_bound_coeff']}</td>
        <td>${row['trust_remains']}</td>
        <td>${row['z_coeff_fluctuations']}</td>
        <td>${row['z_coeff_under_forecast']}</td>
        <td>${row['max_safety_stock_days']}</td>
        <td>${row['max_safety_stock_percent']}</td>
        <td>${row['delivery_frequency']}</td>
        <td>${row['minimum_order_quantity_percent']}</td>
        <td>${row['minimum_order_percent']}</td>
        <td>${row['log'] || ''}</td>
      </tr>
    `;
  return template
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