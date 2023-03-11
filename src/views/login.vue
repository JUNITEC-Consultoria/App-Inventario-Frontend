<template>
	<v-container fluid class="login_container" pa-0>
		<v-row class="login_positioner" justify="center">
			<div class="forms_container">
				<v-col class="form--left anim--opacity--super--up" id="leftForm">
					<v-row align="center" style="height: 100%">
						<v-col>
							<v-row class="mb-7">
								<v-col>
									<h1>LOGIN MEMBRO</h1>
								</v-col>
							</v-row>
							<v-row class="mb-3">
								<v-col class="pt-0 pb-0">
									<v-text-field rounded outlined label="Email" v-model="email" @keyup.enter="login" :rules="rules.email">
										<font-awesome-icon :icon="['far', 'user']" slot="prepend-inner" />
									</v-text-field>
								</v-col>
							</v-row>
							<v-row class="mb-3">
								<v-col class="pt-0 pb-0">
									<v-text-field
										rounded
										outlined
										label="Password"
										v-model="password"
										@keyup.enter="login"
										:rules="rules.password"
										:type="type"
									>
										<font-awesome-icon :icon="['fas', 'key']" slot="prepend-inner" />
										<font-awesome-icon
											:icon="['fas', visibility ? 'eye-slash' : 'eye']"
											slot="append"
											class="toggle"
											@click="toggleVisibility"
										/>
									</v-text-field>
								</v-col>
							</v-row>
							<v-row>	
								<v-col>
									<v-btn
										elevation="5"
										rounded
										x-large
										width="200px"
										class="button--main"
										@click="login"
										:loading="loading"
									>
										LOGIN
									</v-btn>
								</v-col>
							</v-row>
							<v-row>	
								<v-col>
									<v-btn
										rouded
										elevation="5"
										right
										small
										color="primary"
										@click="handleClickSignIn"
									>
									<span style="margin-right:12%">
										Sign in
									</span>
										<font-awesome-icon :icon="['fab', 'google']"/>
									</v-btn>	
								</v-col>
							</v-row>
							<v-row>
								<v-col> </v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-col>
				<v-col class="form--right anim--opacity--super--down" id="rightForm" v-if="false">
					<v-row align="center" style="height: 100%">
						<v-col>
							<v-row class="mb-7">
								<v-col>
									<h1>LOGIN MEMBRO</h1>
								</v-col>
							</v-row>
							<v-row class="mb-3">
								<v-col class="pt-0 pb-0">
									<v-text-field rounded outlined label="Email" v-model="email" @keyup.enter="login" :rules="rules.email">
										<font-awesome-icon :icon="['far', 'user']" slot="prepend-inner" />
									</v-text-field>
								</v-col>
							</v-row>
							<v-row class="mb-3">
								<v-col class="pt-0 pb-0">
									<v-text-field
										rounded
										outlined
										label="Password"
										v-model="password"
										@keyup.enter="login"
										:rules="rules.password"
										:type="type"
									>
										<font-awesome-icon :icon="['fas', 'key']" slot="prepend-inner" />
										<font-awesome-icon
											:icon="['fas', visibility ? 'eye-slash' : 'eye']"
											slot="append"
											class="toggle"
											@click="toggleVisibility"
										/>
									</v-text-field>
								</v-col>
							</v-row>
							<v-row class="mb-4">
								<v-col>
									<v-btn
										elevation="5"
										rounded
										x-large
										width="200px"
										class="button--main"
										@click="login"
										:loading="loading"
									>
										LOGIN
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-col>

				<div class="overlay anim--translate--super--_0_450" id="overlay">
					<div class="slider anim--translate--super--_0_-450" id="slider"></div>
				</div>

				<v-col class="shifter--left anim--opacity--super--down" id="leftShifter">
					<v-row align="center" style="height: 100%">
						<v-col>
							<v-row align="center" style="margin-bottom: 38px; margin-top: 12px">
								<v-col class="pa-0">
									<h1>Bem vindo ao Inventário da JUNITEC</h1>
								</v-col>
							</v-row>
							<v-row align="center" style="margin-top: 60px">
								<v-col class="pa-0">
									<p>Para pedir acesso temporário por favor introduza as suas informações pessoais.</p>
								</v-col>
							</v-row>
							<v-row style="margin-top: 60px">
								<v-col>
									<v-btn elevation="5" rounded x-large width="200px" class="button--special" @click="shift(0)">
										Membro
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-col>
				<v-col class="shifter--right anim--opacity--super--up" id="rightShifter">
					<v-row align="center" justify="space-between" style="height: 100%">
						<v-col>
							<v-row align="center" style="margin-bottom: 38px; margin-top: 5px">
								<v-col class="pa-0">
									<h1>Bem vindo ao Inventário da JUNITEC</h1>
								</v-col>
							</v-row>
							<v-row align="center" style="margin-top: 60px">
								<v-col class="pa-0">
									<p class="pa-0 ma-0">Para pedir acesso temporário por favor introduza as suas informações pessoais.</p>
									<p class="pa-0 ma-0 mt-1" style="color: rgb(250, 0, 0)">(Atualmente em desenvolvimento)</p>
								</v-col>
							</v-row>
							<v-row style="margin-top: 50px">
								<v-col>
									<v-btn
										elevation="5"
										rounded
										x-large
										width="200px"
										class="button--special"
										@click="shift(1)"
										:disabled="true"
									>
										Visitante
									</v-btn>
								</v-col>
							</v-row>
						</v-col>
					</v-row>
				</v-col>
			</div>
		</v-row>
	</v-container>
</template>

<script>
import api from "../services/api";

export default {
	name: "Login",
	data() {
		return {
			email: "",
			password: "",
			visibility: false,
			type: "password",
			loading: false,
			hasSlided: false,
			rules: {
				email: [
					(val) => {
						if ((val || "").length > 0) {
							if (/^.+@junitec\.pt$/.test(val)) {
								return true;
							} else {
								return "Formato obrigatório: castelo.branco@junitec.pt";
							}
						} else {
							return "É necessário fornecer um email";
						}
					},
				],
				password: [
					(val) => {
						if ((val || "").length > 0) {
							return true;
						} else {
							return "É necessário fornecer uma password";
						}
					},
				],
			},
			googleSignInParams: {
				client_id: '970575657381-1dtvfi39r4t51oth4aj67fufbn2638pf.apps.googleusercontent.com'
			}
		};
	},
	methods: {
		toggleVisibility() {
			this.type = this.visibility ? "password" : "text";
			this.visibility = !this.visibility;
		},
		async handleClickSignIn(){
			try {
				const googleUser = await this.$gAuth.signIn();

				let user = googleUser.getBasicProfile();
				let userArray = [];
				for(var x in user) {
					userArray.push(x);
				}

				this.isSignIn = this.$gAuth.isAuthorized;

				let res = await api.post("/login", {
					email: user[userArray[5]],
					password: "",
					gsuite: true
				});

				this.$store.commit("login", { id: res.data._id, isAdmin: res.data.isAdmin });

				this.$router.push(
					`/${this.$route.query.afterLoginRedirectTo ? decodeURI(this.$route.query.afterLoginRedirectTo) : ""}`
				);

				this.flashMessage.success({
					title: "Login efetuado",
					message: "Bem vindo/a de volta " + res.data.name + "!",
				});

			} catch (error) {
			// On fail do something
				console.log(error)
				console.error(error);
				return null;
			}
		},
		async login() {
			this.loading = true;
			try {
				let existsPass = (this.password || "").length > 0;
				let existsEmail = (this.email || "").length > 0;

				if (existsEmail && existsPass) {
					if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@junitec\.pt$/.test(this.email)) {
						let res = await api.post("/login", {
							email: this.email,
							password: this.password,
							gsuite: false
						});

						this.$store.commit("login", { id: res.data._id, isAdmin: res.data.isAdmin });

						this.$router.push(
							`/${this.$route.query.afterLoginRedirectTo ? decodeURI(this.$route.query.afterLoginRedirectTo) : ""}`
						);

						this.flashMessage.success({
							title: "Login efetuado",
							message: "Bem vindo/a de volta " + res.data.name + "!",
						});
					} else {
						this.flashMessage.warning({
							title: "Formato do email incorreto",
							message: "O email fornecido não tem o formato 'primeironome.ultimonome@junitec.pt'.",
						});
					}
				} else if (existsPass) {
					this.flashMessage.warning({
						title: "Email não fornecido",
						message: "É necessário fornecer um email para poder efetuar o login",
					});
				} else if (existsEmail) {
					this.flashMessage.warning({
						title: "Password não fornecida",
						message: "É necessário fornecer uma password para poder efetuar o login",
					});
				} else {
					this.flashMessage.warning({
						title: "Email e Password não fornecidos",
						message: "É necessário fornecer as suas credenciais para poder efetuar o login",
					});
				}
			} catch {
				this.flashMessage.error({
					title: "Credenciais erradas",
					message: "Oops!! O email e/ou password indicados não estão corretos.",
				});
			}
			this.loading = false;
		},
		shift(sel) {
			let overlay = document.getElementById("overlay");
			let slider = document.getElementById("slider");
			let leftForm = document.getElementById("leftForm");
			let rightForm = document.getElementById("rightForm");

			let leftShifter = document.getElementById("leftShifter");
			let rightShifter = document.getElementById("rightShifter");

			if (!this.hasSlided) {
				this.hasSlided = true;
				overlay.classList.remove("anim--translate--super--_0_450");
				slider.classList.remove("anim--translate--super--_0_-450");
				leftForm.classList.remove("anim--opacity--super--up");
				rightForm.classList.remove("anim--opacity--super--down");
				leftShifter.classList.remove("anim--opacity--super--down");
				rightShifter.classList.remove("anim--opacity--super--up");

				overlay.classList.add("anim--translate--normal--_0_450");
				slider.classList.add("anim--translate--normal--_0_-450");
				leftForm.classList.add("anim--opacity--normal--up");
				rightForm.classList.add("anim--opacity--normal--down");
				leftShifter.classList.add("anim--opacity--normal--down");
				rightShifter.classList.add("anim--opacity--normal--up");
			}

			if (sel) {
				overlay.classList.add("anim--translate--normal--_450_0");
				slider.classList.add("anim--translate--normal--_-450_0");

				leftForm.classList.remove("anim--opacity--normal--up");
				leftForm.classList.add("anim--opacity--normal--down");
				rightForm.classList.remove("anim--opacity--normal--down");
				rightForm.classList.add("anim--opacity--normal--up");

				leftShifter.classList.remove("anim--opacity--normal--down");
				leftShifter.classList.add("anim--opacity--normal--up");
				rightShifter.classList.remove("anim--opacity--normal--up");
				rightShifter.classList.add("anim--opacity--normal--down");
			} else {
				overlay.classList.remove("anim--translate--normal--_450_0");
				slider.classList.remove("anim--translate--normal--_-450_0");

				leftForm.classList.remove("anim--opacity--normal--down");
				leftForm.classList.add("anim--opacity--normal--up");
				rightForm.classList.remove("anim--opacity--normal--up");
				rightForm.classList.add("anim--opacity--normal--down");

				leftShifter.classList.remove("anim--opacity--normal--up");
				leftShifter.classList.add("anim--opacity--normal--down");
				rightShifter.classList.remove("anim--opacity--normal--down");
				rightShifter.classList.add("anim--opacity--normal--up");
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.google-signin-button {
	color: white;
	background-color: red;
	height: 50px;
	font-size: 16px;
	border-radius: 10px;
	padding: 10px 20px 25px 20px;
	box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
}

.login_container {
	justify-content: center;

	.login_positioner {
		margin-top: max(45px, calc(50vh - 312.5px));
		margin-bottom: max(45px, calc(50vh - 312.5px));

		.forms_container {
			width: 900px;
			border-radius: 10px;
			box-shadow: 6px 6px 10px rgba(0, 0, 0, 0.25), 6px 6px 10px rgba(0, 0, 0, 0.25), -2px -2px 10px rgba(0, 0, 0, 0.25),
				-2px -2px 10px rgba(0, 0, 0, 0.25);
			overflow: hidden;
			position: relative;

			//rgba(366, 366, 366, 0.25)

			.form {
				text-align: center;
				height: 500px;
				width: 450px;
				padding: 30px;
				position: relative;
				background-color: #f0f0f0;

				&--left {
					@extend .form;
					float: left;
				}
				&--right {
					@extend .form;
					float: right;
				}

				.toggle {
					cursor: pointer;
				}
			}

			.overlay {
				position: absolute;
				width: 450px;
				overflow: hidden;
				height: 500px;
				z-index: 1;

				.slider {
					background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url("../assets/images/smartcities.jpg");
					background-repeat: no-repeat;
					background-size: cover;
					color: #fff;
					width: 900px;
					height: 500px;
				}
			}

			.shifter {
				position: absolute;
				text-align: center;
				height: 500px;
				width: 450px;
				padding: 30px;
				color: #fff;

				h1 {
					font-weight: thin;
				}

				&--left {
					@extend .shifter;
					left: 0px;
				}
				&--right {
					@extend .shifter;
					left: 450px;
				}
			}
		}
	}

	//animations
	.anim {
		animation-fill-mode: forwards;

		&--translate {
			@extend .anim;
			&--super {
				@extend .anim--translate;
				animation-duration: 0s;
				&--_0_450 {
					@extend .anim--translate--super;
					animation-name: translate_0_450;
				}
				&--_0_-450 {
					@extend .anim--translate--super;
					animation-name: translate_0_-450;
				}
			}

			&--normal {
				@extend .anim--translate;
				animation-duration: 1s;
				&--_0_450 {
					@extend .anim--translate--normal;
					animation-name: translate_0_450;
				}
				&--_0_-450 {
					@extend .anim--translate--normal;
					animation-name: translate_0_-450;
				}
				&--_450_0 {
					@extend .anim--translate--normal;
					animation-name: translate_450_0;
				}
				&--_-450_0 {
					@extend .anim--translate--normal;
					animation-name: translate_-450_0;
				}
			}

			@keyframes translate_0_450 {
				0% {
					transform: translateX(0px);
				}
				100% {
					transform: translateX(450px);
				}
			}
			@keyframes translate_0_-450 {
				0% {
					transform: translateX(0px);
				}
				100% {
					transform: translateX(-450px);
				}
			}
			@keyframes translate_450_0 {
				0% {
					transform: translateX(450px);
				}
				100% {
					transform: translateX(0px);
				}
			}
			@keyframes translate_-450_0 {
				0% {
					transform: translateX(-450px);
				}
				100% {
					transform: translateX(0px);
				}
			}
		}

		&--opacity {
			@extend .anim;
			&--super {
				@extend .anim--opacity;
				animation-duration: 0s;
				&--down {
					@extend .anim--opacity--super;
					animation-name: opacity_down;
				}
				&--up {
					@extend .anim--opacity--super;
					animation-name: opacity_up;
				}
			}

			&--normal {
				@extend .anim--opacity;
				animation-duration: 2s;
				&--down {
					@extend .anim--opacity--normal;
					animation-name: opacity_down;
				}
				&--up {
					@extend .anim--opacity--normal;
					animation-name: opacity_up;
				}
			}

			@keyframes opacity_down {
				0% {
					opacity: 1;
					z-index: 0;
				}
				100% {
					opacity: 0;
					z-index: 0;
				}
			}
			@keyframes opacity_up {
				0% {
					opacity: 0;
					z-index: 2;
				}
				100% {
					opacity: 1;
					z-index: 2;
				}
			}
		}
	}
}
</style>
