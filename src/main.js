import './style.css' // Мои кастомные стили
import 'bootstrap/dist/css/bootstrap.min.css'

import validateUrl from './schema.js';
import watchForm from './watchForm.js';
import i18nextInit from './locales/i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import domParser from './domParser';

i18nextInit().then(() => {
  yup.setLocale({
    mixed: {
      required: () => i18next.t('errors.required'),
      notOneOf: () => i18next.t('errors.dublicate'),
    },
    string: {
      url: () => i18next.t('errors.invalidURl'),
    },
  });


  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    addButton: document.querySelector("[aria-label='add']"),
    feedback: document.querySelector('.feedback'),
    postsContainer: document.querySelector('.posts'),
    feedsContainer: document.querySelector('.feeds'),
    modalContent: document.querySelector('.modal-content')
  };


  const state = watchForm(elements, {
    form: {
      status: 'filling', // "processing", "failed", "success"
      error: null,
      feeds: [],
      posts: [],
    },
  });

  elements.form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    try {
      await validateUrl(state.form.feeds).validate({ url });
      //загружаем RSS с помощью прокси, парсим, обновляем состояние
      const proxyURL = new URL('https://allorigins.hexlet.app/get')
      proxyURL.searchParams.append('disableCache', 'true') //отключаем кеш
      proxyURL.searchParams.append('url', url) 

      const response = await axios.get(proxyURL)  // надо поменять на axios.get('url').then(что то делаешь внутри).catch(обрабатываешь ошибку), тк await нельзя использовать сейчас

      const { feed, posts} = domParser(response.data.contents);
      
      state.form.feeds.push(feed);
      state.form.posts.push(...posts);

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
