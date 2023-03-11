<template>
	<v-dialog v-model="displayNotice" persistent max-width="500px">
		<v-card>
			<v-card-title> &#x1F36A; Gostas de cookies? </v-card-title>
			<v-card-text>
				<p>Utilizamos cookies para te proporcionar a melhor experiência de utilização do nosso inventário!</p>
			</v-card-text>
			<v-card-actions>
				<v-spacer />
				<a color="primary" href="http://cookiesandyou.com/" target="_blank" style="text-decoration: none; margin-right: 16px">
					Mais info
				</a>
				<v-btn color="primary" @click="acceptCookies"> Aceitar </v-btn>
			</v-card-actions>
		</v-card>
	</v-dialog>
</template>

<script>
export default {
	name: "CookieNotice",
	data() {
		return {
			displayNotice: !localStorage.getItem("cookies"),
		};
	},
	methods: {
		acceptCookies() {
			localStorage.setItem("cookies", true);
			this.displayNotice = false;
		},
	},
};
</script>
