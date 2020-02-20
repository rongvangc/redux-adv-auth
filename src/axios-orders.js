import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://burger-app-f07ad.firebaseio.com/'
})

export default instance