const form = document.querySelector('.card__input-section__age-form');
const dayInput = document.getElementById('days');
const monthInput = document.getElementById('months');
const yearInput = document.getElementById('years');
const resYears = document.getElementById('res-years');
const resMonths = document.getElementById('res-months');
const resDays = document.getElementById('res-days');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const day = parseInt(dayInput.value);
  const month = parseInt(monthInput.value);
  const year = parseInt(yearInput.value);
  if (validate(day, month, year)) {
    calculateAge(day, month, year);
  }
});
function resetErrors() {
  const fields = document.querySelectorAll(
    '.card__input-section__age-form__input-group__field'
  );
  fields.forEach((field) => {
    field.classList.remove(
      'card__input-section__age-form__input-group__field--error'
    );
    const errorMsg = field.querySelector(
      '.card__input-section__age-form__input-group__field__error-msg'
    );
    if (errorMsg) errorMsg.innerText = '';
  });
  resYears.innerText = '--';
  resMonths.innerText = '--';
  resDays.innerText = '--';
}
function showError(input, message) {
  const parent = input.parentElement;
  parent.classList.add(
    'card__input-section__age-form__input-group__field--error'
  );
  parent.querySelector(
    '.card__input-section__age-form__input-group__field__error-msg'
  ).innerText = message;
}
function validate(d, m, y) {
  const today = new Date();
  const inputDate = new Date(y, m - 1, d);
  let isValid = true;
  resetErrors();
  if (!dayInput.value) {
    showError(dayInput, 'This field is required');
    isValid = false;
  } else if (isNaN(d) || d < 1 || d > 31) {
    showError(dayInput, 'Must be a valid day');
    isValid = false;
  }
  if (!monthInput.value) {
    showError(monthInput, 'This field is required');
    isValid = false;
  } else if (isNaN(m) || m < 1 || m > 12) {
    showError(monthInput, 'Must be a valid month');
    isValid = false;
  }
  if (!yearInput.value) {
    showError(yearInput, 'This field is required');
    isValid = false;
  } else if (isNaN(y)) {
    showError(yearInput, 'Must be a valid year');
    isValid = false;
  } else if (y > today.getFullYear()) {
    showError(yearInput, 'Must be in the past');
    isValid = false;
  }
  if (
    isValid &&
    (inputDate.getMonth() + 1 !== m || inputDate.getDate() !== d)
  ) {
    showError(dayInput, 'Must be a valid date');
    isValid = false;
  }
  return isValid;
}
function calculateAge(birthDay, birthMonth, birthYear) {
  const today = new Date();
  let years = today.getFullYear() - birthYear;
  let months = today.getMonth() + 1 - birthMonth;
  let days = today.getDate() - birthDay;
  if (days < 0) {
    months--;
    const previousMonthLastDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      0
    ).getDate();
    days += previousMonthLastDay;
  }
  if (months < 0) {
    years--;
    months += 12;
  }
  resYears.innerText = years;
  resMonths.innerText = months;
  resDays.innerText = days;
}
