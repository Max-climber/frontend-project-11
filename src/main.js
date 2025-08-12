import './style.css' // Мои кастомные стили
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import validateUrl from './schema.js';
import watchForm from './watchForm.js';
import i18nextInit from './locales/i18next';
import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import DOMParser from './DOMParser.js';

i18nextInit()
.then(() => {
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
    modalHeader: document.querySelector('.modal-header'),
    modalBody: document.querySelector('.modal-body'),
    modalFooter: document.querySelector('.modal-footer'),
  };


  const state = watchForm(elements, {
    form: {
      status: 'filling', // "processing", "failed", "success"
      error: null,
      feeds: [],
      posts: [],
      viewedPosts: [] //прочитанные посты
    },
  });

  // раз в 5 секунд проверяем каждый RSS-поток, и если он содержит новые посты, добавляем их в список
  const updatePosts = () => {
    const request = state.form.feeds.map((feed) => {
      const proxyURL = new URL('https://allorigins.hexlet.app/get')
        proxyURL.searchParams.append('disableCache', 'true') //отключаем кеш
        proxyURL.searchParams.append('url', feed.url) 

        return axios.get(proxyURL)
          .then((response) => {
            const { posts } = DOMParser(response.data.contents);
            const newPosts = posts.filter((post) => !state.form.posts.some((existedPost) => existedPost.link === post.link))

            state.form.posts.push(...newPosts);
          })
        })
      
        Promise.all(request)
        .catch((err) => {
          console.log('ошибка в updatedPost:', err);
         })
         .finally(() => setTimeout(updatePosts, 5000))
         
         
  }  

  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const url = formData.get('url').trim();

    try {
      validateUrl(state.form.feeds)
      .validate({ url })
      .then(() => {
        const proxyURL = new URL('https://allorigins.hexlet.app/get')
        proxyURL.searchParams.append('disableCache', 'true') //отключаем кеш
        proxyURL.searchParams.append('url', url) 

        return axios.get(proxyURL)
      })
      .then((response) => {
        const { feed, posts } = DOMParser(response.data.contents);

        state.form.feeds.push({...feed, url});
        console.log(state.form.feeds);
        state.form.posts.push(...posts);


        state.form.error = null;
        elements.feedback.classList.remove('text-danger');
        elements.feedback.classList.add('text-success');

        elements.feedback.textContent = i18next.t('success');

        if(state.form.feeds.length === 1) {
          updatePosts();
        }

        elements.input.value = '';
        elements.input.focus();
      }) 
      .catch((err) => {
        if( err.message === 'parserError') {
          state.form.error = i18next.t('errors.notRSSUrl')
          console.log(state.form.error);
        } else if(err.code === 'ERR_NETWORK'){
          state.form.error = i18next.t('errors.network')
          console.log('находися в блоке ошибки сети');
        } else {
          state.form.error = err.message;
        }
        elements.feedback.classList.remove('text-success');
        elements.feedback.classList.add('text-danger');
        elements.feedback.textContent = state.form.error;
      });
    } catch (err) {
      state.form.error = err.message;

      elements.feedback.classList.remove('text-success');
      elements.feedback.classList.add('text-danger');
      elements.feedback.textContent = err.message;
      console.log('попали в блок ошибок', err);
    }
  });

  elements.postsContainer.addEventListener('click', (event) => {
     
    const button = event.target.closest('[data-bs-toggle="modal"]');

    if(!button) return //клик не по кнопке "Просмотр"


    const buttonId = button.getAttribute('data-id');
    const post = state.form.posts.find((p) => p.postId === buttonId)
    const h5ModalTitle = elements.modalHeader.querySelector('.modal-title')
    h5ModalTitle.textContent = post.title

    elements.modalBody.textContent = post.description
    if (!state.form.viewedPosts.includes(post.postId)) {
      state.form.viewedPosts.push(post.postId);
    }
    
    const reedAllBtn = elements.modalFooter.querySelector('.btn.btn-primary.full-article'); // кнопка "Читать полоностью"
    if (reedAllBtn) {
      const linkHref = post.link
      reedAllBtn.setAttribute('href', linkHref)
      reedAllBtn.addEventListener('keyup', (e) => {
        if (e.keyCode === 13 || e.keyCode === 32) {
        window.location.href = e.target.linkHref;
      }
      })
    } 
  })
})
