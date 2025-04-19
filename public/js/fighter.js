// Функция для загрузки списка бойцов
async function loadFighters() {
    try {
      const response = await fetch('/api/fighters');
      const fighters = await response.json();
      const list = document.getElementById('fighters-list');
      list.innerHTML = ''; // Очищаем список
  
      fighters.forEach(fighter => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `
            ${fighter.name} (${fighter.category}) - ${fighter.team} - Рекорд: ${fighter.record}
            <div>
                <button class="btn btn-sm btn-warning me-2" onclick="editFighter(${fighter.id})">Редактировать</button>
                <button class="btn btn-sm btn-danger" onclick="deleteFighter(${fighter.id})">Удалить</button>
            </div>
        `;
        list.appendChild(li);
    });
    } catch (err) {
      console.error(err);
    }
  }
  
// Функция для добавления нового бойца
document.getElementById('fighter-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Собираем данные формы
    const form = e.target;
    const data = new FormData(form);
    const formData = {};

    data.forEach((value, key) => {
      formData[key] = value;
    });

    try {
      const response = await fetch('/api/fighters', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Боец добавлен успешно');
        form.reset();  // Очищаем форму
        loadFighters(); // Подгружаем список бойцов
      } else {
        alert('Ошибка при добавлении бойца');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при добавлении бойца');
    }
  });
  
  // Функция для загрузки списка бойцов
async function loadFighters() {
    try {
      const response = await fetch('/api/fighters');
      const fighters = await response.json();
      const list = document.getElementById('fighters-list');
      list.innerHTML = ''; // Очищаем список
  
      fighters.forEach(fighter => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.id = `fighter-${fighter.id}`;  // Уникальный id для каждого бойца
        li.innerHTML = `
          <span class="fighter-name">${fighter.name} (${fighter.category})</span>
          <div>
            <button class="btn btn-sm btn-warning me-2" onclick="editFighter(${fighter.id})">Редактировать</button>
            <button class="btn btn-sm btn-danger" onclick="deleteFighter(${fighter.id})">Удалить</button>
          </div>
        `;
        list.appendChild(li);
      });
    } catch (err) {
      console.error(err);
    }
  }
  // Функция для удаления бойца
  async function deleteFighter(id) {
    if (!confirm('Ты уверен, брат?')) return;
  
    try {
      const response = await fetch(`/api/fighters/${id}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        alert('Боец удалён');
        loadFighters();
      } else {
        alert('Ошибка при удалении');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при удалении');
    }
  }
  
  // Функция для редактирования бойца
  async function editFighter(id) {
    try {
      const response = await fetch(`/api/fighters/${id}`);
      const fighter = await response.json();
  
      // Заполняем форму данными бойца
      document.getElementById('name').value = fighter.name;
      document.getElementById('age').value = fighter.age;
      document.getElementById('country').value = fighter.country;
      document.getElementById('height').value = fighter.height;
      document.getElementById('weight').value = fighter.weight;
      document.getElementById('category').value = fighter.category;
      document.getElementById('style').value = fighter.style;
      document.getElementById('photo_url').value = fighter.photo_url;
  
      // Меняем кнопку на "Обновить"
      const submitButton = document.querySelector('button[type="submit"]');
      submitButton.innerText = 'Обновить бойца';
      submitButton.setAttribute('onclick', `updateFighter(${id})`);
    } catch (err) {
      console.error(err);
      alert('Ошибка при редактировании');
    }
  }
  
// Функция для обновления данных бойца
async function updateFighter(id) {
    const form = document.getElementById('fighter-form');
    const formData = new FormData(form);
    const data = {};
  
    formData.forEach((value, key) => {
      data[key] = value;
    });
  
    try {
      const response = await fetch(`/api/fighters/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      if (response.ok) {
        alert('Боец обновлён');
        form.reset(); // Очищаем форму
  
        // Обновляем данные бойца в списке
        const updatedFighter = await response.json();
        const listItem = document.querySelector(`#fighter-${id}`);
  
        if (listItem) {
          // Обновляем только текущего бойца в списке
          listItem.querySelector('.fighter-name').textContent = `${updatedFighter.name} (${updatedFighter.category})`;
        } else {
          console.error("Не найден элемент для обновления.");
        }
  
        // Возвращаем кнопку в режим "Добавить"
        const submitButton = document.querySelector('button[type="submit"]');
        submitButton.innerText = 'Добавить бойца';
        submitButton.removeAttribute('onclick');
      } else {
        alert('Ошибка при обновлении бойца');
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при обновлении бойца');
    }
    console.log('update fighter')
  }
  
  // Загружаем бойцов при старте страницы
  document.addEventListener('DOMContentLoaded', () => {
    loadFighters();
  });