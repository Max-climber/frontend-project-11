import * as yup from 'yup';

const validateUrl = (feeds) => yup.object({
  url: yup
    .string()
    .required('Ссылка обязательна')
    .url('Ссылка должна быть валидным URL')
    .notOneOf(feeds, 'RSS уже существует')
});

export default validateUrl;