import {request} from './request'

export function getHomeMultidata() {
	return request({
		url: '/home/multidata'
	})
}

//请求商品数据
export function getHomeGoods(type, page){
	return request({
		url:'/home/data',
		params: {
			type,
			page
		}
	})
}