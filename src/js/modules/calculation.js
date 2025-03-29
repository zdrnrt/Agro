import {post_order_calc, get_order_calc_result, get_order_calc_export, get_order_calc_id } from '../service/api'

(function(){
    moduleOpen('./src/html/calculation.html')
        .then( () => {
            initialData();
        });
})()

function initialData(){
    // TODO загрузка из localStorage
}

/** 
 * выгрузить
 * order_calc -> order_calc_export
 * расчитать
 * order_calc -> order_calc_result
 * 
*/

window.calculationFormSubmit = async (event) => {
    event.preventDefault();
    buttonToggleLoading(event.submitter);
    const type = event.submitter.dataset.type;
    // console.log(type)
    const form = event.target;
    // form.classList.add('form--loading');
    const formData = new FormData(form);
    const statusText = document.getElementById('calculationStatus');
    statusText.classList.add('d-none');
    const errorText = document.getElementById('calculationError');
    errorText.classList.add('d-none');
/*    
    const calculation = await post_order_calc(formData);
    try {
    }
    catch {
        
    }
    finally {
        
    }

    if (type == 'result'){
        const result = await get_order_calc_result(calculation.data.calc_id);
        // return get_order_calc_id(data.calc_id)
    }
    if (type == 'export'){
        const file = await get_order_calc_export(calculation.data.calc_id);
        // return get_order_calc_id(data.calc_id)
    }
*/

    post_order_calc(formData)
        .then( (response) => {
            console.log('post_order_calc', response);
            // calculationRowDraw(response.data);
            return response.data
        })
        .then( (data) => {
            console.log('req', data);
            console.log('type', type);
            statusText.classList.remove('d-none');
            statusText.textContent = `Расчет создан, идет вычисление...`;
            if (type == 'result'){
                // return get_order_calc_result(1234)
                return get_order_calc_result(data.calc_id)
                // return get_order_calc_id(data.calc_id)
            }
            if (type == 'export'){
                return get_order_calc_export(data.calc_id)
                // return get_order_calc_id(data.calc_id)
            }
        })
        .then( (result) => {
            console.log('result', result);
            if (type == 'result'){
                console.log('result', result)
            }
            if (type == 'export'){
                console.log('export', result)
            }
        })
        .catch( (err) => {
            console.log('post_order_calc', err);
            // statusText.classList.add('d-none');
            errorText.classList.remove('d-none');
        })
        .finally( () => {
            form.classList.remove('form--loading');
            buttonToggleLoading(event.submitter);
        })
}

window.calculationRowDraw = (row) => {
    const table = document.getElementById('calculationTable').querySelector('tbody');
    table.innerHTML = '';
    table.insertAdjacentHTML('beforeend', RowDraw(row));
}