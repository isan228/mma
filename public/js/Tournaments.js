let editingTournamentId = null;

// Загрузка турниров
async function loadTournaments() {
    try {
        const response = await fetch('/api/tournaments');
        const tournaments = await response.json();
        const list = document.getElementById('tournament-list');
        list.innerHTML = '';

        tournaments.forEach(tournament => {
            const li = document.createElement('li');
            li.className = 'list-group-item d-flex justify-content-between align-items-center';
            li.id = `tournament-${tournament.id}`;
            li.innerHTML = `
                <span class="tournament-name">${tournament.name} - ${tournament.location} (${new Date(tournament.date).toLocaleString()})</span>
                <div>
                    <button class="btn btn-sm btn-warning me-2" onclick="editTournament(${tournament.id})">Редактировать</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteTournament(${tournament.id})">Удалить</button>
                </div>
            `;
            list.appendChild(li);
        });
    } catch (err) {
        console.error(err);
    }
}

// Обработчик отправки формы
document.getElementById('tournament-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const formData = {};

    data.forEach((value, key) => {
        formData[key] = value;
    });

    try {
        let response;

        if (editingTournamentId) {
            response = await fetch(`/api/tournaments/${editingTournamentId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        } else {
            response = await fetch('/api/tournaments', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
        }

        if (response.ok) {
            alert(editingTournamentId ? 'Турнир обновлён' : 'Турнир добавлен');
            form.reset();
            editingTournamentId = null;
            document.querySelector('button[type="submit"]').innerText = 'Добавить турнир';
            loadTournaments();
        } else {
            alert('Ошибка при сохранении турнира');
        }
    } catch (err) {
        console.error(err);
        alert('Ошибка при сохранении турнира');
    }
});

// Удаление турнира
async function deleteTournament(id) {
    if (!confirm('Ты уверен, брат?')) return;

    try {
        const response = await fetch(`/api/tournaments/${id}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            alert('Турнир удалён');
            loadTournaments();
        } else {
            alert('Ошибка при удалении');
        }
    } catch (err) {
        console.error(err);
        alert('Ошибка при удалении');
    }
}

// Редактирование турнира
async function editTournament(id) {
    try {
        const response = await fetch(`/api/tournaments/${id}`);
        const tournament = await response.json();

        document.getElementById('name').value = tournament.name;
        document.getElementById('date').value = new Date(tournament.date).toISOString().slice(0, 16);
        document.getElementById('location').value = tournament.location;
        document.getElementById('description').value = tournament.description;

        document.querySelector('button[type="submit"]').innerText = 'Обновить турнир';
        editingTournamentId = id;
    } catch (err) {
        console.error(err);
        alert('Ошибка при редактировании');
    }
}

// При загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    loadTournaments();
});