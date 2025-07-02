// Только CSS (без JS-компонентов)
import 'bootstrap/dist/css/bootstrap.min.css'
import './style.css' // Ваши кастомные стили

document.querySelector('#app').innerHTML = `
  <div class="container mt-4">
    <h1 class="text-center mb-4">RSS Aggregator</h1>
    <p>Начните читать RSS сегодня! Это легко, это красиво.</p>
    <form class="mb-4">
    <div class="input-group">
      <input type="text" class="form-control" placeholder="Ссылка RSS" required>
      <button class="btn btn-primary" type="submit">Добавить</button>
    </div>
  </form>
  <div id="feeds"></div>
`