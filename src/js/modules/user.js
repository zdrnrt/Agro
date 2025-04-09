import { login, get_check_auth, logout } from '../service/api';
import { buttonToggleLoading } from '../blocks/button';
import { Modal } from 'bootstrap';
import { loadingToggle } from '../blocks/loading';

export function initUser() {
  document.getElementById('userForm').addEventListener('submit', userSubmit);
  document.getElementById('userLogout').addEventListener('click', userLogout);
  // userCheck();
}

export function userCheck() {
  if (localStorage.getItem('user')) {
    setLogin();
    return true;
  }
  get_check_auth()
    .then((response) => {
      if (response.status == 200) {
        localStorage.setItem('user', response.data.result);
        setLogin();
        return false;
      }
      userOpen(true);
      return false;
    })
    .catch((error) => {
      userOpen(true);
      console.error('userCheck', error);
      return false;
    });
}

function userSubmit(event) {
  event.preventDefault();
  const form = event.target;
  form.classList.add('form--loading');
  buttonToggleLoading(event.submitter);
  const formData = new FormData(form);
  const errorText = document.getElementById('userFormError');
  errorText.classList.add('d-none');
  login(formData)
    .then((response) => {
      if (response.status != 200) {
        errorText.textContent = response.data.error || 'Ошибка авторизации, проверьте логин и пароль';
        return;
      }
      form.reset();
      localStorage.setItem('user', response.data.result);
      setLogin();
      userHide();
      // Modal.getOrCreateInstance(document.getElementById('userModal')).hide();
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

function setLogin() {
  document.getElementById('user').classList.remove('d-none');
  document.getElementById('userName').textContent = localStorage.getItem('user');
}

function userLogout() {
  loadingToggle();
  logout()
    .then((response) => {
      if (response.status == 200) {
        localStorage.removeItem('user');
        document.getElementById('user').classList.add('d-none');
        userOpen();
      }
    })
    .catch((error) => {
      console.error('userLogout', error);
    })
    .finally(() => {
      loadingToggle();
    });
}

export function userOpen(error = false) {
  Modal.getOrCreateInstance(document.getElementById('userModal')).show();
  if (error) {
    const errorText = document.getElementById('userFormError');
    errorText.classList.remove('d-none');
    errorText.textContent = 'Для доступа к приложению требуется авторизация';
  }
}
function userHide() {
  document.getElementById('userFormError').classList.add('d-none');
  Modal.getOrCreateInstance(document.getElementById('userModal')).hide();
}
