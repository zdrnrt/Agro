import {check_auth, post_order_calc } from '../service/api'

(function(){
    moduleOpen('./src/html/calculation.html')
        .then( () => {
            initialData();
        });
})()

function initialData(){
    // TODO загрузка из localStorage
}

window.calculationFormSubmit = (event) => {
    event.preventDefault();
    // buttonToggleLoading(event.submitter);
    const type = event.submitter.dataset.type;
    // console.log(type)
    const form = event.target;
    // form.classList.add('form--loading');
    const formData = new FormData(form);
    const errorText = form.querySelector('#calculationError');
    errorText.classList.add('d-none');
    let request = {}
    for (const [name, value] of formData){
        request[name] = value;
    }

    // check_auth();

    post_order_calc(formData)
        .then( (response) => {
            console.log('post_order_calc', response);
            calculationRowDraw(response.data);
        })
        .catch( (err) => {
            console.log('post_order_calc', err);
            errorText.classList.remove('d-none');
        })
        .finally( () => {
            form.classList.remove('form--loading');
            buttonToggleLoading(event.submitter);
        })
    /*
    new Promise( (resolve, reject) => {
        setTimeout(() => {
            const random = Math.floor(Math.random() * 10);
            console.log(random)
            if (random > 5){
                resolve(request);
            } else {
                reject('error!!!!')
            }
        }, 1000);
    })
    .then( (data) => {
        console.log('then', data);
        calculationRowDraw();
    })
    .catch( (error) => {
        console.log(error);
        errorText.classList.remove('d-none');
    })
    .finally( () => {
    })
    */
    // console.log('request', request);
}

window.calculationRowDraw = (row) => {
    const table = document.getElementById('calculationTable').querySelector('tbody');
    table.innerHTML = '';
    table.insertAdjacentHTML('beforeend', RowDraw(row));
}