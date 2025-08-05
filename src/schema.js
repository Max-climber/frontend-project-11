import * as yup from 'yup';


const validateUrl = (feeds) => yup.object({
  url: yup
    .string()
    .required()
    .url()
    .notOneOf(feeds)
});

export default validateUrl;