import { BASE_URL, AUTH } from '../config';
import axios from 'axios';

axios.defaults.baseURL = BASE_URL;
axios.defaults.headers.common['Authorization'] = AUTH;

console.log('api', BASE_URL, AUTH);
/*
export function login_axios() {
	return axios.post(`${BASE_URL}/login/`)
}
export function check_auth() {
	return axios.get(`${BASE_URL}/check_auth/`)
}
*/

export function check_auth_auth() {
	return fetch(`${BASE_URL}/check_auth/`, {
		headers: {
			'Authorization': `Basic ${AUTH}`
		}
	})
}

window.check_auth_auth = check_auth_auth;

export function check_auth() {
	return fetch(`${BASE_URL}/check_auth/`)
}
window.check_auth = check_auth;

export function test_api_fetch() {
	const headers = new Headers();
	headers.append('Authorization', `Basic ${AUTH}`)
	const requestOptions = {
		method: "GET",
		redirect: "follow",
		headers: headers
	};
	
	fetch(`https://vpic.nhtsa.dot.gov/api/vehicles/getallmanufacturers?format=json`)
	// fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:0201558025,LCCN:93005405&format=json`)
		.then((response) => response.text())
		.then((result) => console.log(result))
		.catch((error) => console.error(error));
}
window.test_api_fetch = test_api_fetch

