// Отправка данных для добавления нового тренера
function addTrainer(event) {
  event.preventDefault(); // предотвращаем перезагрузку страницы

  const name = document.getElementById('trainer-name').value;
  const teamName = document.getElementById('trainer-team').value;
  const experience = document.getElementById('trainer-experience').value;
  const photo = document.getElementById('trainer-photo').files[0]; // получаем файл, а не значение

  if (!name || !teamName || !experience) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }

  const teamId = document.querySelector(`#team-list option[value="${teamName}"]`)?.dataset.id;

  if (!teamId) {
    alert('Команда не найдена');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('teamId', teamId);
  formData.append('experience', experience);

  if (photo) {
    formData.append('photo', photo); // только если выбрано фото
  }

  fetch('/api/trainer', {
    method: 'POST',
    body: formData, // НЕ headers: 'Content-Type', иначе FormData сломается
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось добавить тренера');
      }
      return response.json();
    })
    .then(data => {
      console.log('Trainer added:', data);
      displayTrainers();
    })
    .catch(err => {
      console.error('Error adding trainer:', err);
      alert('Ошибка при добавлении тренера');
    });
}

// Загрузка команд с поисковым запросом
function loadTeams(query = '') {
  fetch(`/api/teams?q=${query}`)  // Добавляем параметр для поиска
    .then(response => response.json())
    .then(teams => {
      const teamList = document.getElementById('team-list');
      teamList.innerHTML = '';  // Очистить список

      teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.name;  // Предполагается, что у команды есть свойство name
        option.dataset.id = team.id;  // Сохраняем ID команды в dataset для дальнейшего использования
        teamList.appendChild(option);
      });
    })
    .catch(err => {
      console.error('Ошибка при загрузке команд:', err);
    });
}

// Обработчик для поиска команд при вводе
function searchTeams(event) {
  const query = event.target.value;
  loadTeams(query);  // Загружаем команды с учетом поискового запроса
}

// Загружаем команды при старте страницы
document.addEventListener('DOMContentLoaded', () => {
  loadTeams();  // Загружаем все команды при старте страницы

  const teamInput = document.getElementById('trainer-team');
  teamInput.addEventListener('input', searchTeams);  // Добавляем обработчик на изменение в поле команды
});

// Отображение тренеров в списке с кнопками редактирования и удаления
function displayTrainers() {
  fetch('/api/trainer')
    .then(response => response.json())
    .then(trainers => {
      const trainerList = document.getElementById('trainer-list');
      trainerList.innerHTML = ''; // Очистка списка

      trainers.forEach(trainer => {
        const li = document.createElement('li');
        
        // Создаем изображение с проверкой на наличие URL
        const img = document.createElement('img');
        if (trainer.photo_url) {
          img.src = trainer.photo_url;  // Если есть фото, устанавливаем URL
          img.alt = `Фото тренера ${trainer.name}`;
        } else {
          img.src = 'default-photo-url.jpg';  // Указываем изображение по умолчанию
          img.alt = `Фото тренера ${trainer.name} (по умолчанию)`;
        }
        
        img.style.width = '50px';
        img.style.height = '50px';
        img.style.marginRight = '10px';

        // Добавляем информацию о тренере
        const text = document.createElement('span');
        text.textContent = `${trainer.name} - ${trainer.team}`;

        li.appendChild(img);
        li.appendChild(text);

        // Кнопка для редактирования
        const editButton = document.createElement('button');
        editButton.textContent = 'Редактировать';
        editButton.classList.add('btn', 'btn-secondary', 'ms-2');
        editButton.onclick = () => fillFormWithTrainerData(trainer);

        // Кнопка для удаления
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.classList.add('btn', 'btn-danger', 'ms-2');
        deleteButton.onclick = () => deleteTrainer(trainer.id);

        li.appendChild(editButton);
        li.appendChild(deleteButton);

        trainerList.appendChild(li);
      });
    })
    .catch(err => console.error('Error fetching trainers:', err));
}


function fillFormWithTrainerData(trainer) {
  document.getElementById('trainer-name').value = trainer.name;
  document.getElementById('trainer-team').value = trainer.team;
  document.getElementById('trainer-experience').value = trainer.experience;

  const photoInput = document.getElementById('trainer-photo');
  const imgPreview = document.getElementById('photo-preview'); // Пытаемся найти элемент

  if (imgPreview) {  // Проверяем, существует ли элемент
    if (trainer.photo_url) {
      imgPreview.src = trainer.photo_url;
      imgPreview.style.display = 'block'; // показываем картинку
    } else {
      imgPreview.style.display = 'none'; // скрываем картинку, если её нет
    }
  } else {
    console.error('Не найден элемент для отображения фото');
  }

  // Обновляем форму на редактирование
  const form = document.getElementById('trainer-form');
  form.removeEventListener('submit', addTrainer);
  form.addEventListener('submit', (event) => updateTrainer(event, trainer.id));
}
// Обновление тренера
function updateTrainer(event, id) {
  event.preventDefault();

  const name = document.getElementById('trainer-name').value;
  const teamName = document.getElementById('trainer-team').value;
  const experience = document.getElementById('trainer-experience').value;
  const photo = document.getElementById('trainer-photo').files[0]; // Вот тут правильно взять фото!

  const teamId = document.querySelector(`#team-list option[value="${teamName}"]`)?.dataset.id;

  if (!name || !teamId || !experience) {
    alert('Пожалуйста, заполните все обязательные поля');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('teamId', teamId);
  formData.append('experience', experience);
  if (photo) {
    formData.append('photo', photo); // Только если выбрано новое фото
  }

  fetch(`/api/trainer/${id}`, {
    method: 'PUT',
    body: formData, // ВАЖНО! НЕ ставим headers Content-Type!
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Не удалось обновить тренера');
      }
      return response.json();
    })
    .then(data => {
      console.log('Trainer updated:', data);
      displayTrainers(); // Перезагружаем список тренеров
    })
    .catch(err => {
      console.error('Ошибка при обновлении тренера:', err);
      alert('Ошибка при обновлении тренера');
    });
}
// Удаление тренера
function deleteTrainer(id) {
  if (confirm('Вы уверены, что хотите удалить этого тренера?')) {
    fetch(`/api/trainer/${id}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Не удалось удалить тренера');
        }
        displayTrainers(); // Перезагружаем список тренеров
      })
      .catch(err => {
        console.error('Error deleting trainer:', err);
        alert('Ошибка при удалении тренера');
      });
}
}

// Привязываем обработчик события для формы
document.getElementById('trainer-form').addEventListener('submit', addTrainer);

// Загрузка тренеров при старте
document.addEventListener('DOMContentLoaded', displayTrainers);
