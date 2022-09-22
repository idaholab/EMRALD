// @ts-check
/* global d3, renderer */
const form = document.getElementById('demo-controls');
Object.keys(renderer.options).forEach((optionName) => {
  const container = document.createElement('div');
  const label = document.createElement('label');
  label.setAttribute('for', optionName);
  label.innerHTML = optionName;
  container.appendChild(label);
  const input = document.createElement('input');
  input.id = optionName;
  input.placeholder = optionName;
  input.value = renderer.options[optionName];
  if (!Number.isNaN(Number(renderer.options[optionName]))) {
    input.type = 'number';
  }
  input.addEventListener('change', () => {
    const num = Number(input.value);
    if (Number.isNaN(num)) {
      renderer.options[optionName] = input.value;
    } else {
      renderer.options[optionName] = num;
    }
    d3.selectAll('svg > *').remove();
    renderer.render(d3.select('svg'));
  });
  container.appendChild(input);
  form?.appendChild(container);
});
