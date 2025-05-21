document.getElementById('sport-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    const name = document.getElementById('sport-name').value;

    const res = await fetch('/api/sports', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });

    if (res.ok) {
      document.getElementById('sport-name').value = '';
      loadSports();
    } else {
      alert('Ошибка при добавлении спорта');
    }
  });

  async function loadSports() {
    const res = await fetch('/api/sports');
    const sports = await res.json();
    const list = document.getElementById('sport-list');
    list.innerHTML = '';
    sports.forEach(s => {
      const li = document.createElement('li');
      li.className = 'list-group-item';
      li.textContent = s.name;
      list.appendChild(li);
    });
  }

  // Загружаем стили при открытии вкладки
  function showTab(tabId) {
    document.querySelectorAll('.tab').forEach(tab => tab.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');

    if (tabId === 'sports') loadSports();
  }