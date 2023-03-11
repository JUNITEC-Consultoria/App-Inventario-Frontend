<template>
	<v-app id="app">
		<Navbar />
		<router-view class="router" style="margin-bottom: 40px;" />
		<Footer />
		<FlashMessage :position="'right bottom'" />
		<CookieNotice />
	</v-app>
</template>

<script>
import Navbar from "@/components/navbar.vue";
import Footer from "@/components/footer.vue";
import CookieNotice from "@/components/cookieNotice.vue";

export default {
	name: "App",
	components: {
		Navbar,
		Footer,
		CookieNotice,
	},
	created() {
		var perfEntry = performance.getEntriesByType("navigation")[0];

		if (this.$store.getters.isLogged && perfEntry && (perfEntry.type == "navigate" || perfEntry.type == "reload")) {
			this.$store.commit("newInterval");
		}
	},
};
</script>

<style lang="scss">
@import "./assets/styles/index";
</style>

<style lang="scss" scoped>
.router {
	background: linear-gradient(rgba(200, 200, 200, 0.2), rgba(200, 200, 200, 0.2)), url("./assets/images/background_photo.jpg");
	background-repeat: no-repeat;
	background-size: cover;
	background-position: center;
	height: calc(100vh - 134px);
	overflow-y: auto;
	overflow-x: hidden;
}

@media only screen and (max-width: 949px) {
	.router {
		height: calc(100vh - 118.5px);
	}
}
</style>
