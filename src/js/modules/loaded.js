window.loadedOpen = async () => {
  loadingToggle();
  await moduleOpen('./src/html/loaded.html')
    .then( () => {
      setTimeout(() => {
        loadedRowDraw();
        loadingToggle();
      }, 1500);
    })
}

window.loadedRowDraw = () => {
    const table = document.getElementById('loadedTable').querySelector('tbody');
    table.innerHTML = '';
    const data = [{
      'id': 123,
      'filename': 'file',
      'status': 'success',
      'date': '10.03.2025',
    },
    {
      'id': 321,
      'filename': 'file2',
      'status': 'error',
      'date': '19.03.2025',
    }];

    const arr = Array.from(Array(14).keys());
    let template = ''
    for (let i = 0; i < data.length; i++){
        template += '<tr>';
        template += `<td align="center"><input type="checkbox" class="form-check-input" name="file"></td>`;
        for (const key in data[i]){
          template += `<td>${data[i][key]}</td>`;
        }
        template += '</tr>';
    }
    table.insertAdjacentHTML('beforeend', template);
}