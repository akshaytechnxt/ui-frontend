const NODE_ENV = 'development';

const DEV_BASE_URL = 'https://localhost:3000/';
const UAT_BASE_URL = 'https://localhost:3000/'; // WE WILL ADD LATER

const _config = {
  baseURL: NODE_ENV === 'development' ? DEV_BASE_URL : UAT_BASE_URL,
  auth: 'auth/',
 // secure: 'secure/',
  secure: '',
  NODE_ENV: NODE_ENV
};

export default _config;
