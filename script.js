const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.navigation');

if (menuToggle && navigation) {
  menuToggle.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
  });

  navigation.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    });
  });

  document.addEventListener('click', event => {
    if (!navigation.contains(event.target) && !menuToggle.contains(event.target)) {
      navigation.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

const workOptions = {
  new: { label: 'Будівництво будинку', low: 300, high: 450 },
  interior: { label: 'Дизайн інтер’єру', low: 80, high: 160 },
  renovation: { label: 'Реконструкція', low: 180, high: 350 }
};

const workType = document.querySelector('#workType');
const areaRange = document.querySelector('#areaRange');
const areaValue = document.querySelector('#areaValue');
const budgetValue = document.querySelector('#budgetValue');
const budgetRate = document.querySelector('#budgetRate');
const budgetWorkLabel = document.querySelector('#budgetWorkLabel');
const contactProject = document.querySelector('#contactProject');

function formatEuro(value) {
  return '€' + Math.round(value).toLocaleString('uk-UA');
}

function updateBudget() {
  if (!workType || !areaRange || !areaValue || !budgetValue) return;
  const option = workOptions[workType.value] || workOptions.new;
  const area = Number(areaRange.value) || 120;
  const min = area * option.low;
  const max = area * option.high;

  areaValue.textContent = String(area);
  budgetValue.textContent = formatEuro(min) + '–' + formatEuro(max);
  if (budgetRate) budgetRate.textContent = '€' + option.low + '–€' + option.high + ' / м²';
  if (budgetWorkLabel) budgetWorkLabel.textContent = option.label;
  const minArea = Number(areaRange.min);
  const maxArea = Number(areaRange.max);
  const percent = ((area - minArea) / (maxArea - minArea)) * 100;
  areaRange.style.setProperty('--range-progress', percent + '%');

  if (contactProject) {
    const projectNames = {
      new: 'Побудувати будинок',
      interior: 'Розробити дизайн інтер’єру',
      renovation: 'Реконструювати наявний будинок'
    };
    const mapped = projectNames[workType.value];
    const target = [...contactProject.options].find(option => option.textContent === mapped);
    if (target) contactProject.value = target.value;
  }
}

workType?.addEventListener('change', updateBudget);
areaRange?.addEventListener('input', updateBudget);
updateBudget();

const contactForm = document.querySelector('#contactForm');
const formMessage = document.querySelector('#formMessage');

if (contactForm && formMessage) {
  contactForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const data = new FormData(contactForm);
    const name = String(data.get('name')).trim();
    const project = String(data.get('project'));
    const contact = String(data.get('contact')).trim();
    const area = String(data.get('area') || '').trim();
    const message = String(data.get('message') || '').trim();

    const details = [
      '✓ Демо-запит підготовлено, ' + name + '!',
      'Напрямок: ' + project + (area ? ' · Площа: ' + area : ''),
      'Контакт: ' + contact
    ];
    if (message) details.push('Ваш задум: ' + message);
    details.push('Це демонстрація для портфоліо — дані не надіслані та не збережені.');

    formMessage.textContent = details.join('\n');
    formMessage.classList.add('is-success');
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
}
