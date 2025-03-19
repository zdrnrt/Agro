window.orderOpen = async () => {
  loadingToggle();
  await moduleOpen('./src/html/orders.html')
    .then( () => {
      setTimeout(() => {
        ordersRowDraw();
        loadingToggle();
      }, 1000);
    })
}

window.ordersRowDraw = () => {
    const table = document.getElementById('ordersTable').querySelector('tbody');
    table.innerHTML = '';
    const data = [{
      'download_link': '#',
      'calc_date': '07.03.2024',
      'calc status': 'complete',
      'upper coeff': 10,
      'lower coeff': 1,
      'trust': 1,
      'z': 40,
      'asd4': '10%',
      'm': 2,
      'm1': 5,
      'm2': 15,
      'm3': 15,
      'safety stock calc': 'SafetyStockCalc',
      'minimum order quantity percent': '20',
      'minimum order percent': '50',
      'delivery frequency': '30',
    },
    {
      'download_link': '#',
      'calc_date': '17.03.2024',
      'calc status': 'complete',
      'safety stock calc': 'SafetyCalc',
      'minimum order quantity percent': '25',
      'minimum order percent': '10',
      'delivery frequency': '40',
      'upper coeff': 10,
      'lower coeff': 1,
      'trust': 1,
      'z': 40,
      'asd4': '10%',
      'm': 2,
      'm1': 5,
      'm2': 15,
      'm3': 15,
    }];

    const arr = Array.from(Array(14).keys());
    let template = ''
    for (let i = 0; i < data.length; i++){
        template += '<tr>';
        for (const key in data[i]){
          if (key === 'download_link'){
            template += `<td align="center"><a href="${data[i][key]}"><i class="fa fa-cloud-download-alt fa-2x"></i></a></td>`;
            continue
          }
          template += `<td>${data[i][key]}</td>`;
        }
        template += '</tr>';
    }
    table.insertAdjacentHTML('beforeend', template);
}