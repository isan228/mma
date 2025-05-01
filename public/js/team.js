document.addEventListener('DOMContentLoaded', () => {
  const teamForm = document.getElementById('team-form');
  const teamList = document.getElementById('teams-list');

  let editId = null; // Для проверки, редактируем или создаём

  // Добавление или обновление команды
  teamForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('team-name').value;
    const description = document.getElementById('team-description').value;
    const logo = document.getElementById('team-logo').files[0]; // Получаем файл эмблемы

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    if (logo) formData.append('logo', logo); // Добавляем файл эмблемы, если выбран

    let response;

    if (editId) {
      // Если редактируем команду
      response = await fetch(`/api/teams/${editId}`, {
        method: 'PUT',
        body: formData
      });
    } else {
      // Если создаём команду
      response = await fetch('/api/teams', {
        method: 'POST',
        body: formData
      });
    }

    const data = await response.json();

    if (response.ok) {
      alert(editId ? 'Команда обновлена!' : 'Команда добавлена!');
      teamForm.reset();
      editId = null; // Сброс режима редактирования
      loadTeams(); // Обновим список команд
    } else {
      alert('Ошибка при сохранении команды');
    }
  });

  // Загрузка списка команд
  async function loadTeams() {
    const res = await fetch('/api/teams');
    const teams = await res.json();

    teamList.innerHTML = '';
    teams.forEach(team => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = `${team.name} — ${team.description}`;

      // Эмблема команды
      if (team.logo) {
        const img = document.createElement('img');
        img.src = `/uploads/${team.logo}`; // Указываем правильный путь к эмблеме
        img.alt = 'Логотип';
        img.style.width = '50px'; // Можешь добавить стили для эмблемы
        li.appendChild(img);
      }

      // Кнопки для редактирования и удаления
      const editButton = document.createElement('button');
      editButton.textContent = 'Редактировать';
      editButton.className = 'btn btn-warning btn-sm';
      editButton.addEventListener('click', () => editTeam(team.id)); // Редактирование команды

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Удалить';
      deleteButton.className = 'btn btn-danger btn-sm';
      deleteButton.addEventListener('click', () => deleteTeam(team.id)); // Удаление команды

      li.appendChild(editButton);
      li.appendChild(deleteButton);
      teamList.appendChild(li);
    });
  }

  // Редактирование команды
  async function editTeam(id) {
    const team = await fetch(`/api/teams/${id}`).then(res => res.json()); // Получаем команду по ID

    // Заполняем форму для редактирования
    document.getElementById('team-name').value = team.name;
    document.getElementById('team-description').value = team.description;
    document.getElementById('team-logo').value = ''; // Оставляем пустым для нового логотипа (если нужно)

    editId = id; // Устанавливаем режим редактирования
  }

  // Удаление команды
  async function deleteTeam(id) {
    const response = await fetch(`/api/teams/${id}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Команда удалена!');
      loadTeams(); // Обновим список команд
    } else {
      alert('Ошибка при удалении команды');
    }
  }

  loadTeams();
});
