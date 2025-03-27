import {get_order_calc, get_order_calc_id} from '../service/api'

window.orderOpen = async () => {
  loadingToggle();
  await moduleOpen('./src/html/orders.html')
    .then( () => {
      // get_order_calc()
        // .then((response) => {
          // console.log(response.data);
          // ordersRowDraw(response.data.results);
        // })
        // .finally( () => {
          loadingToggle();
        // });
    })
}

window.orderExport = (id) => {
  get_order_calc_id(id)
    .then( (response) => {
      console.log('orderExport', response)
    }  )
} 

window.ordersRowDraw = (list) => {
    const table = document.getElementById('ordersTable').querySelector('tbody');
    table.innerHTML = '';
    let template = '';
    list.forEach(row => {
      template += RowDraw(row);
    });
    table.insertAdjacentHTML('beforeend', template);
}