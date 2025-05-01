document.addEventListener('DOMContentLoaded', () => {
  displayMatches(); // Отображаем все матчи при загрузке страницы
  loadFightersAndTournaments(); // Загружаем бойцов и турниры

  // Привязка обработчиков событий для кнопок редактирования
  document.querySelectorAll('[id^="edit-"]').forEach(button => {
    button.addEventListener('click', (e) => {
      const matchId = e.target.id.split('-')[1];
      editMatch(matchId);  // Вызываем функцию редактирования
    });
  });
});

document.getElementById('match-form').addEventListener('submit', addMatch);

// Функция для добавления нового матча
async function addMatch(event) {
  event.preventDefault();

  const fighterId = document.querySelector('[name="fighterId"]').value;
  const opponentId = document.querySelector('[name="opponentId"]').value;
  const tournamentId = document.querySelector('[name="tournamentId"]').value;
  const weightCategory = document.querySelector('[name="weightCategory"]').value;
  const matchDate = document.querySelector('[name="matchDate"]').value;
  const descriptionInput = document.querySelector('[name="description"]').value;
  const description = descriptionInput.trim() !== '' ? descriptionInput : 'Без описания';

  const matchData = {
    fighterId,
    opponentId,
    tournamentId,
    date: matchDate,
    result: '',
    method: '',
    event_name: 'Не указан',
    description
  };

  try {
    const response = await fetch('/api/matches', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData)
    });

    const data = await response.json();
    if (response.ok) {
      alert('Матч успешно добавлен!');
      displayMatches(); // Обновляем список матчей
    } else {
      alert('Ошибка при добавлении матча');
      console.error(data.message);
    }
  } catch (err) {
    console.error('Ошибка при добавлении матча:', err);
    alert('Ошибка при добавлении матча');
  }
}

// Функция для отображения всех матчей
async function displayMatches() {
  const matchesContainer = document.getElementById('matches-list');
  matchesContainer.innerHTML = ''; // Очистка контейнера перед обновлением

  try {
    const response = await fetch('/api/matches');
    const matches = await response.json();

    if (response.ok) {
      matches.forEach(match => {
        const matchElement = document.createElement('div');
        matchElement.classList.add('match-item');
        matchElement.innerHTML = `
          <p>Турнир: ${match.Tournament?.name || 'Без турнира'}</p>
          <p>Боец: ${match.Fighter?.name || 'Неизвестен'} vs ${match.Opponent?.name || 'Неизвестен'}</p>
          <p>Дата: ${new Date(match.date).toLocaleString()}</p>
          <button class="btn btn-secondary edit-btn" data-id="${match.id}">Редактировать</button>
          <button class="btn btn-danger" onclick="deleteMatch(${match.id})">Удалить</button>
        `;
        matchesContainer.appendChild(matchElement);
      });

      // 👇 ДОБАВЛЯЕМ ОБРАБОТЧИКИ НА КНОПКИ "Редактировать" ПОСЛЕ ОТОБРАЖЕНИЯ
      document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
          const matchId = e.target.dataset.id;
          editMatch(matchId);
        });
      });

    } else {
      alert('Ошибка при загрузке матчей');
    }
  } catch (err) {
    console.error('Ошибка при загрузке матчей:', err);
    alert('Ошибка при загрузке матчей');
  }
}

// Функция для загрузки бойцов и турниров
async function loadFightersAndTournaments() {
  try {
    const [fightersRes, tournamentsRes] = await Promise.all([
      fetch('/api/fighters'),
      fetch('/api/tournaments')
    ]);

    const fighters = await fightersRes.json();
    const tournaments = await tournamentsRes.json();

    if (fightersRes.ok) {
      const fighterSelect = document.querySelector('[name="fighterId"]');
      const opponentSelect = document.querySelector('[name="opponentId"]');

      fighters.forEach(fighter => {
        const option = document.createElement('option');
        option.value = fighter.id;
        option.textContent = fighter.name;
        fighterSelect.appendChild(option);

        const opponentOption = document.createElement('option');
        opponentOption.value = fighter.id;
        opponentOption.textContent = fighter.name;
        opponentSelect.appendChild(opponentOption);
      });
    }

    if (tournamentsRes.ok) {
      const tournamentSelect = document.querySelector('[name="tournamentId"]');
      tournaments.forEach(tournament => {
        const option = document.createElement('option');
        option.value = tournament.id;
        option.textContent = tournament.name;
        tournamentSelect.appendChild(option);
      });
    }

  } catch (err) {
    console.error('Ошибка при загрузке бойцов или турниров:', err);
    alert('Ошибка при загрузке бойцов или турниров');
  }
}

// Функция для редактирования матча
async function editMatch(id) {
  try {
    const response = await fetch(`/api/matches/${id}`);
    const match = await response.json();

    if (response.ok) {
      document.querySelector('[name="fighterId"]').value = match.Fighter.id;
      document.querySelector('[name="opponentId"]').value = match.Opponent.id;
      document.querySelector('[name="tournamentId"]').value = match.Tournament.id;
      document.querySelector('[name="weightCategory"]').value = match.weightCategory || '';
      document.querySelector('[name="matchDate"]').value = match.date;
      document.querySelector('[name="description"]').value = match.description;

      const form = document.getElementById('match-form');
      form.removeEventListener('submit', addMatch);
      form.addEventListener('submit', (event) => updateMatch(event, id));
    } else {
      alert('Ошибка при получении матча');
    }
  } catch (err) {
    console.error('Ошибка при получении матча:', err);
    alert('Ошибка при получении матча');
  }
}

// Функция для обновления матча
async function updateMatch(event, id) {
  event.preventDefault();

  const fighterId = document.querySelector('[name="fighterId"]').value;
  const opponentId = document.querySelector('[name="opponentId"]').value;
  const tournamentId = document.querySelector('[name="tournamentId"]').value;
  const weightCategory = document.querySelector('[name="weightCategory"]').value;
  const matchDate = document.querySelector('[name="matchDate"]').value;
  const descriptionInput = document.querySelector('[name="description"]').value;
  const description = descriptionInput.trim() !== '' ? descriptionInput : 'Без описания';

  const matchData = {
    fighterId,
    opponentId,
    tournamentId,
    date: matchDate,
    result: '',
    method: '',
    event_name: 'Не указан',
    description
  };

  try {
    const response = await fetch(`/api/matches/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(matchData)
    });

    const data = await response.json();
    if (response.ok) {
      alert('Матч успешно обновлен!');
      displayMatches();
    } else {
      alert('Ошибка при обновлении матча');
    }
  } catch (err) {
    console.error('Ошибка при обновлении матча:', err);
    alert('Ошибка при обновлении матча');
  }
}

// Функция для удаления матча
async function deleteMatch(id) {
  if (confirm('Вы уверены, что хотите удалить этот матч?')) {
    try {
      const response = await fetch(`/api/matches/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      if (response.ok) {
        alert('Матч успешно удален!');
        displayMatches();
      } else {
        alert('Ошибка при удалении матча');
      }
    } catch (err) {
      console.error('Ошибка при удалении матча:', err);
      alert('Ошибка при удалении матча');
    }
  }
}
