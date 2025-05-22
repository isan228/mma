let editId = null;

// Загрузка бойцов
async function loadFighters() {
  try {
    const response = await fetch('/api/fighters');
    const fighters = await response.json();
    const list = document.getElementById('fighters-list');
    list.innerHTML = '';

    fighters.forEach(fighter => {
      const li = document.createElement('li');
      li.className = 'list-group-item d-flex justify-content-between align-items-center';
      li.id = `fighter-${fighter.id}`;
      const record = `${fighter.wins || 0}-${fighter.losses || 0}`;
      const paymentStatus = fighter.isPaid ? '✅ Оплачено' : '❌ Не оплачено';
      li.innerHTML = `
        <span class="fighter-name">
          ${fighter.name} (${fighter.category}) - Рекорд: ${record} - ${paymentStatus}
          <br>Год рождения: ${fighter.birthYear || 'Не указан'}, Пол: ${fighter.gender || 'Не указан'}
        </span>
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
  async function loadSportsToSelect() {
    const res = await fetch('/api/sports');
    const sports = await res.json();
    const select = document.getElementById('sport-id');
    select.innerHTML = '<option value="">Выберите стиль</option>';
    sports.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.name;
      select.appendChild(option);
    });
  }
// Отправка формы (добавление/обновление)
document.getElementById('fighter-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const form = e.target;
  const formData = new FormData(form);

  // Явно добавляем галочку оплаты
  formData.set('isPaid', form.elements.paid.checked ? 'true' : 'false');
  formData.set('weightCategoryId', form.elements.weightCategory.value);
  formData.set('sportId', form.elements['sport-id'].value)
  // Если нет выбранного файла, старое фото_url оставляем как есть (если редактирование)
  if (!formData.get('photo')) {
    formData.delete('photo');
  }

  // Новые поля birthYear и gender
  formData.set('birthYear', form.elements.birthYear.value);
  formData.set('gender', form.elements.gender.value);

  try {
    if (editId) {
      const response = await fetch(`/api/fighters/${editId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Боец обновлён');
        form.reset();
        editId = null;
        document.querySelector('button[type="submit"]').innerText = 'Добавить бойца';
        loadFighters();
      } else {
        alert('Ошибка при обновлении бойца');
      }
    } else {
      const response = await fetch('/api/fighters', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Боец добавлен успешно');
        form.reset();
        loadFighters();
      } else {
        alert('Ошибка при добавлении бойца');
      }
    }
  } catch (err) {
    console.error(err);
    alert('Ошибка при сохранении бойца');
  }
});

// Удаление бойца
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

// Редактирование бойца
async function editFighter(id) {
  try {
    const response = await fetch(`/api/fighters/${id}`);
    const fighter = await response.json();

    document.getElementById('name').value = fighter.name;
    document.getElementById('birthYear').value = fighter.birthYear || '';  // Новое поле
    document.getElementById('gender').value = fighter.gender || '';        // Новое поле
 
    document.getElementById('country').value = fighter.country;
    document.getElementById('height').value = fighter.height;
 
    document.getElementById('weightCategory').value = fighter.weightCategoryId ;
document.getElementById('sport-id').value = fighter.sport_id || '';

    document.getElementById('team').value = fighter.team_id;
    document.getElementById('trainer').value = fighter.trainer_id;
    document.getElementById('wins').value = fighter.wins || 0;
    document.getElementById('losses').value = fighter.losses || 0;
    document.getElementById('paid').checked = fighter.isPaid;

    editId = id;
    document.querySelector('button[type="submit"]').innerText = 'Обновить бойца';
  } catch (err) {
    console.error(err);
    alert('Ошибка при редактировании');
  }
}

// Загрузка команд и тренеров
async function loadTeamsAndTrainers() {
  try {
    const teamResponse = await fetch('/api/teams');
    const teams = await teamResponse.json();
    const teamSelect = document.getElementById('team');
    teamSelect.innerHTML = '<option value="">Выберите команду</option>';
    teams.forEach(team => {
      const option = document.createElement('option');
      option.value = team.id;
      option.textContent = team.name;
      teamSelect.appendChild(option);
    });

    const trainerResponse = await fetch('/api/trainer');
    const trainers = await trainerResponse.json();
    const trainerSelect = document.getElementById('trainer');
    trainerSelect.innerHTML = '<option value="">Выберите тренера</option>';
    trainers.forEach(trainer => {
      const option = document.createElement('option');
      option.value = trainer.id;
      option.textContent = trainer.name;
      trainerSelect.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    alert('Ошибка при загрузке тренеров и команд');
  }
}

async function loadWeightCategoriesForFighters() {
  try {
    const response = await fetch('/api/categories');
    const categories = await response.json();
    const select = document.getElementById('weightCategory');
    select.innerHTML = '<option value="">Выберите категорию</option>';
    categories.forEach(cat => {
      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = cat.weight;
      select.appendChild(option);
    });
  } catch (err) {
    console.error(err);
    alert('Ошибка при загрузке весовых категорий');
  }
}
// При загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
  loadFighters();
  loadTeamsAndTrainers();
  loadWeightCategoriesForFighters();
   loadSportsToSelect();
});
