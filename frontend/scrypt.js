const vasScale = document.getElementById('vas-scale');
const saveButton = document.getElementById('save-button');
const resultDisplay = document.getElementById('result');

// Load saved result if it exists
const savedResult = localStorage.getItem('vasResult');
if (savedResult) {
  vasScale.value = savedResult;
  resultDisplay.textContent = `Last saved result: ${savedResult}`;
}

// Save the result when the button is clicked
saveButton.addEventListener('click', () => {
  const result = vasScale.value;
  localStorage.setItem('vasResult', result); // Save to localStorage
  resultDisplay.textContent = `Saved result: ${result}`;
  alert(`Result saved: ${result}`);
});