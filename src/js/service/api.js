import { AUTH } from '../config';
import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `Basic ${AUTH}`;

export function check_auth() {
	return axios.get('/api/check_auth/')
}

export function post_order_calc(formData) {
	return axios.postForm(
		'/api/order_calc/',
		formData,
	)
	// return new Promise( (resolve) => {
	// 	resolve({
	// 		data: {
	// 			calc_id: 1123
	// 		}
	// 	})
	// })
}
export function get_order_calc(request) {
	return axios.get('/api/order_calc/')
}

export function get_order_calc_id(id) {
	return axios.get(`/api/order12/`)
}

export function get_order_calc_result(id) {
	return axios.get(`/api/order_calc/${id}/result/`)
}

export function get_order_calc_export(id) {
	return axios.get(`/api/order_calc/${id}/export/`)
}

export function get_imported_files(page) {
	return axios.get(`/api/imported_files/?page_size=100&page=${page}`)
}