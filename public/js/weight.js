
document.getElementById('category-form').addEventListener('submit', async function (e) {
  e.preventDefault();
const weight = document.getElementById('category-weight').value;

const res = await fetch('/api/categories', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ weight }) // <-- вот так должно быть
});
  if (res.ok) {
    document.getElementById('category-weight').value = '';
    loadCategories();
  } else {
    alert('Ошибка при добавлении категории');
  }
});

async function loadCategories() {
  const res = await fetch('/api/categories');
  const data = await res.json();

  const list = document.getElementById('category-list');
  list.innerHTML = '';
  data.forEach(cat => {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.textContent = cat.weight;
    list.appendChild(li);
  });
}

document.addEventListener('DOMContentLoaded', loadCategories);

