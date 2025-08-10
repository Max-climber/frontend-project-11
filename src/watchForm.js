//Слой View (тот, где вотчеры)
import onChange from 'on-change';

const renderError = (elements, error) => {
  elements.input.classList.toggle('is-invalid', !!error); // если есть error (выдаст true), то добавляем 'is-invalid'
  elements.feedback.textContent = error || '';
};

const renderPosts = (elements, posts) => {
  elements.postsContainer.innerHTML = '';

  const divForPosts = document.createElement('div');
  divForPosts.classList.add("card", "border-0");

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');
  
  const h2Posts = document.createElement('h2');
  h2Posts.classList.add('card-title', 'h4');
  h2Posts.textContent = 'Посты';

  cardBody.appendChild(h2Posts);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  posts.forEach((post) => {
    const li = document.createElement('li');
    li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const a = document.createElement('a');
    a.setAttribute('href', post.link);
    a.classList.add('fw-bold');
    a.setAttribute('target', '_blank');
    a.setAttribute('data-id', post.postId);
    a.setAttribute('rel', 'noopener noreferrer');
    a.textContent = post.title;

    const modalButton = document.createElement('button');
    modalButton.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    modalButton.setAttribute('type', 'button');
    modalButton.setAttribute('data-id', post.postId);
    modalButton.setAttribute('data-bs-toggle', 'modal');
    modalButton.setAttribute('data-bs-target', '#modal');
    modalButton.textContent = 'Просмотр'

    li.append(a, modalButton);
    ul.append(li);
  })
  
  divForPosts.append(cardBody);
  divForPosts.append(ul);
  elements.postsContainer.appendChild(divForPosts);
}

const renderFeed = (elements, feeds) => {
  elements.feedsContainer.innerHTML = '';
  const divForFeed = document.createElement('div');
  divForFeed.classList.add("card", "border-0");

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const h2Feed = document.createElement('h2');
  h2Feed.classList.add('card-title', 'h4');
  h2Feed.textContent = 'Фиды';

  cardBody.append(h2Feed);
  divForFeed.append(cardBody);

  const ul = document.createElement('ul');
  ul.classList.add('list-group', 'border-0', 'rounded-0');

  feeds.forEach((feed) => {
  const li = document.createElement('li');
    li.classList.add('list-group-item', 'border-0', 'border-end-0');

    const h3 = document.createElement('h3');
    h3.classList.add('h6', 'm-0');
    h3.textContent = feed.title;

    const p = document.createElement('p');
    p.classList.add('m-0', 'text-black-50');
    p.textContent = feed.description;

    li.append(h3, p);
    ul.append(li);
  })
 

 
  divForFeed.append(ul);

  elements.feedsContainer.appendChild(divForFeed);
}

export default (elements, state) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'form.error') {
      renderError(elements, state.form.error);
    }
    
    if (path === 'form.feeds') {
      renderFeed(elements, state.form.feeds)
    }

    if(path === 'form.posts') {
      renderPosts(elements, state.form.posts)
    }
  });

  return watchedState;
};
