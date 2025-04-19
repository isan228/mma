// Функция добавления тренера
function addTrainer(event) {
    event.preventDefault(); // предотвращаем перезагрузку страницы
  
    const newTrainer = {
      name: trainerName.value,
      team: trainerTeam.value,
      experience: trainerExperience.value,
      photo_url: trainerPhoto.value || 'https://via.placeholder.com/50',
    };
  
    // Отправляем данные на сервер
    fetch('/api/trainers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTrainer),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Trainer added:', data);
        displayTrainers(); // Обновляем список тренеров
      })
      .catch(err => console.error('Error adding trainer:', err));
  }