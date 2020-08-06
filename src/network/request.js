import axios from 'axios'

export function request(config) {
	// 创建axios实例
	const instance = axios.create({
		// baseURL: 'http://123.207.32.32:8000',
		baseURL: 'http://152.136.185.210:8000/api/z8',
		timeout: 5000
	})

	// axios的拦截器
	// 请求拦截
	instance.interceptors.request.use(config => {
		return config
	}, err => {
		console.log(err)
	})
	// 响应拦截
	instance.interceptors.response.use(res => {
		// console.log(res)
		return res.data
	}, err => {
		console.log(err)
	})
	// 发送真正的网络请求
	return instance(config)
}