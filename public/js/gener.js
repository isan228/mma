  // Загружаем турниры
  async function loadTournaments() {
    const response = await fetch('/api/tournaments');
    const tournaments = await response.json();

    const tournamentSelect = document.getElementById('tournamentSelect');
    tournaments.forEach(tournament => {
      const option = document.createElement('option');
      option.value = tournament.id;
      option.textContent = tournament.name;
      tournamentSelect.appendChild(option);
    });
  }
  async function loadSports() {
  const response = await fetch('/api/sports');
  const sports = await response.json();

  const sportSelect = document.getElementById('sportSelect');
  sports.forEach(sport => {
    const option = document.createElement('option');
    option.value = sport.id;
    option.textContent = sport.name;
    sportSelect.appendChild(option);
  });
}
async function loadWeightCategories() {
    const response = await fetch('/api/categories');
    const categories = await response.json();
    console.log('Категории:', categories); // Добавь это
  
    const weightCategorySelect = document.getElementById('weightCategorySelect');
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category.id;
      option.textContent = category.name || category.title || category.weight; // <-- подстраховка
      weightCategorySelect.appendChild(option);
    });
  }
  // Загружаем участников для выбранного турнира
  async function loadFighters(tournamentId) {
    const sportId = document.getElementById('sportSelect').value;
  const weightCategoryId = document.getElementById('weightCategorySelect').value;

  const response = await fetch(`/api/tournaments/${tournamentId}/fighters?sportId=${sportId}&weightCategoryId=${weightCategoryId}`);
  const fighters = await response.json();
    console.log(fighters);
    const fightersList = document.getElementById('fightersList');
    fightersList.innerHTML = ''; // очищаем список
    fighters.forEach(fighter => {
      const div = document.createElement('div');
      div.classList.add('form-check');
      div.innerHTML = `  
        <input class="form-check-input" type="checkbox" value="${fighter.id}" id="fighter${fighter.id}">
        <label class="form-check-label" for="fighter${fighter.id}">
          ${fighter.name} (${fighter.team})
        </label>
      `;
      fightersList.appendChild(div);
    });

    document.getElementById('fightersDiv').style.display = 'block';
    document.getElementById('generateBtn').style.display = 'inline-block';
  }

  // Генерация турнирной сетки
  async function generateTournamentMatches() {
  const tournamentId = document.getElementById('tournamentSelect').value;
  const selectedFighters = Array.from(document.querySelectorAll('input[type="checkbox"]:checked')).map(input => input.value);

  if (selectedFighters.length < 2) {
    alert('Для генерации сетки нужно хотя бы два бойца.');
    return;
  }

  const response = await fetch(`/api/tournaments/${tournamentId}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tournamentId, fighters: selectedFighters })
  });

  const data = await response.json();

  if (data.message) {
    alert(data.message);
  }

  if (data.matches) {
    displayBracket(data.matches);
  }
}
  function renderBracket(matches) {
  const bracketDiv = document.getElementById('bracket');
  bracketDiv.innerHTML = ''; // Очистить предыдущую сетку

  matches.forEach((match, index) => {
    const matchDiv = document.createElement('div');
    matchDiv.classList.add('match');
    matchDiv.innerHTML = `
      <div class="fighter">${match.fighter1 ? match.fighter1.name : '???'}</div>
      <div class="fighter">${match.fighter2 ? match.fighter2.name : '???'}</div>
    `;
    bracketDiv.appendChild(matchDiv);
  });
}

function displayBracket(matches) {
  const bracket = document.getElementById('bracket');
  bracket.innerHTML = ''; // Очищаем

  matches.forEach((match, index) => {
    const card = document.createElement('div');
    card.className = 'col-10 col-md-6';

    card.innerHTML = `
      <div class="card bg-dark text-white shadow">
        <div class="card-body">
          <h5 class="card-title text-center">Бой ${index + 1}</h5>
         <p class="card-text text-center">
  ${match.fighter1?.name || '???'} (${match.fighter2?.team?.name || '???'})
</p>
          <p class="card-text text-center">VS</p>
          <p class="card-text text-center">
  ${match.fighter2?.name || '???'} (${match.fighter2?.team?.name || '???'})
</p>
        </div>
      </div>
    `;

    bracket.appendChild(card);
  });

  document.getElementById('bracketContainer').style.display = 'block';
}
 
  // Обработчики событий
  document.getElementById('tournamentSelect').addEventListener('change', (e) => {
    loadFighters(e.target.value);
  });

  document.getElementById('generateBtn').addEventListener('click', generateTournamentMatches);

  // Инициализация
  loadTournaments();
loadSports();
loadWeightCategories();