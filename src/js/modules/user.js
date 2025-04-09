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
        // return true
        return false;
      }
      Modal.getOrCreateInstance(document.getElementById('userModal')).show();
      return false;
    })
    .catch((error) => {
      Modal.getOrCreateInstance(document.getElementById('userModal')).show();
      console.error('userCheck', error);
      return false;
    });
}

function userSubmit(event) {
  event.preventDefault();
  /*
  buttonToggleLoading(event.submitter);
  document.cookie = 'csrftoken=test';
  setLogin('test account');
  Modal.getOrCreateInstance(document.getElementById('userModal')).hide();
  */
  const form = event.target;
  form.classList.add('form--loading');
  buttonToggleLoading(event.submitter);
  const formData = new FormData(form);
  const errorText = document.getElementById('userFormError');
  errorText.classList.add('d-none');
  login(formData)
    .then((response) => {
      console.log('userSubmit response', response);
      if (response.status != 200) {
        errorText.textContent = response.data.error || 'Ошибка авторизации, проверьте логин и пароль';
        return;
      }
      form.reset();
      localStorage.setItem('user', response.data.result);
      setLogin();
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
        Modal.getOrCreateInstance(document.getElementById('userModal')).show();
      }
    })
    .catch((error) => {
      console.error('userLogout', error);
    })
    .finally(() => {
      loadingToggle();
    });
}
