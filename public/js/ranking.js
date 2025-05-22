document.addEventListener('DOMContentLoaded', () => {
    const genderSelect = document.getElementById('gender');
    const weightCategorySelect = document.getElementById('weightCategory');
    const sportSelect = document.getElementById('sport');
    const filterForm = document.getElementById('filterForm');
    const rankingTable = document.getElementById('rankingTable');
    const rankingTbody = rankingTable.querySelector('tbody');
  
    // Скрыть таблицу рейтинга пока нет данных
    rankingTable.style.display = 'none';
  
    // Функция для загрузки весовых категорий
    async function loadWeightCategories() {
      try {
        const res = await fetch('/api/categories');
        if (!res.ok) throw new Error('Ошибка сети при загрузке категорий');
        const data = await res.json();
  
        // Очистить текущие опции кроме первой (например, "Выберите весовую категорию")
        weightCategorySelect.length = 1;
  
        data.forEach(cat => {
          const option = document.createElement('option');
          option.value = cat.id;
          option.textContent = cat.weight || cat.name || 'Без названия';
          weightCategorySelect.appendChild(option);
        });
      } catch (err) {
        console.error('Ошибка загрузки весовых категорий', err);
      }
    }
  
    // Функция для загрузки видов спорта
    async function loadSports() {
      try {
        const res = await fetch('/api/sports');
        if (!res.ok) throw new Error('Ошибка сети при загрузке видов спорта');
        const data = await res.json();
  
        // Очистить текущие опции кроме первой
        sportSelect.length = 1;
  
        data.forEach(sport => {
          const option = document.createElement('option');
          option.value = sport.id;
          option.textContent = sport.name || 'Без названия';
          sportSelect.appendChild(option);
        });
      } catch (err) {
        console.error('Ошибка загрузки видов спорта', err);
      }
    }
  
    // Загрузить фильтры при старте
    loadWeightCategories();
    loadSports();
  
    filterForm.addEventListener('submit', async (e) => {
      e.preventDefault();
  
      const gender = genderSelect.value;
      const weightCategoryId = weightCategorySelect.value;
      const sportId = sportSelect.value;
  
      if (!gender || !weightCategoryId || !sportId) {
        alert('Пожалуйста, заполните все поля фильтра');
        return;
      }
  
      try {
        const url = `/ranking?gender=${encodeURIComponent(gender)}&weightCategoryId=${encodeURIComponent(weightCategoryId)}&sportId=${encodeURIComponent(sportId)}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Ошибка сети при загрузке рейтинга');
        const fighters = await res.json();
  
        // Очистить таблицу
        rankingTbody.innerHTML = '';
  
        if (fighters.length === 0) {
          rankingTable.style.display = 'none';
          alert('По заданным параметрам бойцов не найдено');
          return;
        }
  
        // Заполнить таблицу
        fighters.forEach(f => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${f.name}</td>
            <td>${f.wins}</td>
            <td>${f.totalFights}</td>
            <td>${f.weightCategory}</td>
            <td>${f.sport}</td>
          `;
          rankingTbody.appendChild(tr);
        });
  
        rankingTable.style.display = 'table';
      } catch (err) {
        console.error('Ошибка загрузки рейтинга', err);
        alert('Ошибка при загрузке рейтинга');
        rankingTable.style.display = 'none';
      }
    });
  });
  