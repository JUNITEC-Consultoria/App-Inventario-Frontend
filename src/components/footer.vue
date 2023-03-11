<template>
	<v-container fluid class="footer_container">
		<v-row no-gutters>
			<v-col class="pa-2">{{ data }} &#169; <span @click="randoomMeme">JUNITEC</span>. Todos os direitos reservados </v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "Footer",
	data() {
		return {
			loading: false,
		};
	},
	computed: {
		data: function() {
			var today = new Date();
			var year = today.getFullYear();
			return year + "/" + (year + 1);
		},
	},
	methods: {
		async randoomMeme() {
			if (this.$store.getters.isLogged) {
				await fetch("https://meme-api.herokuapp.com/gimme", {
					credentials: "omit",
					method: "GET",
					mode: "cors",
				})
					.then((response) => response.json())
					.then((data) => window.open(data.preview[data.preview.length - 1]));
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.footer_container {
	position: absolute;
	bottom: 0;
	padding: 0;
	background: #fff;
	box-shadow: 0 0 5px rgba(0, 0, 0, 0.22);
	text-align: center;
	z-index: 5;
}
</style>
