<template>
	<v-container fluid pa-0>
		<v-row class="settings_container pa-2 pb-4">
			<!-- Tabs -->
			<v-col class="tabs">
				<h3>Definições do Inventário</h3>
				<p v-for="(tab, index) of tabs" :key="index" :class="index ? '' : 'selected'" @click="changeTab(index)">
					{{ tab }}
					<v-chip outlined disabled color="red" v-if="index != 0"
						><font-awesome-icon :icon="['fas', 'exclamation-triangle']"
					/></v-chip>
				</p>
				<div class="filler"></div>
			</v-col>

			<!-- Janela das localizações -->
			<v-col v-if="selected == 0">
				<LocationsWindow />
			</v-col>

			<v-col class="window" v-if="selected == 1">
				<h2>Pedidos de acesso</h2>
				<UnderDevelopment />
			</v-col>
			<v-col class="window" v-if="selected == 2">
				<h2>Gestão de membros</h2>
				<UnderDevelopment />
			</v-col>
			<v-col class="window" v-if="selected == 3">
				<h2>Gestão de itens</h2>
				<UnderDevelopment />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
//components
import LocationsWindow from "@/components/settings/locationsWindow";
import UnderDevelopment from "@/components/settings/underDevelopment.vue";

export default {
	name: "Settings",

	components: {
		LocationsWindow,
		UnderDevelopment,
	},

	data() {
		return {
			selected: 0,
			tabs: ["Localizações", "Gestão de itens", "Gestão de Membros", "Pedidos de acesso"],
		};
	},
	methods: {
		changeTab(tab) {
			let tabs = document.querySelectorAll(".tabs p");
			tabs[this.selected].classList.remove("selected");
			tabs[tab].classList.add("selected");
			this.selected = tab;
		},
	},
};
</script>

<style lang="scss" scoped>
.settings_container {
	background: #fbfbfb;
	min-height: calc(100vh - 165px);
	width: 70%;
	min-width: 900px;
	margin-left: 15%;
	margin-top: 20px;
	margin-bottom: 20px;
	border-radius: 5px;

	.tabs {
		background-color: #fff;
		border: 1px solid rgb(185, 185, 185);
		border-radius: 5px;
		min-width: 250px;
		max-width: 250px;
		min-height: 550px;
		height: calc(100vh - 180px);
		padding: 0;
		margin-right: 10px;
		margin-top: 7.5px;
		display: flex;
		flex-direction: column;

		& > * {
			padding: 7.5px 10px;
			border-bottom: 1px solid rgb(185, 185, 185);
		}

		p {
			margin-bottom: 0;
			position: relative;

			span {
				position: absolute;
				right: 10px;
				top: 5.5px;

				&.v-chip--disabled {
					opacity: 1;
				}
			}
		}

		:not(:first-child) {
			cursor: pointer;

			&:hover {
				background-color: rgb(233, 233, 233);
			}
		}

		.selected {
			border-left: 3px solid #11ace3;
			padding-left: -3px;
		}

		.filler {
			flex: 1 1 auto;
			border-bottom: none;
			cursor: default;
			background: url("../assets/images/gears.png");
			background-repeat: no-repeat;
			background-size: contain;
			background-position: center center;

			&:hover {
				background-color: transparent;
			}
		}
	}
}

@media only screen and (max-width: 1285px) {
	.settings_container {
		margin-left: calc((100% - 902.5px) / 2);
	}
}
</style>
