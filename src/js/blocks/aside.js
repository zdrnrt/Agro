export function initAside() {
  const navList = document.querySelectorAll('#nav .nav-item');

  for (const navItem of navList) {
    navItem.addEventListener('click', tabChange);
  }
}

function tabChange(event) {
  const elem = event.target.closest('.nav-item');
  const nav = document.getElementById('nav');
  for (const tab of nav.querySelectorAll('.nav-item--active')) {
    tab.classList.remove('nav-item--active');
  }
  elem.classList.add('nav-item--active');
  if (elem.closest('.aside-nav__item--collapse')) {
    elem.closest('.aside-nav__item--collapse').previousElementSibling.classList.add('nav-item--active');
  }
}
