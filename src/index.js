import './styles/style.css';

import sun from './icons/sun.svg';
import moon from './icons/moon.svg';

const icon = document.querySelector('.dark-mode .icon');
const toggleSwitch = document.querySelector('.dark-mode input[type="checkbox"]');

const setDarkMode = (checked) => {
  if (checked) {
    document.documentElement.setAttribute('data-theme', 'dark');
    icon.innerHTML = sun;
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    icon.innerHTML = moon;
    localStorage.setItem('theme', 'light');
  }
};

const currentTheme = localStorage.getItem('theme');

toggleSwitch.checked = currentTheme === 'dark';
setDarkMode(toggleSwitch.checked);

toggleSwitch.addEventListener('change', (e) => {
  setDarkMode(e.target.checked);
});

if ( window.AmbientLightSensor ) {
  const sensor = new AmbientLightSensor();
  sensor.addEventListener('activate', () => {
    console.log("Ready to report readings");
  });
  sensor.addEventListener('error', error => {
    console.error(error);
  });

  sensor.addEventListener('reading', () => {
    const illuminance = sensor.illuminance;
    if (illuminance < 20) {
      setDarkMode(true);
    } else if (illluminance > 30) {
      setDarkMode(false);
    }
  });
  sensor.start();
}
