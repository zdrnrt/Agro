import { login, get_check_auth, logout } from '../service/api';
import { buttonToggleLoading } from '../blocks/button';
import { Modal } from 'bootstrap';
import { loadingToggle } from '../blocks/loading';

export function initLogin() {
  document.getElementById('userForm').addEventListener('submit', uesrSubmit);
  document.getElementById('userLogout').addEventListener('click', userLogout);
  // userCheck();
}

// fICYtiaGeOpE

function userCheck() {
  // loadingToggle();
  get_check_auth()
    .then((response) => {
      if (response.status == 200) {
        setLogin(response.data.result);
        return;
      }
      Modal.getOrCreateInstance(document.getElementById('userModal')).show();
      console.log('userCheck response', response);
    })
    .catch((error) => {
      Modal.getOrCreateInstance(document.getElementById('userModal')).show();
      console.error('userCheck error', error);
    })
    .finally(() => {
      // loadingToggle();
    });
}

function uesrSubmit(event) {
  event.preventDefault();
  buttonToggleLoading(event.submitter);
  const form = event.target;
  form.classList.add('form--loading');
  const formData = new FormData(form);
  const errorText = document.getElementById('userFormError');
  errorText.classList.add('d-none');
  login(formData)
    .then((response) => {
      console.log('uesrSubmit response', response);
      if (response.status != 200) {
        errorText.textContent = response.data.error || 'Ошибка авторизации, проверьте логин и пароль';
        return;
      }
      form.reset();
      setLogin(response.data.result);
      Modal.getOrCreateInstance(document.getElementById('userModal')).hide();
    })
    .catch((error) => {
      console.log('userSubmit error', error);
      errorText.classList.remove('d-none');
      errorText.textContent = 'Ошибка авторизации, проверьте логин и пароль';
    })
    .finally(() => {
      form.classList.remove('form--loading');
      buttonToggleLoading(event.submitter);
    });
}

function setLogin(name) {
  document.getElementById('user').classList.remove('d-none');
  document.getElementById('userName').textContent = name;
}

function userLogout() {
  loadingToggle();
  logout()
    .then((response) => {
      if (response.status == 200) {
        document.getElementById('user').classList.add('d-none');
        Modal.getOrCreateInstance(document.getElementById('userModal')).show();
      }
    })
    .catch((error) => {
      console.error('userLogout error', error);
    })
    .finally(() => {
      loadingToggle();
    });
}
