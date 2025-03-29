window.loadedOpen = async () => {
  loadingToggle();
  await moduleOpen('./src/html/loaded.html')
    .then( () => {
      loadedRowDraw();
      loadingToggle();
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
    let template = ''
    for (const el of data){
        template += `<tr>
          <td align="center" data-id="download"><button class="btn btn-link p-0" data-id="${el.id}" onclick="loadedExport(1);"><i class="fa fa-cloud-download-alt fa-2x"></i></button></td>
          <td data-id="id">${el.id}</td>
          <td data-id="filename">${el.filename}</td>
          <td data-id="status">${el.status}</td>
          <td data-id="date">${el.date}</td>
        </tr>`;
    }
    table.insertAdjacentHTML('beforeend', template);
}