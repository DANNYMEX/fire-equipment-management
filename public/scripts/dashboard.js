document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('modal');
  const openModalButton = document.getElementById('open-modal');
  const closeModalButton = document.getElementById('close-modal');
  const addEquipmentForm = document.getElementById('add-equipment-form');
  const tableBody = document.getElementById('equipment-table-body');

  // Open modal
  openModalButton.addEventListener('click', () => {
    modal.style.display = 'flex';
  });

  // Close modal
  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // Close modal when clicking outside the modal content
  window.addEventListener('click', (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

  // Fetch and display equipment data
  function fetchEquipment() {
    fetch('/api/equipment')
      .then(response => response.json())
      .then(data => {
        tableBody.innerHTML = ''; // Clear existing rows
        data.forEach(equipment => {
          const row = `
            <tr>
              <td>${equipment.id}</td>
              <td>${equipment.name}</td>
              <td>${equipment.type}</td>
              <td>${equipment.location}</td>
              <td>${equipment.status}</td>
              <td>${equipment.last_inspection}</td>
              <td>${equipment.next_inspection}</td>
              <td>
                <a href="#" class="button">Edit</a>
                <a href="#" class="button">Delete</a>
              </td>
            </tr>
          `;
          tableBody.insertAdjacentHTML('beforeend', row);
        });
      })
      .catch(error => console.error('Error fetching equipment data:', error));
  }

  // Add new equipment
  addEquipmentForm.addEventListener('submit', function (event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const equipment = {};
    formData.forEach((value, key) => {
      equipment[key] = value;
    });

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
        modal.style.display = 'none'; // Close the modal
        fetchEquipment(); // Refresh the table
      })
      .catch(error => console.error('Error adding equipment:', error));
  });

  // Initial fetch to populate the table
  fetchEquipment();
});