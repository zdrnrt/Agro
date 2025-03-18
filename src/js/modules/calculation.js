(function(){
    moduleOpen('./src/html/calculation.html');
})()

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
        if (Math.floor(Math.random() * 10) > 5){
            resolve(request);
        } else {
            reject('error!!!!')
        }
    })
        .then( (data) => {
            console.log('then', data);
            setTimeout( () => {
                calculationRowDraw();
            }, 1000)
        })
        .catch( (error) => {
            console.log(error);
            errorText.classList.remove('d-none');
        })
        .finally( () => {
            setTimeout(() => {
                form.classList.remove('form--loading');
                buttonToggleLoading(event.submitter);
            }, 1000);
        })
    console.log(request);
}

window.calculationRowDraw = () => {
    const table = document.getElementById('calculationTable').querySelector('tbody');
    table.innerHTML = '';
    const arr = Array.from(Array(14).keys());
    let template = ''
    for (let i = 0; i < 6; i++){
        template += '<tr>';
        arr.forEach( (el) => { template += `<td>${el}</td>`})
        template += '</tr>';
    }
    table.insertAdjacentHTML('beforeend', template);
}