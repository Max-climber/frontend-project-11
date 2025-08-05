import { v4 as uuidv4 } from 'uuid';

export default (xmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "text/xml") 

    const parserError = doc.querySelector('parsererror')
    if (parserError) {
        throw new Error('parserError')
    }
    //Это то, что относится к feed
    const feedId = uuidv4();
    const channel = doc.querySelector('channel'); 
    const channelTitle = channel.querySelector('title').textContent;
    const channelDescription = channel.querySelector('description').textContent; 

    const feed = { feedId, title: channelTitle, description: channelDescription }

    //Это то, что относится к posts
    const items = doc.querySelectorAll('item'); // это nodeList, его нужно преобразовать в массив потом

    const posts = Array.from(items).map((item) => {
        const postId = uuidv4();
        return {
            postId,
            title: item.querySelector('title').textContent,
            description: item.querySelector('description').textContent,
            link: item.querySelector('link').textContent 
            }
    })

   return { feed, posts };
}   