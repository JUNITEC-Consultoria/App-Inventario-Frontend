<template>
	<v-container fluid class="navbar_container">
		<v-row align="center" style="height: 100%;" class="ma-0 pa-0">
			<v-col align="left" id="logo" cols="5">
				<v-row align="center" class="ma-0 pa-0">
					<img src="@/assets/images/logo_white.png" @click="barrelRoll" />
				</v-row>
			</v-col>

			<!-- PC view -->
			<v-col v-if="$route.name != 'login' && !isMobile" align="right" cols="7" id="pcViewMenu">
				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<font-awesome-icon
							dark
							v-bind="Object.assign(attrs)"
							v-on="Object.assign(on)"
							:icon="['fas', 'home']"
							class="navbarIcon"
							@click="goTo(activatorsList.main.includes($route.name) ? '/' : null)"
						/>
					</template>
					<span>Itens</span>
				</v-tooltip>

				<v-tooltip bottom>
					<template v-slot:activator="{ on, attrs }">
						<font-awesome-icon
							dark
							v-bind="Object.assign(attrs)"
							v-on="Object.assign(on)"
							:icon="['fas', 'users']"
							class="navbarIcon"
							@click="goTo(activatorsList.users.includes($route.name) ? '/users' : null)"
						/>
					</template>
					<span>Membros</span>
				</v-tooltip>

				<v-tooltip bottom v-if="isAdmin">
					<template v-slot:activator="{ on, attrs }">
						<font-awesome-icon
							dark
							v-bind="Object.assign(attrs)"
							v-on="Object.assign(on)"
							:icon="['fas', 'cog']"
							class="navbarIcon"
							@click="goTo(activatorsList.settings.includes($route.name) ? '/settings' : null)"
						/>
					</template>
					<span>Definições</span>
				</v-tooltip>

				<v-tooltip bottom v-if="!loggingOut">
					<template v-slot:activator="{ on, attrs }">
						<font-awesome-icon
							dark
							v-bind="Object.assign(attrs)"
							v-on="Object.assign(on)"
							:icon="['fas', 'sign-out-alt']"
							class="navbarIcon"
							@click="logout"
						/>
					</template>
					<span>Logout</span>
				</v-tooltip>

				<template v-if="loggingOut">
					<font-awesome-icon dark :icon="['fas', 'circle-notch']" class="navbarIcon animate" />
				</template>
			</v-col>

			<!-- Mobile view -->
			<v-col v-if="$route.name != 'login' && isMobile" align="right" cols="7" id="mobileViewMenu">
				<font-awesome-icon
					dark
					:icon="['fas', mobileTabStatus ? 'times' : 'bars']"
					class="navbarIcon"
					:id="mobileTabStatus ? 'times' : 'burger'"
					@click="toogleMobileView"
				/>

				<div class="overlay" @click="toogleMobileView"></div>

				<div class="navTab" align="left">
					<v-row class="ma-0">
						<v-col cols="12">
							<v-btn text @click="goTo(activatorsList.main.includes($route.name) ? '/' : null)" x-large class="navTabButton">
								<font-awesome-icon dark :icon="['fas', 'home']" class="navTabIcon" />
								Itens
							</v-btn>
						</v-col>

						<v-col cols="12">
							<v-btn
								text
								@click="goTo(activatorsList.users.includes($route.name) ? '/users' : null)"
								x-large
								class="navTabButton"
							>
								<font-awesome-icon dark :icon="['fas', 'users']" class="navTabIcon" />
								Membros
							</v-btn>
						</v-col>

						<v-col cols="12" v-if="isAdmin">
							<v-btn
								text
								@click="goTo(activatorsList.settings.includes($route.name) ? '/settings' : null)"
								x-large
								class="navTabButton"
							>
								<font-awesome-icon dark :icon="['fas', 'cog']" class="navTabIcon" />
								Definições
							</v-btn>
						</v-col>

						<v-col cols="12" style="position: absolute; bottom: 0">
							<v-btn text @click="logout" x-large class="navTabButton" :loading="loggingOut">
								<font-awesome-icon dark :icon="['fas', 'sign-out-alt']" class="navTabIcon" />
								Logout
							</v-btn>
						</v-col>
					</v-row>
				</div>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import api from "../services/api";

export default {
	name: "Navbar",

	data() {
		return {
			activatorsList: {
				main: ["item", "users", "user", "settings"],
				users: ["main", "item", "user", "settings"],
				settings: ["main", "item", "users", "user"],
			},
			loggingOut: false,
			windowWidth: window.innerWidth,
			mobileTabStatus: false,
		};
	},

	methods: {
		selectIcon() {
			if (this.isMobile) {
				let buttons = document.querySelectorAll("#mobileViewMenu .navTab .navTabButton");
				let router = document.querySelector(".router");

				for (let button of buttons) {
					button.classList?.remove("selected");
				}

				switch (this.$route.name) {
					case "main":
						buttons[0]?.classList?.add("selected");
						break;
					case "users":
						buttons[1]?.classList?.add("selected");
						break;
					case "settings":
						buttons[2]?.classList?.add("selected");
						break;
				}

				if (this.mobileTabStatus) {
					router.style.overflowY = "hidden";
				} else {
					router.style.overflowY = "auto";
				}
			} else {
				let icons = document.querySelectorAll("#pcViewMenu .navbarIcon");
				for (let icon of icons) {
					icon.classList?.remove("selected");
				}

				switch (this.$route.name) {
					case "main":
						icons[0]?.classList?.add("selected");
						break;
					case "users":
						icons[1]?.classList?.add("selected");
						break;
					case "settings":
						icons[2]?.classList?.add("selected");
						break;
				}
			}
		},

		toogleMobileView() {
			let navTab = document.querySelector("#mobileViewMenu .navTab");
			let overlay = document.querySelector("#mobileViewMenu .overlay");
			let router = document.querySelector(".router");

			navTab.style.opacity = 1;

			if (this.mobileTabStatus) {
				navTab.classList.remove("open");
				overlay.classList.remove("open");
				router.style.overflowY = "auto";
			} else {
				navTab.classList.add("open");
				overlay.classList.add("open");
				router.style.overflowY = "hidden";
			}

			this.mobileTabStatus = !this.mobileTabStatus;
		},

		goTo(path) {
			this.selectIcon();

			if (path) this.$router.push(path);
		},

		async logout() {
			this.loggingOut = true;
			try {
				await api.post("/logout");

				this.$store.commit("logout");

				this.$router.push("/login");
			} catch {
				this.flashMessage.error({
					title: "Logout falhado",
					message: "Ocorreu um erro durante o logout. Por favor, volte a tentar novamente!",
				});
			}
			this.loggingOut = false;
			this.mobileTabStatus = false;
		},

		async barrelRoll() {
			let app = document.querySelector(".v-application--wrap");

			if (this.$store.getters.isLogged) {
				app.classList.add("barrel_roll");

				setTimeout(() => {
					app.classList.remove("barrel_roll");
				}, 4100);
			}
		},
	},

	computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},

		isMobile() {
			return this.windowWidth < 950;
		},
	},

	mounted() {
		this.$nextTick(() => {
			window.addEventListener("resize", () => {
				this.windowWidth = window.innerWidth;
			});
		});

		this.selectIcon();
	},

	updated() {
		this.selectIcon();
	},
};
</script>

<style lang="scss" scoped>
.navbar_container {
	padding: 0;
	margin: 0;
	margin-right: -10px;
	box-shadow: 0 5px 5px rgba(0, 0, 0, 0.22);
	background: #163450;
	z-index: 5;

	#logo {
		img {
			height: 70px;
		}
	}

	#pcViewMenu {
		.navbarIcon {
			width: 60px;
			height: 60px;
			cursor: pointer;
			border-radius: 50%;
			margin-left: 15px;
			padding: 10px;
			font-weight: lighter;
			color: #ececec;

			&.selected {
				border: 3px solid #ececec;
			}

			&.animate {
				animation: rotate 2s infinite linear;

				@keyframes rotate {
					from {
						transform: rotate(0deg);
					}
					to {
						transform: rotate(359deg);
					}
				}
			}
		}
	}

	#mobileViewMenu {
		.navbarIcon {
			cursor: pointer;
			color: #ececec;
			width: 50px;
			height: 50px;

			&#burger {
				padding: 10px;
			}

			&#times {
				padding: 8px;
			}
		}

		.navTab {
			position: absolute;
			right: 0;
			top: 78.5px;
			height: calc(100vh - 118.5px);
			width: 225px;
			background: #ececec;
			opacity: 0;
			animation: closeTab 0.5s forwards ease-in-out;
			z-index: 300;

			&.open {
				animation: openTab 0.5s forwards ease-in-out;
			}

			@keyframes openTab {
				from {
					transform: translateX(225px);
				}
				to {
					transform: rotate(0);
				}
			}

			@keyframes closeTab {
				from {
					transform: rotate(0);
				}
				to {
					transform: translateX(225px);
				}
			}

			.navTabButton {
				width: 90%;
				margin-left: 5%;

				&.selected {
					text-decoration: underline;
					cursor: default;
				}

				.navTabIcon {
					width: 50px;
					height: 50px;
					padding: 10px;
					color: #000;
					margin-left: -10px;
				}
			}
		}

		.overlay {
			background: #1b1b1b69;
			width: 100vw;
			height: calc(100vh - 118.5px);
			position: absolute;
			top: 78.5px;
			left: 0;
			z-index: 300;
			display: none;

			&.open {
				display: block;
			}
		}
	}
}

@media only screen and (max-width: 949px) {
	.navbar_container {
		#logo {
			img {
				height: 50px;
			}
		}
	}
}
</style>
