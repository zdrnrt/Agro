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
}
export function get_order_calc(page) {
	return axios.get(`/api/order_calc/?page_size=30&page=${page}`)
}

export function get_order_calc_id(id) {
	return axios.get(`/api/order/${id}`)
}

export function get_order_calc_result(id) {
	return axios.get(`/api/order_calc/${id}/result/`)
}

export function get_order_calc_export(id) {
	return axios.get(`/api/order_calc/${id}/export`, {
		responseType: 'blob'
	})
}

export function get_imported_files(page) {
	return axios.get(`/api/imported_files/?page_size=30&page=${page}`)
}