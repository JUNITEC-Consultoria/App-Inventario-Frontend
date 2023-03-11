<template>
	<v-dialog max-width="50%" v-model="show">
		<template v-slot:activator="scopedDialog">
			<v-tooltip top>
				<template v-slot:activator="{ on, attrs }">
					<v-btn
						v-bind="Object.assign(attrs, scopedDialog.attrs)"
						v-on="Object.assign(on, scopedDialog.on)"
						icon
						x-large
						class="searchbar_icon elevation-2"
					>
						<font-awesome-icon dark :icon="['fas', 'plus']" />
					</v-btn>
				</template>
				<span>Criar Utilizador</span>
			</v-tooltip>
		</template>
		<v-form v-model="isValid" autocomplete="off">
			<v-card class="pa-2" :loading="loading">
				<v-card-title>
					<span class="headline">Adicionar Utilizador</span>
				</v-card-title>
				<v-card-text>
					<p v-if="loading">
						<v-progress-circular class="mr-2" indeterminate />
						A adicionar o utilizador <strong>{{ name }}</strong
						>...
					</p>
					<v-container v-else>
						<v-row>
							<ImagePicker :defaultImage="defaultImage" v-model="image" />
							<v-col class="pr-0">
								<v-text-field
									label="Nome"
									hint="Ex: José Castelo Branco"
									v-model="name"
									outlined
									clearable
									persistent-hint
									:rules="rules.name"
								/>
							</v-col>
						</v-row>
						<v-row>
							<v-combobox
								label="Projeto"
								hint="p. ex., Trash4Goods"
								v-model="project"
								@keydown="(e) => (project = e.target._value)"
								id="project"
								outlined
								clearable
								persistent-hint
								:items="availableProjects"
							/>
						</v-row>
						<v-row>
							<v-radio-group v-model="userType" row mandatory>
								<v-radio value="admin">
									<template v-slot:label>
										<span>
											Administrador
											<v-tooltip top>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<span v-on="on" v-bind="attrs">
														<font-awesome-icon :icon="['fas', 'info-circle']" class="icon" />
													</span>
												</template>
												<span>Membro da JUNITEC com acesso a todas as funcionalidades do inventário</span>
											</v-tooltip>
										</span>
									</template>
								</v-radio>
								<v-radio value="real">
									<template v-slot:label>
										<span>
											Utilizador Real
											<v-tooltip top>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<span v-on="on" v-bind="attrs">
														<font-awesome-icon :icon="['fas', 'info-circle']" class="icon" />
													</span>
												</template>
												<span>Membro da JUNITEC com acesso às funcionalidades gerais do inventário</span>
											</v-tooltip>
										</span>
									</template>
								</v-radio>
								<v-radio value="virtual">
									<template v-slot:label>
										<span>
											Utilizador Virtual
											<v-tooltip top>
												<template
													v-slot:activator="{
														on,
														attrs,
													}"
												>
													<span v-on="on" v-bind="attrs">
														<font-awesome-icon :icon="['fas', 'info-circle']" class="icon" />
													</span>
												</template>
												<span>Utilizador de recursos sem acesso direto ao inventário</span>
											</v-tooltip>
										</span>
									</template>
								</v-radio>
							</v-radio-group>
						</v-row>
						<template v-if="userType != 'virtual'">
							<v-row>
								<v-text-field
									label="Email"
									type="email"
									hint="Ex: jose.castelo.branco@junitec.pt"
									v-model="email"
									outlined
									clearable
									persistent-hint
									:rules="rules.email"
								/>
							</v-row>
							<v-row>
								<v-radio-group v-model="specifyPassword" mandatory row>
									<v-radio class="mb-2" value="yes" label="Especificar Palavra-Passe" />
									<v-radio class="mb-2" value="no" label="Gerar Palavra-Passe Automaticamente" />
								</v-radio-group>
							</v-row>
							<template v-if="specifyPassword == 'yes'">
								<v-row class="mt-n2">
									<v-text-field
										label="Palavra-Passe"
										type="password"
										hint="Entre 8 e 30 caracteres"
										v-model="password"
										outlined
										clearable
										persistent-hint
										:rules="rules.password"
										counter="30"
										@input="$refs.addUserFormConfirmPassword.validate()"
									/>
								</v-row>
								<v-row>
									<v-text-field
										ref="addUserFormConfirmPassword"
										label="Confirmar Palavra-Passe"
										type="password"
										hint="Igual à que escolheu acima"
										v-model="confirmPassword"
										outlined
										clearable
										persistent-hint
										:rules="rules.confirmPassword.concat(confirmPasswordMatchesPassword)"
									/>
								</v-row>
							</template>
						</template>
					</v-container>
				</v-card-text>
				<v-card-actions>
					<v-spacer />
					<v-btn @click="show = false" color="primary" text>
						FECHAR
					</v-btn>
					<v-btn v-if="!loading" @click="submitForm" color="primary" :disabled="!isValid">
						ADICIONAR
					</v-btn>
				</v-card-actions>
			</v-card>
		</v-form>
	</v-dialog>
</template>

<script>
import api from "../services/api";
import imgur from "../services/imgur";
import ImagePicker from "@/components/imagePicker.vue";

export default {
	name: "AddUserDialog",
	props: ["availableProjects"],
	components: {
		ImagePicker,
	},
	data() {
		return {
			show: false,
			isValid: false,
			loading: false,
			defaultImage:
				"data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJ1c2VyIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0OCA1MTIiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS11c2VyIGZhLXctMTQgZmEtN3giPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTMxMy42IDMwNGMtMjguNyAwLTQyLjUgMTYtODkuNiAxNi00Ny4xIDAtNjAuOC0xNi04OS42LTE2QzYwLjIgMzA0IDAgMzY0LjIgMCA0MzguNFY0NjRjMCAyNi41IDIxLjUgNDggNDggNDhoMzUyYzI2LjUgMCA0OC0yMS41IDQ4LTQ4di0yNS42YzAtNzQuMi02MC4yLTEzNC40LTEzNC40LTEzNC40ek00MDAgNDY0SDQ4di0yNS42YzAtNDcuNiAzOC44LTg2LjQgODYuNC04Ni40IDE0LjYgMCAzOC4zIDE2IDg5LjYgMTYgNTEuNyAwIDc0LjktMTYgODkuNi0xNiA0Ny42IDAgODYuNCAzOC44IDg2LjQgODYuNFY0NjR6TTIyNCAyODhjNzkuNSAwIDE0NC02NC41IDE0NC0xNDRTMzAzLjUgMCAyMjQgMCA4MCA2NC41IDgwIDE0NHM2NC41IDE0NCAxNDQgMTQ0em0wLTI0MGM1Mi45IDAgOTYgNDMuMSA5NiA5NnMtNDMuMSA5Ni05NiA5Ni05Ni00My4xLTk2LTk2IDQzLjEtOTYgOTYtOTZ6IiBjbGFzcz0iIj48L3BhdGg+PC9zdmc+",
			image: null,
			name: "",
			project: "",
			userType: "real",
			email: "",
			specifyPassword: "no",
			password: "",
			confirmPassword: "",
			rules: {
				name: [(val) => (val ? true : "Este campo é obrigatório!")],
				email: [
					(val) => (val ? true : "Este campo é obrigatório!"),
					(val) =>
						/^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(
							val || ""
						)
							? true
							: "Endereço de email inválido", //chromium regex
					(val) => (/^.+@junitec\.pt$/i.test(val || "") ? true : "Apenas endereços @junitec.pt são aceites!"), //could be merged with above for more vague error messages
				],
				password: [
					(val) => (val ? true : "Este campo é obrigatório!"),
					(val) =>
						(val || "").length >= 8 && (val || "").length <= 30 ? true : "A palavra-passe deve ter entre 8 e 30 caracteres",
				],
				confirmPassword: [(val) => (val ? true : "Este campo é obrigatório")],
			},
		};
	},
	methods: {
		confirmPasswordMatchesPassword(val) {
			//method to allow `this`
			return val == this.password ? true : "As palavras-passe devem ser iguais!";
		},
		async submitForm() {
			this.loading = true;
			let vm = this;

			let projectInput = document.querySelector("#project").value;
			vm.project = projectInput;

			let postData = {
				name: vm.name,
				project: vm.project,
				userType: vm.userType,
				admin: vm.userType == "admin",
			};
			if (postData.userType != "virtual") {
				postData.email = vm.email;
				if (vm.specifyPassword == "yes") {
					postData.password = vm.password;
				}
			}
			try {
				if (vm.image) {
					const img = new FormData();
					img.append("image", vm.image.split(",")[1]);
					img.append("album", "CPFyamF");

					const imgurData = await imgur.post("/", img);

					postData.image = imgurData.data.data.link;
					postData.imageDeleteHash = imgurData.data.data.deletehash;
				}
			} catch {
				delete vm.image;
				this.flashMessage.error({
					title: "Upload da imagem falhado",
					message: "Não foi possivel carregar a imagem. A tentar atualizar o resto da informação...",
				});
			}

			api.post("/add-user", postData)
				.then((res) => {
					vm.$emit("newUser", {
						name: postData.name,
						image: postData.image,
						project: postData.project,
						id: res.data._id,
						self: false,
						isVirtual: postData.userType == "virtual",
						isAdmin: postData.userType == "admin",
						type: postData.userType.charAt(0).toUpperCase() + postData.userType.slice(1),
					});
					vm.show = false;
					vm.image = null;
					vm.name = "";
					vm.project = "";
					vm.email = "";
					vm.password = "";
					vm.loading = false;
					vm.flashMessage.success({
						title: "Sucesso!",
						message: `Utililizador ${postData.name} adicionado!`,
					});
				})
				.catch(async (err) => {
					const msg = err.response.data.msg || "Algo correu mal! Por favor tente mais tarde";

					if (postData.imageDeleteHash) {
						await imgur.delete(`/${postData.imageDeleteHash}`);
					}
					vm.loading = false;
					vm.flashMessage.error({
						title: "Ocorreu um erro!",
						// message: "Algo correu mal! Por favor tente mais tardee",
						message: msg,
					});
				});
		},
	},
};
</script>

<style lang="scss" scoped>
.searchbar_icon {
	background-color: #fff;
	color: #3486d7 !important;
	height: 54px !important;
	width: 54px !important;
}
</style>
