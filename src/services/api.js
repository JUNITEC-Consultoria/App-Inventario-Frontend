import axios from "axios";
import router from "@/router";
import store from "@/store.js";

//Connection with server
var api;
axios.defaults.withCredentials = true;
if (window.location.href.includes("localhost")) {
	api = axios.create({
		baseURL: "http://localhost:3001",
		withCredentials: true,
	});
} else {
	api = axios.create({
		baseURL: "https://appinventariojunitec.herokuapp.com",
		withCredentials: true,
	});
}

api.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		if (error.response && error.response.status === 401 && router.history.current.name != "login") {
			store.commit("logout");
			router.push("/login");

			router.app.flashMessage.error({
				title: "Acesso negado",
				message: "É necessário efetuar o login para aceder à aplicação!",
			});
		}
		return Promise.reject(error);
	}
);

export default api;
