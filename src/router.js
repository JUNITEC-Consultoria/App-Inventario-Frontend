import Vue from "vue";
import Router from "vue-router";
import store from "@/store.js";

Vue.use(Router);

import Login from "@/views/login.vue";
import User from "@/views/user.vue";
import Users from "@/views/users.vue";
import Item from "@/views/item.vue";
import Items from "@/views/items.vue";
import Settings from "@/views/settings.vue";

const router = new Router({
	mode: "history",
	routes: [
		{
			path: "/login",
			name: "login",
			component: Login,
			beforeEnter: (_, __, next) => {
				if (store.getters.isLogged) next("/");
				else next();
			},
		},
		{
			path: "/",
			name: "main",
			component: Items,
			beforeEnter: (to, _, next) => {
				if (store.getters.isLogged) next();
				else {
					if (to.fullPath.slice(1)) next(`/login$?afterLoginRedirectTo=${to.fullPath.slice(1)}`);
					else next("/login");
				}
			},
		},
		{
			path: "/item/:id",
			name: "item",
			component: Item,
			beforeEnter: (to, _, next) => {
				if (store.getters.isLogged) next();
				else next(`/login?afterLoginRedirectTo=${to.fullPath.slice(1)}`);
			},
		},
		{
			path: "/users",
			name: "users",
			component: Users,
			beforeEnter: (_, __, next) => {
				if (store.getters.isLogged) next();
				else next("/login?afterLoginRedirectTo=users");
			},
		},
		{
			path: "/user/:id",
			name: "user",
			component: User,
			beforeEnter: (to, _, next) => {
				if (store.getters.isLogged) next();
				else next(`/login?afterLoginRedirectTo=${to.fullPath.slice(1)}`);
			},
		},
		{
			path: "/settings",
			name: "settings",
			component: Settings,
			beforeEnter: (_, __, next) => {
				if (store.getters.isLogged) {
					if (store.getters.isAdmin) next();
					else next("/");
				} else next("/login?afterLoginRedirectTo=settings");
			},
		},
		{
			path: "*",
			redirect: "/login",
		},
	],
});

router.afterEach(async (to) => {
	let titles = {
		main: "Inventário - Itens",
		item: "Inventário - Item",
		users: "Inventário - Membros",
		user: "Inventário - Membro",
		login: "Inventário - Login",
		settings: "Inventário - Definições",
	};

	document.title = titles[to.name];
});

export default router;
