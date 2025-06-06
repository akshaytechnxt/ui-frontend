import axios from "axios";
import apiConfig from "../config/api.config";
import { message } from "antd";
import rootIndex from "../store/root_index";

const { store } = rootIndex;
const { baseURL, auth, secure, NODE_ENV } = apiConfig;

// it will execute the request
// common function for all methods
const ExecRequest = (config, options = { secure: true, multipart: false }) => {
  const _store = store.getState();

  function promiseCallback(resolve) {
    let headers = {
      "Content-Type": options.multipart
        ? "multipart/form-data"
        : "application/json",
    };
    headers = options.secure
      ? {
          ...headers,
          authorization: "Bearer " + _store.login.token,
        }
      : headers;
    config.url = `${baseURL}${options.secure ? secure : auth}${config.url}`;
    // console.log("Request: ", { ...config, headers: headers });
    // if (config.method === "get") message.destroy();
    axios({ ...config, headers: headers })
      .then((res) => {
        const errCode = res.data.errCode;
        const data = res.data;
        
        if (config.method !== "get") message.destroy();

        if (errCode === -1) {
          if (typeof data.errMsg === "string") {
            // alert(data.errMsg)
            if (config.method === "put") {
              if (config.url.includes("update-opportunity")) message.success(data.errMsg);
            }else{
              message.warning(data.errMsg);
            }
            
          } else {
            // console.warn('API___URL____',config)
            // alert('Your request has been resolved successfully');
            if (config.method === "post") {
              // console.warn('API___URL____',config.url.hasOwnProperty('todo_task'))
              if (config.url.includes("todo_task"))
                message.success("Todo Created successfully");
              if (config.url.includes("bookAppointment"))
                message.success("Event Created successfully");
              if (config.url.includes("addlead"))
                message.success("Lead Created successfully");
              if (config.url.includes("postRiskDetailsform"))
                message.success("Risk Details Created Successfully");

              if (config.url.includes("postkdmform"))
                message.success("KDM Details Created Successfully");

              if (config.url.includes("add-opporunity-remark"))
                message.success("Remark Added Successfully");

              if (config.url.includes("create-opportunity"))
                message.success("Opportunity Created Successfully");

              if (config.url.includes("add-company"))
                message.success("Company Added Successfully");

              if (config.url.includes("addproducer"))
                message.success("Producer Created Successfully");


            } else if (config.method === "put") {
              if (config.url.includes("update_task_status"))
                message.success("Todo Updated successfully");
              if (config.url.includes("updateAppointment"))
                message.success("Event Updated successfully");
              if (config.url.includes("updateLead"))
                message.success("Lead Updated successfully");

              if (config.url.includes("updateriskform"))
                message.success("Risk Details Updated Successfully");

              if (config.url.includes("updatekdmform"))
                message.success("KDM Details Updated Successfully");
            }
            // if (config.method !== "get") message.success("Your data fetched successfully");
            // if (config.method === "put") message.success("Data updated successfully");
          }
          resolve(data.errMsg);
        } else if (errCode === 2061) {
          resolve(data.errMsg);
          message.success(data.errMsg);
        } else if (errCode === 2601) {
          // resolve(data.errMsg);
          if (config.method === "put") {
            if (config.url.includes("manualAllocation_lead"))
              message.warning("No matching leads are found");
          } else if (config.method === "get") {
            message.warning(data.errMsg);
          }
          resolve([]);
        } else {
          // alert(data.errMsg);
          if (config.method !== "get") //message.error(data.errMsg);
          // //message.error(data.errMsg);
          resolve(null);
        }
      })
      .catch((error) => {
        message.destroy();
        // if (config.method === "get") message.destroy();
        if (error.response) {
          // console.log('I AM IN CATCHHHHH',error.response);
          // alert(error.response.data.errMsg);
          //message.error(error.response.data.errMsg);
          if (error.response.status === 400 || error.response.status === 401) {
            try {
              // validation error is comes in 400
              // custom error code validation needs to apply here
              // VALIDATION_ERROR = 81
              if (error.response.data.errCode === 81) {
                // for validation error purpos
              }
              // store and local storage will clear on token expired, invalid
              // if token is not sent from the application
              // we consider this type of request is "invalid"
              else if (error.response.data.errCode === 25) {
                window.location.replace("/login");
                // let self = this;
                // this.$router.push('/login');
                // setTimeout(() => {
                //   // here I have call reset method
                //   self.resetStore();
                //   localStorage.setItem('vue_store', process.env.state);
                // }, 3000);
              }else if (error.response.data.errCode === 1) {
                // console.log('I AM ERRORCODE 1',error.response);
                // resolve([]);
              }
            } catch (error) {
              // alert(error.response.data.errMsg);
              //message.error(error.response.data.errMsg);
            }
          }
        } else if (error.request) {
          // alert('Request failed')
          //message.error("Request failed");
        } else {
          console.error(error);
          // alert(`${error.name}: ${error.message}`)
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
};
