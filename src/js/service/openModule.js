/*
  тип для данных открытия модуля
  type request = {
    path: './src/html/template.html',
    callback: [ fn1, fn2, fn3 ]
  }
*/
window.moduleOpen = async function(path) {
  fetch(path)
      .then(response => {
          if (!response.ok) {
              throw new Error('Реакция сети' + response.statusText);
          }
          return response.text(); 
      })
      .then(html => {
          document.getElementById('content').innerHTML = html;
      })
      .catch(error => {
          console.error('Возникла проблема с операцией выборки:', error);
      });
}