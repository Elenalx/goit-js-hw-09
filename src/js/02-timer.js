import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from 'notiflix';


const refs = {
  dataPicker: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  timerDays: document.querySelector('span[data-days]'),
  timerHours: document.querySelector('span[data-hours]'),
  timerMinutes: document.querySelector('span[data-minutes]'),
  timerSeconds: document.querySelector('span[data-seconds]'),
};


let isActive;

function convertMs(timer) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = addLeadingZero(Math.floor(timer / day));
  // Remaining hours
  const hours = addLeadingZero(Math.floor((timer % day) / hour));
  // Remaining minutes
  const minutes = addLeadingZero(Math.floor(((timer % day) % hour) / minute));
  // Remaining seconds
  const seconds =addLeadingZero(Math.floor((((timer % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

const updateClockface = timer => {
  const { days, hours, minutes, seconds } = convertMs(timer);
  refs.timerDays.textContent = days;
  refs.timerHours.textContent = hours;
  refs.timerMinutes.textContent = minutes;
  refs.timerSeconds.textContent = seconds;
  console.log({ days, hours, minutes, seconds });
};


const hendleSelectedDate = selectedDate => {
  let timerId = null;

  const selectedDateUTC = selectedDate.getTime();

  const onStartBtnClick = () => {
    if (isActive) {
      return;
    }
    isActive = true;
    refs.startBtn.setAttribute('disabled', 'disabled');
    timerId = setInterval(() => {
      if (selectedDateUTC > Date.now()) {
        const timerTime = selectedDateUTC - Date.now();
        updateClockface(timerTime);
      } else {
        clearInterval(timerId);
        isActive = false;
      }
    }, 1000);
  };

  if (Date.now() > selectedDateUTC) {
    Notiflix.Notify.warning('Please choose a date in the future');
  } else {
    refs.startBtn.removeAttribute('disabled');
    refs.startBtn.addEventListener('click', onStartBtnClick);
  }
};


const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    hendleSelectedDate(selectedDate);
  },
};

const fp = flatpickr('#datetime-picker', options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}