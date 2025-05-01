document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault(); // Предотвратить стандартную отправку формы
  
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    // Отправляем запрос на сервер для авторизации
    try {
      const response = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Если авторизация успешна, сохраняем токен в localStorage
        localStorage.setItem('token', data.token);
        window.location.href = '/dashboard'; // Перенаправляем на защищенную страницу
      } else {
        // Если ошибка авторизации
        document.getElementById('errorMessage').style.display = 'block';
      }
    } catch (error) {
      console.error('Ошибка при отправке данных:', error);
      document.getElementById('errorMessage').style.display = 'block';
    }
  });
  