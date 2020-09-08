// Import JS Functions
import { buildYearForm, initEventListeners } from './js/app';

// Import Styles
import './styles/base.scss';

// Initialize any event listeners and/or any functions that requrie the DOM to be loaded first
window.addEventListener('DOMContentLoaded', () => {
    buildYearForm();
    initEventListeners();
})