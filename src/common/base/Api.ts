import Axios, { AxiosResponse } from 'axios'
import { RequestParams } from '../models/RequestParams';

export class Api {
    private static baseUrl = 'http://localhost:3001'

    private static getUrl(url: string) {
        return this.baseUrl + url;
    }

    private static responseHandler(response: AxiosResponse) {
        return response.data
    }

    static async get(url: string, params?: RequestParams) {
        const response = await Axios.get(this.getUrl(url), { params })
        return params ? this.responseHandler(response)[0] : this.responseHandler(response)
    }

    static async post(url: string, data: any) {
        const response = await Axios.post(this.getUrl(url), data)
        return this.responseHandler(response)
    }

}