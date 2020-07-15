const apiConfig = {
  host: 'http://localhost:1337'
};

export const encodeParams = (params) => Object.keys(params).map((key) => {
  return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
}).join('&');

class Api {
  executeCall = async (method, endpoint, params = null) => {
    let options = {
      method,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-Requested-With': 'XmlHttpRequest',
      },
    };
    
    if(params && typeof params == 'object' && Object.keys(params).length !== 0){
      if(method === 'GET'){
        endpoint += '?' + encodeParams(params);
      }else{
        options.body = JSON.stringify(params);
      }
    }

    let response = await fetch(endpoint, options);
    try { 
      return response.json();
    } catch(error) {
      return { error };
    } 
  }

  userSignup = async (data) => {
    return await this.executeCall('POST', `${apiConfig.host}/users/signup`, data);
  };

  userLogin = async (data) => {
    return await this.executeCall('POST', `${apiConfig.host}/users/login`, data);
  };

  apiErrorsToFormik = (errors) => {
    let formErrors = {}
    errors.data.forEach((v, i) => {
      let e = '';
      Object.keys(v.constraints).forEach((c) => {
        e += v.constraints[c];
      });
  
      formErrors[v.field] = e;
    });
  
    return formErrors;
  }
}

export default new Api();