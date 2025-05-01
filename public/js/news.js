document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('news-form');
    const newsList = document.getElementById('news-list');
  
    // Загрузка новостей при загрузке страницы
    loadNews();
  
    // Отправка формы
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const newsData = {
        title: formData.get('title'),
        content: formData.get('content')
      };
  
      try {
        const res = await fetch('/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newsData)
        });
  
        if (!res.ok) throw new Error('Ошибка при добавлении новости');
  
        form.reset(); // очистить форму
        loadNews();   // обновить список новостей
      } catch (err) {
        alert(err.message);
      }
    });
  
    // Функция загрузки новостей
    async function loadNews() {
      try {
        const res = await fetch('/news');
        const news = await res.json();
        newsList.innerHTML = '';
  
        news.forEach(n => {
          const item = document.createElement('li');
          item.className = 'list-group-item';
          item.innerHTML = `
            <strong>${n.title}</strong><br>
            <small>${new Date(n.publishedAt).toLocaleString()}</small><br>
            <p>${n.content}</p>
            <button class="btn btn-warning btn-sm" onclick="editNews(${n.id}, '${n.title}', '${n.content}')">Редактировать</button>
            <button class="btn btn-danger btn-sm" onclick="deleteNews(${n.id})">Удалить</button>
          `;
          newsList.appendChild(item);
        });
      } catch (err) {
        newsList.innerHTML = '<li class="list-group-item text-danger">Ошибка при загрузке новостей</li>';
      }
    }
  
    // Функция редактирования новости
    window.editNews = (id, title, content) => {
      // Заполняем форму для редактирования
      form.title.value = title;
      form.content.value = content;
      form.onsubmit = async (e) => {
        e.preventDefault();
        const updatedData = {
          title: form.title.value,
          content: form.content.value
        };
  
        try {
          const res = await fetch(`/news/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
          });
  
          if (!res.ok) throw new Error('Ошибка при обновлении новости');
  
          form.reset();
          loadNews(); // обновляем список новостей
        } catch (err) {
          alert(err.message);
        }
      };
    };
  
    // Функция удаления новости
    window.deleteNews = async (id) => {
      if (confirm('Вы уверены, что хотите удалить эту новость?')) {
        try {
          const res = await fetch(`/news/${id}`, {
            method: 'DELETE',
          });
  
          if (!res.ok) throw new Error('Ошибка при удалении новости');
  
          loadNews(); // обновляем список новостей
        } catch (err) {
          alert(err.message);
        }
      }
    };
  });