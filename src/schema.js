import * as yup from 'yup'

const validateUrl = (feeds) => {
  const urls = feeds.map(feed => feed.url)

  return yup.object({
    url: yup
      .string()
      .required()
      .url()
      .notOneOf(urls),
  })
}

export default validateUrl
