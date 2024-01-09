import axios, { AxiosInstance, AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, CancelToken } from 'axios'
import { ElMessage } from 'element-plus'

interface returnData {
    code?: string,
    data?: object,
    info?: string
}

class RequestHttp {

    axios(method: string, url: string, params: object, apiType = 'base', response?: any, headeType?: any) {
        method = method.toUpperCase()
        if (typeof params != 'object') params = {}
        if (method != 'POST' && method != 'PUT' && method != 'PATCH') {
            params = {
                params: params
            }
        }
        else {
            params = {
                data: params
            }
        }
        //基本配置
        let config: AxiosRequestConfig = {
            baseURL: (window as any).baseAPI,
            method,
            url,
            timeout: 30000,
            params: null,
            data: null,
            //跨域是否允许携带凭证
            withCredentials: false,
            responseType: response,
            ...params
        }

        let service: AxiosInstance = axios.create(config)
        //存储请求信息和取消方法
        const pendingRequest = new WeakMap<requestKey, Function>()
        //生成唯一key值
        function getRequestKey(config: InternalAxiosRequestConfig) {
            const { method, url, params, data } = config;
            let obj = {
                method,
                url,
                params,
                data
            }
            return obj
        }
        let showErrors = (info: any) => {
            //token过期
            if (info.code == 403) {
                location.reload()
            }
            else {
                ElMessage({
                    message: info.msg || info.message || info.info || '服务异常',
                    type: 'error'
                })
            }
        }
        /**
         * @description 请求拦截器
         * 客户端发送请求 -> 请求拦截器 -> 服务器
         */
        service.interceptors.request.use(
            (config: InternalAxiosRequestConfig) => {
                const token = localStorage.getItem('TOKEN')
                if (token && config.headers) config.headers.set('TOKEN', token)
                if (headeType) config.headers['Content-Type'] = headeType
                //生成唯一key值
                let requestKey = getRequestKey(config)
                //判断请求是否重复
                if (pendingRequest.has(requestKey)) {
                    //取消上次的请求
                    let cancel = pendingRequest.get(requestKey) as Function
                    cancel()
                    //删除请求信息
                    pendingRequest.delete(requestKey)
                }
                //生成取消方法
                config.cancelToken = config.cancelToken || new axios.CancelToken(cancel => {
                    if (!pendingRequest.has(requestKey)) {
                        pendingRequest.set(requestKey, cancel)
                    }
                })
                return config
            },
            (error: AxiosError) => {
                showErrors(error)
                return Promise.reject(error)
            }
        )

        /**
         * @description 响应拦截器
         * 服务器发送响应数据 -> 响应拦截器 -> 客户端接受数据
         */

        service.interceptors.response.use(
            (response: AxiosResponse) => {
                let res = response.data
                if (res.code == 200 || response) {
                    return <any>res
                }
                else {
                    showErrors(res)
                    return Promise.reject(res)
                }
            },
            (error: AxiosError) => {
                const badMessage: any = error.message || error
                const code = parseInt(badMessage.toString().replace('Error: Request failed with status code ', ''))
                showErrors({ code, message: badMessage })
                return Promise.reject(error)
            }
        )
        return service.request(config)
    };


}

export default new RequestHttp().axios