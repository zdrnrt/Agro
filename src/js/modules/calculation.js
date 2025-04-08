import { post_order_calc, get_order_calc_result, get_order_calc_export, get_order_calc_id } from '../service/api';
import { format } from 'date-fns';
import { buttonToggleLoading } from '../blocks/button';
import { moduleOpen, downloadFile } from '../service/tools';
import { userCheck } from './user';

export function initCalculation() {
  document.getElementById('nav-calculation').addEventListener('click', claclulationOpen);
  claclulationOpen();
}

function claclulationOpen() {
  moduleOpen('./src/html/calculation.html').then(() => {
    document.querySelector('[name="calc_date"]').valueAsDate = new Date();
    document.getElementById('form').addEventListener('submit', calculationFormSubmit);
    document.getElementById('export').addEventListener('click', calculationExport);

    calculationCheck();
  });
}

function calculationCheck() {
  if (!userCheck()) {
    return;
  }

  if (!!localStorage.getItem('calculationInProgress')) {
    calculationStatus();
    document.getElementById('loading').classList.remove('d-none');
    return;
  }
  if (!!localStorage.getItem('calculationId')) {
    calculationResult();
    return;
  }
}

function calculationStatus() {
  const id = localStorage.getItem('calculationId');
  clearTimeout(window.calculationTimer);
  get_order_calc_id(id)
    .then((response) => {
      if (response.data.status == 'complete' || response.data.status == 'error') {
        localStorage.removeItem('calculationInProgress');
        if (document.getElementById('loading')) {
          document.getElementById('loading').classList.add('d-none');
          if (response.data.status == 'complete') {
            calculationResult();
          } else {
            calculationError('Во время расчета произошла ошибка, попробуйте еще раз');
          }
        }
      } else {
        window.calculationTimer = setTimeout(() => {
          calculationStatus();
        }, 5000);
      }
      // response.data.results.calc_id
    })
    .catch((error) => {
      console.error('calculationStatus', error);
      localStorage.removeItem('calculationInProgress');
    });
  // if (!!localStorage.getItem('calculation')){
  // document.getElementById('Loading').classList.remove('d-none');
  // }
}

function calculationFormSubmit(event) {
  event.preventDefault();
  clearTimeout(window.calculationTimer);
  if (!userCheck()) {
    return;
  }
  localStorage.removeItem('calculationId');
  localStorage.removeItem('calculationInProgress');
  buttonToggleLoading(event.submitter);
  document.getElementById('export').classList.add('d-none');
  /*
  calculationCheck();
  form.classList.remove('form--loading');
  buttonToggleLoading(event.submitter);
  */
  document.getElementById('loading').classList.remove('d-none');
  const form = event.target;
  form.classList.add('form--loading');
  const formData = new FormData(form);
  localStorage.setItem('calculationInProgress', 1);

  const errorText = document.getElementById('error');
  errorText.classList.add('d-none');

  post_order_calc(formData)
    .then((response) => {
      const { data } = response;
      localStorage.setItem('calculationId', data.calc_id);
      claclulationInfoToggle();
      calculationCheck(data.calc_id);
      console.log('data', data);
    })
    .catch((error) => {
      // console.log('post_order_calc', error);
      if (error.status == 403) {
        calculationError('Ошибка авторизации, попробуйте переавторизоваться');
        return;
      }
      calculationError('Во время расчета произошла ошибка, попробуйте еще раз');
      localStorage.removeItem('calculationInProgress');
    })
    .finally(() => {
      form.classList.remove('form--loading');
      buttonToggleLoading(event.submitter);
    });
}

function calculationResult() {
  const id = localStorage.getItem('calculationId');
  get_order_calc_result(id).then((response) => {
    calculationRowDraw(response.data.results);
    document.getElementById('table').classList.remove('d-none');
    document.getElementById('table').classList.remove('d-none');
    document.getElementById('export').classList.remove('d-none');
  });
}

function calculationExport() {
  const id = localStorage.getItem('calculationId');
  get_order_calc_export(id)
    .then((response) => {
      downloadFile(response);
    })
    .catch((error) => {
      alert(`Ошибка скачивания файла с id: ${id}`);
      console.error('ordersExport', error);
    })
    .finally(() => {
      document.getElementById('loading').classList.add('d-none');
    });
}

function calculationError(text) {
  const errorText = document.getElementById('error');
  errorText.classList.remove('d-none');
  errorText.textContent = text;
}

function calculationRowDraw(list) {
  const table = document.getElementById('table').querySelector('tbody');
  table.innerHTML = '';
  let template = '';
  for (const el of list) {
    template += `
          <tr>
            <td>${format(new Date(el['calc_date']), 'dd.LL.yyy')}</td>
            <td>${el['status'] || ''}</td>
            <td>${el['division'] || ''}</td>
            <td>${el['code'] || ''}</td>
            <td>${el['nomenclature'] || ''}</td>
            <td>${el['unit'] || ''}</td>
            <td>${el['nomenclature_group'] || ''}</td>
            <td>${el['expiration'] || ''}</td>
            <td>${el['shipment'] || ''}</td>
            <td>${el['minimum_batch'] || ''}</td>
            <td>${el['final_forecast_sum'] || ''}</td>
            <td>${el['safety_stock_expiration_days'] || ''}</td>
            <td>${el['safety_stock_stock_standart'] || ''}</td>
            <td>${el['final_order_qty'] || ''}</td>
            <td>${el['dds'] || ''}</td>
          </tr>
        `;
  }
  table.insertAdjacentHTML('beforeend', template);
}

function claclulationInfoToggle() {
  const calculationInfo = document.getElementById('info');
  const calculationId = calculationInfo.querySelector('#id');
  calculationInfo.classList.toggle('d-none');
  calculationId.innerHTML = localStorage.getItem('calculationId') || '&mdash;';
}
