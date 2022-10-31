import Axios, { AxiosResponse } from 'axios'

export class Api {
    private static baseUrl = 'http://localhost:3001'

    private static getUrl(url: string) {
        return this.baseUrl + url
    }

    private static responseHandler(response: AxiosResponse) {
        return response.data
    }

    static async get(url: string) {
        const response = await Axios.get(this.getUrl(url))
        return this.responseHandler(response)
    }

    static async post(url: string, data: any) {
        const response = await Axios.post(this.getUrl(url), data)
        return this.responseHandler(response)
    }

}