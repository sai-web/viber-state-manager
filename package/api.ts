/*
    custom api where you can declare a configuration and proceed with api calls
    it is based of the fetch api hence follows the same protocols
*/
import { ApiConfig } from './interfaces'

function ensureProperHeaders(headers: Record<string, any>) {
    let newHeaders = {}
    Object.keys(headers).forEach(header => {
        newHeaders[header.toLocaleLowerCase()] = headers[header]
    })
    return newHeaders
}

export class Api {
    constructor(public config: ApiConfig = { options: {} }) {
        this.config.options.headers = ensureProperHeaders(this.config.options.headers)
    }

    public with(newConfig: ApiConfig) {
        let copyThis = { ...this }
        newConfig.options.headers = ensureProperHeaders(newConfig.options.headers)
        copyThis.config = {
            ...copyThis.config,
            ...newConfig
        }
        return copyThis
    }

    public async get(endpoint: string) {
        return this._send('GET', endpoint)
    }
    public post(endpoint: string, payload?: any) {
        return this._send('POST', endpoint, payload)
    }
    public put(endpoint: string, payload?: any) {
        return this._send('PUT', endpoint, payload)
    }
    public patch(endpoint: string, payload?: any) {
        return this._send('PATCH', endpoint, payload)
    }
    public delete(endpoint: string, payload?: any) {
        return this._send('DELETE', endpoint, payload)
    }

    private async _send(method: string, endpoint: string, payload?: any) {
        let fullURL: string
        if (endpoint.startsWith('http')) fullURL = endpoint
        else fullURL = `${this.config.base}\\${this.config.path}\\${endpoint}`

        this.config.options.method = method
        if (!this.config.options.headers) this.config.options.headers = {}

        if (this.config.requestIntercept) this.config.requestIntercept({ ...this.config.options, endpoint: fullURL })

        const response = await fetch(fullURL, this.config.options)

        if (this.config.responseIntercept) this.config.responseIntercept(response)

        return response
    }
}