import { post_order_calc, get_order_calc_result, get_order_calc_export, get_order_calc_id } from '../service/api';
import { format } from 'date-fns';
import { buttonToggleLoading } from '../blocks/button';
import { loadingToggle } from '../blocks/loading';
import { moduleOpen, downloadFile, errorShow, errorHide, updateMore } from '../service/tools';
import { userCheck, userOpen } from './user';

export function initCalculation() {
  document.getElementById('nav-calculation').addEventListener('click', claclulationOpen);
  claclulationOpen();
}

function claclulationOpen() {
  loadingToggle();
  moduleOpen('./src/html/calculation.html').then(() => {
    document.querySelector('[name="calc_date"]').valueAsDate = new Date();
    document.getElementById('form').addEventListener('submit', calculationFormSubmit);
    document.getElementById('calculationMore').addEventListener('click', calculationMore);
    document.getElementById('export').addEventListener('click', calculationExport);
    errorHide();
    loadingToggle();
    calculationCheck();
  });
}

function calculationCheck() {
  if (!userCheck()) {
    return;
  }

  if (!!localStorage.getItem('calculationInProgress')) {
    calculationStatus();
    document.getElementById('calculationLoading').classList.remove('d-none');
    return;
  }
  if (!!localStorage.getItem('calculationId')) {
    calculationResult();
    return;
  }
}

function calculationStatus() {
  const id = localStorage.getItem('calculationId');
  if (!id) {
    return;
  }
  clearTimeout(window.calculationTimer);
  claclulationInfoShow();
  get_order_calc_id(id)
    .then((response) => {
      if (response.data.status == 'complete' || response.data.status == 'error') {
        if (document.getElementById('calculationLoading')) {
          claclulationInfoHide();
          document.getElementById('calculationLoading').classList.add('d-none');
          if (response.data.status == 'complete') {
            calculationResult();
            localStorage.removeItem('calculationInProgress');
          } else {
            errorShow('Во время расчета произошла ошибка, попробуйте еще раз');
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
      claclulationInfoHide();
      document.getElementById('calculationLoading').classList.add('d-none');
      if (error.status == 403) {
        userOpen(true);
        return;
      }
      errorShow('Во время расчета произошла ошибка, попробуйте еще раз');
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
  document.getElementById('export').classList.add('d-none');
  localStorage.removeItem('calculationId');
  localStorage.removeItem('calculationInProgress');
  buttonToggleLoading(event.submitter);
  claclulationInfoHide();
  /*
  calculationCheck();
  form.classList.remove('form--loading');
  buttonToggleLoading(event.submitter);
  */
  document.getElementById('calculationLoading').classList.remove('d-none');
  const form = event.target;
  form.classList.add('form--loading');
  const formData = new FormData(form);
  localStorage.setItem('calculationInProgress', event.submitter.dataset.type);

  document.getElementById('result').classList.add('d-none');
  document.getElementById('result').querySelector('tbody').innerHTML = '';
  errorHide();

  post_order_calc(formData)
    .then((response) => {
      const { data } = response;
      localStorage.setItem('calculationId', data.calc_id);
      calculationCheck(data.calc_id);
    })
    .catch((error) => {
      claclulationInfoHide();
      document.getElementById('calculationLoading').classList.add('d-none');
      localStorage.removeItem('calculationInProgress');
      if (error.status == 403) {
        userOpen(true);
        return;
      }
      errorShow('Во время расчета произошла ошибка, попробуйте еще раз');
    })
    .finally(() => {
      form.classList.remove('form--loading');
      buttonToggleLoading(event.submitter);
    });
}

function calculationResult(page = 1) {
  const id = localStorage.getItem('calculationId');
  get_order_calc_result(id, page)
    .then((response) => {
      const { page_count, results } = response.data;
      calculationRowDraw(results);
      document.getElementById('result').classList.remove('d-none');
      document.getElementById('export').classList.remove('d-none');
      updateMore('calculationMore', {
        page_count: page_count,
        page: Number(page) + 1,
      });
    })
    .catch((error) => {
      if (error.status == 403) {
        userOpen(true);
        return;
      }
      errorShow('Во время расчета произошла ошибка, попробуйте еще раз');
      console.error('calculationResult', error);
    });
}

function calculationExport() {
  const id = localStorage.getItem('calculationId');
  get_order_calc_export(id)
    .then((response) => {
      downloadFile(response);
    })
    .catch((error) => {
      if (error.status == 403) {
        userOpen(true);
        return;
      }
      errorShow(`Ошибка скачивания файла номер расчета ${id}`);
      console.error('ordersExport', error);
    })
    .finally(() => {
      document.getElementById('calculationLoading').classList.add('d-none');
    });
}

function calculationRowDraw(list) {
  const table = document.getElementById('table').querySelector('tbody');
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

function claclulationInfoShow() {
  if (localStorage.getItem('calculationId')){
    const calculationInfo = document.getElementById('info');
    const calculationId = calculationInfo.querySelector('#id');
    calculationInfo.classList.remove('d-none');
    calculationId.innerHTML = localStorage.getItem('calculationId');
  }
}

function claclulationInfoHide() {
  document.getElementById('info').classList.add('d-none');
}

function calculationMore(event) {
  const page = event.target.dataset.page;
  calculationResult(page);
}
