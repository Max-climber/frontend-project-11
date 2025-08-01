import './style.css' // Мои кастомные стили
import 'bootstrap/dist/css/bootstrap.min.css'

import validateUrl from './validation/schema.js';
import watchForm from './view/watchForm.js';
import i18nextInit from './locales/i18next';
import * as yup from 'yup';
import i18next from 'i18next';

i18nextInit().then(() => {
  yup.setLocale({
    mixed: {
      required: () => i18next.t('errors.invalidURl'),
      notOneOf: () => i18next.t('errors.dublicate'),
    },
    string: {
      url: () => i18next.t('errors.invalidURl'),
    },
  });

  const app = document.getElementById('app');
  app.innerHTML = `
    <form class="rss-form">
      <div class="form-floating">
        <input id="url-input" autofocus="" type="text" required="" name="url" aria-label="url" class="form-control w-100" placeholder="ссылка RSS" autocomplete="off">
        <label for="url-input">Ссылка RSS</label>
      </div>
      <button type="submit" class="btn btn-primary mt-3">Добавить</button>
      <div class="feedback text-danger mt-2 small"></div>
    </form>
  `;

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    feedback: document.querySelector('.feedback'),
  };


  const state = watchForm(elements, {
    form: {
      error: null,
      feeds: [],
    },
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    try {
      await validateUrl(state.form.feeds).validate({ url });
      state.form.feeds.push(url);
      state.form.error = null;
      elements.feedback.classList.remove('text-danger');
      elements.feedback.classList.add('text-success');

      elements.feedback.textContent = i18next.t('success');
    } catch (err) {
      state.form.error = err.message;

      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = err.message;
    }
  });
})
