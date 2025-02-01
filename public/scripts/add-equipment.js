document.getElementById('add-equipment-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const equipment = {};
  formData.forEach((value, key) => {
    equipment[key] = value;
  });

  // Send data to the backend
  fetch('/api/equipment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(equipment),
  })
    .then(response => response.json())
    .then(data => {
      alert('Fire equipment added successfully!');
    })
    .catch(error => console.error('Error adding equipment:', error));
});