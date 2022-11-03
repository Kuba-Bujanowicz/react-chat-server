import Axios, { AxiosResponse } from 'axios';
import { RequestParams } from '../models/RequestParams';

export class Api {
  private static baseUrl = 'http://localhost:3001';

  private static getUrl(url: string, id?: string | number) {
    return id ? this.baseUrl + url + `/${id}` : this.baseUrl + url;
  }

  private static responseHandler(response: AxiosResponse) {
    return response.data;
  }

  static async get(url: string, params?: RequestParams) {
    const response = await Axios.get(this.getUrl(url), { params });
    return params ? this.responseHandler(response)[0] : this.responseHandler(response);
  }

  static async post(url: string, data: any) {
    const response = await Axios.post(this.getUrl(url), data);
    return this.responseHandler(response);
  }

  static async put(url: string, data: any, id: string | number) {
    const response = await Axios.put(this.getUrl(url, id), data);
    return this.responseHandler(response);
  }

  static async delete(url: string, id: string | number) {
    const response = await Axios.delete(this.getUrl(url, id));
    return this.responseHandler(response);
  }
}
