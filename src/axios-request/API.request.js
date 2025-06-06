import axios from "axios";
import apiConfig from "../config/api.config";
import { message } from "antd";
import store from "../state/store"; 
import { mockDropdownService } from "../services/mockDropdownService";
import { mockAuthService } from "../services/mockAuthService";
import { mockCollectionService } from "../services/mockCollectionService";

axios.defaults.withCredentials = true
// const { store } = rootIndex;
const { baseURL, auth, secure, NODE_ENV } = apiConfig;
// console.log('STOREE---------------------',user.userData.data.data.jwt)

// it will execute the request
// common function for all methods
const ExecRequest = (config, options = { secure: true, multipart: false }) => {
  // const _store = store.getState();

  function promiseCallback(resolve) {
    const { user } = store.getState(); // Move inside the function

    // Handle mock services in development mode
    if (NODE_ENV === 'development') {
      // Handle dropdown API calls
      if (config.url.includes('master/dropdown/find_all')) {
        const type = config.url.split('type=')[1];
        mockDropdownService.getDropdownData(type)
          .then(response => resolve(response))
          .catch(error => resolve(error.response));
        return;
      }

      // Handle collection API calls
      if (config.url.includes('proposal/find-all-collection')) {
        const params = new URLSearchParams(config.url.split('?')[1]);
        const page = params.get('page');
        const limit = params.get('limit');
        const status = params.get('status');
        
        mockCollectionService.getCollections({ page, limit, status })
          .then(response => resolve(response))
          .catch(error => resolve(error.response));
        return;
      }

      if (config.url.includes('proposal/get-collection')) {
        const id = config.url.split('/').pop();
        mockCollectionService.getCollectionById(id)
          .then(response => resolve(response))
          .catch(error => resolve(error.response));
        return;
      }

      // Handle auth API calls
      if (config.url.includes('auth')) {
        mockAuthService.handleAuthRequest(config.method, config.url, config.data)
          .then(response => resolve(response))
          .catch(error => resolve(error.response));
        return;
      }
    }

    let headers = {
      "Content-Type": options.multipart
        ? "multipart/form-data"
        : "application/json",
    };
    headers = options.secure
      ? {
          ...headers,
         authorization: "Bearer " + user?.userData?.data?.data?.jwt,
        }
      : headers;
    config.url = `${baseURL}${options.secure ? secure : auth}${config.url}`;
    axios({ ...config, headers: headers })
      .then((res) => {
        const errCode = res.resCode;
          const data = res.data;

        if (errCode === -1) {
          resolve(data.msg);
        } else if (errCode === 2061) {
          resolve(data.msg);
          message.success(data.msg);
        } else if (errCode === 2601) {
          resolve(data);
        } else {
            resolve(data);
        }
      })
      .catch((error) => {
        console.log('error=============',error)
        message.destroy();
        // alert("erorrrrrrrrrrrrrr")
        if (error.response) {
          // Handle specific status codes
          const status = error.response.status;
          const responseCode = error.response.data?.resCode;

          if (responseCode === 9) {
            window.location.replace("/");
          }
          //  else if (status === 400) {
          //   //message.error(error.response.data.data.msg);
          // } else {
          //   //message.error(error.response.data.data.msg);
          // }
          resolve(error.response.data);
        } else if (error.request) {
          //message.error("Request failed");
        } else {
          // console.error(error);
          //message.error(`${error.name}: ${error.message}`);
        }
        resolve(null);
      });
  }
  return new Promise(promiseCallback);
};

export default {
  get: async (endPoint, options = { secure: true, multipart: false }) => {
    options = options.multipart
      ? options
      : {
          ...options,
          multipart: false,
        };
    let result = await ExecRequest(
      {
        method: "get",
        url: endPoint,
      },
      options
    );

    return !result ? [] : result;
  },
  post: async (
    endPoint,
    dataBody,
    options = { secure: true, multipart: false }
  ) => {
    options = options.multipart
      ? options
      : {
          ...options,
          multipart: false,
        };
    let result = await ExecRequest(
      {
        method: "post",
        url: endPoint,
        data: dataBody,
      },
      options
    );
      // return result
     return !result ? [] : result;
  },
  put: async (
    endPoint,
    dataBody,
    options = { secure: true, multipart: false }
  ) => {
    options = options.multipart
      ? options
      : {
          ...options,
          multipart: false,
        };
    let result = await ExecRequest(
      {
        method: "put",
        url: endPoint,
        data: dataBody,
      },
      options
    );

    return !result ? [] : result;
  },

  delete: async (endPoint, options = { secure: true }) => {
    let result = await ExecRequest(
      {
        method: "delete",
        url: endPoint,
      },
      options
    );

    return !result ? [] : result;
  }
};
