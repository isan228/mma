document.addEventListener('DOMContentLoaded', () => {
  displayMatches();
  loadFightersAndTournaments();
  loadSports();
  loadWeightCategories();

  const form = document.getElementById('match-form');
  form.addEventListener('submit', addMatch);
});

// Загрузка бойцов и турниров
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
        const option1 = document.createElement('option');
        option1.value = fighter.id;
        option1.textContent = fighter.name;
        fighterSelect.appendChild(option1);

        const option2 = document.createElement('option');
        option2.value = fighter.id;
        option2.textContent = fighter.name;
        opponentSelect.appendChild(option2);
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

// Загрузка видов спорта
async function loadSports() {
  try {
    const res = await fetch('/api/sports');
    const sports = await res.json();
    const select = document.querySelector('select[name="sportId"]');
    sports.forEach(s => {
      const option = document.createElement('option');
      option.value = s.id;
      option.textContent = s.name;
      select.appendChild(option);
    });
  } catch (err) {
    console.error('Ошибка при загрузке видов спорта:', err);
  }
}

// Загрузка весовых категорий
async function loadWeightCategories() {
  try {
    const response = await fetch('/api/categories');
    if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);

    const categories = await response.json();
    console.log('Весовые категории:', categories);  // <- проверяем что пришло

    const select = document.getElementById('weightCategoryId');
    select.innerHTML = '<option value="">Выберите весовую категорию</option>';

    if (!Array.isArray(categories) || categories.length === 0) {
      console.warn('Категории пустые или не массив');
      return;
    }

    categories.forEach(cat => {
      // Здесь подставляем имя категории - если у тебя другое поле, поменяй на нужное
      const label = cat.weight || cat.title || cat.name || 'Без названия';

      const option = document.createElement('option');
      option.value = cat.id;
      option.textContent = label;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Ошибка при загрузке весовых категорий:', error);
    alert('Не удалось загрузить весовые категории');
  }
}

// Добавление нового матча
async function addMatch(event) {
  event.preventDefault();

  const fighterId = document.querySelector('[name="fighterId"]').value;
  const opponentId = document.querySelector('[name="opponentId"]').value;
  const tournamentId = document.querySelector('[name="tournamentId"]').value;
  const weightCategoryId = document.querySelector('[name="weightCategoryId"]').value;
  const sportId = document.querySelector('[name="sportId"]').value;
  const matchDate = document.querySelector('[name="matchDate"]').value;
  const descriptionInput = document.querySelector('[name="description"]').value;
  const description = descriptionInput.trim() !== '' ? descriptionInput : 'Без описания';

  const matchData = {
    fighterId,
    opponentId,
    tournamentId,
    weightCategoryId,
    sportId,
    date: matchDate,
    result: '',
    method: '',
    event_name: 'Не указан',
    description
  };

  try {
    const response = await fetch('/api/matches', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });

    const data = await response.json();
    if (response.ok) {
      alert('Матч успешно добавлен!');
      displayMatches();
      document.getElementById('match-form').reset();
    } else {
      alert('Ошибка при добавлении матча');
      console.error(data.message);
    }
  } catch (err) {
    console.error('Ошибка при добавлении матча:', err);
    alert('Ошибка при добавлении матча');
  }
}

// Отображение матчей
async function displayMatches() {
  const matchesContainer = document.getElementById('matches-list');
  matchesContainer.innerHTML = '';

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
          <p>Весовая категория: ${match.WeightCategory?.weight || match.WeightCategory?.title || 'Не указана'}</p>
          <p>Дата: ${new Date(match.date).toLocaleString()}</p>
          <button class="btn btn-secondary edit-btn" data-id="${match.id}">Редактировать</button>
          <button class="btn btn-danger" onclick="deleteMatch(${match.id})">Удалить</button>
        `;
        matchesContainer.appendChild(matchElement);
      });

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

// Удаление матча
async function deleteMatch(id) {
  if (confirm('Вы уверены, что хотите удалить этот матч?')) {
    try {
      const response = await fetch(`/api/matches/${id}`, { method: 'DELETE' });
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

// Редактирование матча
async function editMatch(id) {
  try {
    const response = await fetch(`/api/matches/${id}`);
    const match = await response.json();

    if (response.ok) {
      document.querySelector('[name="fighterId"]').value = match.fighterId;
      document.querySelector('[name="opponentId"]').value = match.opponentId;
      document.querySelector('[name="tournamentId"]').value = match.tournamentId;
      document.querySelector('[name="weightCategoryId"]').value = match.weightCategoryId;
      document.querySelector('[name="sportId"]').value = match.sportId || '';
      document.querySelector('[name="matchDate"]').value = match.date.slice(0, 16);
      document.querySelector('[name="description"]').value = match.description;

      const form = document.getElementById('match-form');
      form.removeEventListener('submit', addMatch);
      form.addEventListener('submit', (event) => updateMatch(event, id), { once: true });
    } else {
      alert('Ошибка при получении данных матча');
    }
  } catch (err) {
    console.error('Ошибка при получении данных матча:', err);
    alert('Ошибка при получении данных матча');
  }
}

// Обновление матча
async function updateMatch(event, id) {
  event.preventDefault();

  const fighterId = document.querySelector('[name="fighterId"]').value;
  const opponentId = document.querySelector('[name="opponentId"]').value;
  const tournamentId = document.querySelector('[name="tournamentId"]').value;
  const weightCategoryId = document.querySelector('[name="weightCategoryId"]').value;
  const sportId = document.querySelector('[name="sportId"]').value;
  const matchDate = document.querySelector('[name="matchDate"]').value;
  const descriptionInput = document.querySelector('[name="description"]').value;
  const description = descriptionInput.trim() !== '' ? descriptionInput : 'Без описания';

  const matchData = {
    fighterId,
    opponentId,
    tournamentId,
    weightCategoryId,
    sportId,
    date: matchDate,
    result: '',
    method: '',
    event_name: 'Не указан',
    description
  };

  try {
    const response = await fetch(`/api/matches/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(matchData)
    });

    const data = await response.json();
    if (response.ok) {
      alert('Матч успешно обновлен!');
      displayMatches();
      document.getElementById('match-form').reset();
      document.getElementById('match-form').addEventListener('submit', addMatch);
    } else {
      alert('Ошибка при обновлении матча');
    }
  } catch (err) {
    console.error('Ошибка при обновлении матча:', err);
    alert('Ошибка при обновлении матча');
  }
}