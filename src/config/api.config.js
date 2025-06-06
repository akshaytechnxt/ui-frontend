const NODE_ENV = 'development';

const DEV_BASE_URL = 'https://creditx-node-dev.salesdrive.app/';
const UAT_BASE_URL = 'https://creditx-node-dev.salesdrive.app/'; // WE WILL ADD LATER
const PROD_BASE_URL = 'https://b2bnode.iorta.in/b2b/'; // WE WILL ADD LATER
const PR_AMERICANO_DEV_BASE_URL = 'https://pramericanodedev.salesdrive.app/sdx-api/';

const _config = {
  baseURL: NODE_ENV === 'development' ? DEV_BASE_URL : NODE_ENV === 'uat' ? UAT_BASE_URL : NODE_ENV === 'pr_americano_dev' ? PR_AMERICANO_DEV_BASE_URL : PROD_BASE_URL,
  auth: 'auth/',
 // secure: 'secure/',
  secure: '',
  NODE_ENV: NODE_ENV
};

export default _config;
