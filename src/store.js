import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import aes256 from "aes256";
import api from "./services/api";

Vue.use(Vuex);

async function checkSession() {
	await api.get("/isLogged");
}

const store = new Vuex.Store({
	plugins: [createPersistedState()],
	state: {
		isLogged: "_",
		isAdmin: "_",
		id: "_",
		intervalId: null,
	},
	mutations: {
		login(state, data) {
			state.id = data.id;
			state.isAdmin = data.isAdmin ? aes256.encrypt(state.id, "verdadeiro") : "_";
			state.isLogged = aes256.encrypt(state.id, "verdadeiro");
			state.intervalId = setInterval(checkSession, 900 * 1000);
		},
		logout(state) {
			state.isLogged = "_";
			state.id = "_";
			state.isAdmin = "_";
			clearInterval(state.intervalId);
			state.intervalId = null;
		},
		newInterval(state) {
			state.intervalId = setInterval(checkSession, 900 * 1000);
		},
	},
	getters: {
		isLogged: (state) => {
			return state.id != "_" ? aes256.decrypt(state.id, state.isLogged) == "verdadeiro" : false;
		},
		isAdmin: (state) => {
			return state.id != "_" ? aes256.decrypt(state.id, state.isLogged) == "verdadeiro" : false;
		},
		id: (state) => {
			return state.id;
		},
	},
});

export default store;
