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
    buttonToggleLoading(event.submitter);
    const type = event.submitter.dataset.type;
    console.log(type)
    const form = event.target;
    form.classList.add('form--loading');
    const formData = new FormData(form);
    const errorText = form.querySelector('#calculationError');
    errorText.classList.add('d-none');
    let request = {}
    for (const [name, value] of formData){
        request[name] = value;
    }
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
            form.classList.remove('form--loading');
            buttonToggleLoading(event.submitter);
        })
    console.log('request', request);
}

window.calculationRowDraw = () => {
    
    const arr = Array.from(Array(14).keys());
    const length = Math.floor(Math.random() * 10)
    
    const table = document.getElementById('calculationTable').querySelector('tbody');
    table.innerHTML = '';
    let template = ''
    for (let i = 0; i < length; i++){
        template += '<tr>';
        arr.forEach( (el) => { template += `<td>${el}</td>`})
        template += '</tr>';
    }
    table.insertAdjacentHTML('beforeend', template);
}