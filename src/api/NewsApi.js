import axios from 'axios';

const API_KEY = 'eec3ca45f9114e9eb2bd56b4d5de571b'; // replace this with your API key
const BASE_URL = 'https://newsapi.org/v2/top-headlines?country=us';

export const fetchTopHeadlines = async () => {
  const response = await axios.get(`${BASE_URL}&apiKey=${API_KEY}`);
  return response.data.articles;
};
