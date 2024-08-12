import axios, { AxiosInstance, AxiosResponse } from 'axios';

const API_URL = 'http://20.205.178.13:8001';

class Api {
  private mainApi: AxiosInstance;

  constructor() {
    this.mainApi = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  private responseHandler(res: AxiosResponse) {
    if (res.status >= 200 && res.status < 300) {
      return res.data;
    } else {
      throw new Error(
        JSON.stringify({
          status: res.status,
          message: res.data ? res.data.message : 'Произошла ошибка',
        }),
      );
    }
  }

  public register(email: string, password: string, repeat: string) {
    return this.mainApi
      .post('/registration/', { email, password, repeat_password: repeat })
      .then(this.responseHandler);
  }

  public resendCode(email: string) {
    return this.mainApi.post('/registration/resend_code/', { email }).then(this.responseHandler);
  }

  public confirm(code: string) {
    return this.mainApi.patch(`/registration/${code}`).then(this.responseHandler);
  }

  public login(email: string, password: string) {
    return this.mainApi.post('/auth/login/', { email, password }).then(this.responseHandler);
  }
}

export default new Api();
