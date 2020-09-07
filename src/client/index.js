import { scrollTo, formHandler, buildYearForm, buildDayForm } from './js/app';
// import { formHandler } from './js/app';

import './styles/base.scss';

document.getElementById('hero').addEventListener('click', scrollTo);
document.getElementById('formSubmit').addEventListener('click', formHandler);
document.addEventListener('DOMContentLoaded', buildYearForm)
document.getElementById('month').addEventListener('change', buildDayForm);

// Do these need to be exported?
export {
    scrollTo,
    formHandler
}