//Слой View (тот, где вотчеры)
import onChange from 'on-change';

const renderError = (elements, error) => {
  elements.input.classList.toggle('is-invalid', !!error);
  elements.feedback.textContent = error || '';
};

export default (elements, state) => {
  const watchedState = onChange(state, (path) => {
    if (path === 'form.error') {
      renderError(elements, state.form.error);
    }
    if (path === 'form.feeds') {
      elements.form.reset();
      elements.input.focus();
    }
  });

  return watchedState;
};