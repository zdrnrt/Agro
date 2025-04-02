import { login } from "../service/api";
import { buttonToggleLoading } from '../blocks/button'
import { Modal } from "bootstrap";

export function initLogin(){
  document.getElementById('userForm').addEventListener('submit', loginSubmit)
  document.getElementById('userLogout').addEventListener('click', logout)
  console.log(Modal.getInstance(document.getElementById('userModal')));
  const userModal = new Modal(document.getElementById('userModal'));
  userModal.show();
  console.log(userModal)

}

// userName

function loginSubmit(event){
  event.preventDefault();
  buttonToggleLoading(event.submitter);
  const form = event.target;
  form.classList.add('form--loading');
  const formData = new FormData(form);
  const errorText = document.getElementById('userFormError');
  errorText.classList.add('d-none');
  login(formData)
    .then((response) => {
      console.log(response);
      if (response.status != 200){
        errorText.textContent = response.data.error || 'Ошибка авторизации, проверьте логин и пароль'
        return 
      }
      document.getElementById('user').classList.remove('d-none');
      document.getElementById('userName').textContent = response.data.result
      Modal.getInstance(document.getElementById('userModal')).hide();
      console.log(Modal.getInstance(document.getElementById('userModal')));
    })
    .catch( (error) => {
      console.log('loginSubmit', error)
      errorText.classList.remove('d-none');
      errorText.textContent = 'Ошибка авторизации, проверьте логин и пароль'
    })
    .finally( () => {
        form.classList.remove('form--loading');
        buttonToggleLoading(event.submitter);
    })
}

function logout() {
  console.log('logout')
}