<!-- 
Para por o upload da imagem a funcionar basta descomentar 
os elementos ou passar para dentro os que estão na linha
-->

<template>
	<v-container fluid class="user_container">
		<v-row>
			<v-col cols="3" justify="center">
				<v-row justify="center" align="center">
					<v-col justify="center" align="center" class="ml-3 mr-3 pb-0">
						<div class="image elevation-10" :style="{ 'background-image': `url(${editing ? newInfo.image : user.image})` }">
							<!-- por dentro da tag do style - cursor: `${editing ? 'pointer' : 'auto'}` -->
							<!-- @click="editing ? triggerImageUpload() : null" -->
							<img :src="editing ? newInfo.image : user.image" />
							<input type="file" accept="image/*" ref="image_upload" v-on:change="handleImageFile" />
						</div>
					</v-col>
					<!--
					<v-col v-if="editing" class="pt-1" align="center">
						<v-btn text class="button--ter" @click="deleteImage">Apagar imagem</v-btn>
					</v-col>
					-->
				</v-row>
			</v-col>
			<v-col cols="6" lg="7">
				<v-form v-model="editCheck" autocomplete="off">
					<v-row :class="editing ? 'mt-3' : 'mt-2 mb-5'">
						<h2 v-if="!editing">{{ user.name }}</h2>
						<v-text-field
							v-if="editing"
							outlined
							clearable
							v-model="newInfo.name"
							:rules="rules.mandatory"
							label="Nome do membro"
						></v-text-field>
					</v-row>
					<v-row :class="editing ? 'mb-8 mt-n4' : 'mb-3'" align="center">
						<h3>Projeto:</h3>
						<p v-if="!editing" class="ml-2 ma-0">{{ user.project }}</p>
						<v-combobox
							v-if="editing"
							clearable
							v-model="newInfo.project"
							@keydown="(e) => (newInfo.project = e.target._value)"
							id="project"
							:items="projects"
							class="pl-3"
						></v-combobox>
					</v-row>
					<v-row v-if="!editing" class="mb-3" align="center">
						<h3>Tipo de Utilizador:</h3>
						<p class="ml-2 ma-0">{{ user.isVirtual ? "Virtual" : user.isAdmin ? "Admin" : "Real" }}</p>
					</v-row>
				</v-form>
				<v-row v-if="editing && !user.isVirtual">
					<v-col class="pa-0">
						<h1 style="font-size:25px;" align="left">
							Atualização de password
						</h1>
						<v-row class="ma-0 mt-3">
							<v-col cols="6" class="pa-0" style="min-width: 400px">
								<v-text-field
									rounded
									outlined
									placeholder="password atual"
									v-model="passwords.old"
									:rules="rules.password"
									:type="visibility1 ? 'text' : 'password'"
								>
									<font-awesome-icon :icon="['fas', 'key']" slot="prepend-inner" />
									<font-awesome-icon
										:icon="['fas', visibility1 ? 'eye-slash' : 'eye']"
										slot="append"
										style="cursor: pointer"
										@click="visibility1 = !visibility1"
									/>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row class="ma-0">
							<v-col cols="6" class="pa-0" style="min-width: 400px">
								<v-text-field
									rounded
									outlined
									placeholder="password nova"
									v-model="passwords.new"
									:rules="rules.password"
									:type="visibility2 ? 'text' : 'password'"
								>
									<font-awesome-icon :icon="['fas', 'key']" slot="prepend-inner" />
									<font-awesome-icon
										:icon="['fas', visibility2 ? 'eye-slash' : 'eye']"
										slot="append"
										style="cursor: pointer"
										@click="visibility2 = !visibility2"
									/>
								</v-text-field>
							</v-col>
						</v-row>
						<v-row class="ma-0 mt-n1" align="center" justify="start">
							<v-col cols="6" class="pa-0" style="min-width: 400px; text-align: right">
								<v-btn rounded class="button--danger" @click="updatePassword" :loading="loadingPassword">Atualizar</v-btn>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row v-if="!editing" class="itens_searchbar_container pb-6">
					<v-col class="pb-0 pl-0">
						<v-text-field
							rounded
							outlined
							clearable
							hide-details
							class="searchbar elevation-2"
							v-model="search"
							placeholder="Pesquisar por item"
						>
							<font-awesome-icon :icon="['fas', 'search']" slot="prepend-inner" />
						</v-text-field>
					</v-col>
				</v-row>
				<v-row v-if="!editing" align="center">
					<ItemsTable
						:items="items"
						:loading="loading"
						:searchQuery="search"
						:isAdmin="showActions"
						requisitado
						@derequestItem="showDerequestDialog"
						@changeRequestItem="showChangeRequestDialog"
					/>

					<v-dialog v-model="showDerequestItemDialog" persistent max-width="500">
						<v-card>
							<v-card-title class="headline mb-1">
								Desrequistar Item -
								<span style="color: #137b89; margin-left: 5px;"> {{ this.derequestInfo.name }}</span
								><font-awesome-icon style="color: #cc2836" :icon="['fas', 'exclamation-triangle']" class="ml-3" />
							</v-card-title>
							<v-card-text style="font-size: 18px">
								Tem a certeza que deseja desrequisitar o item?
							</v-card-text>
							<v-card-actions class="mr-3 pb-5">
								<v-spacer></v-spacer>
								<v-btn text @click="cancelRequestItem">
									Cancelar
								</v-btn>
								<v-btn
									rounded
									elevation="3"
									large
									class="button--danger pl-4 pr-4"
									@click="submitChangeRequestItemForm"
									:loading="loadingDerequest"
								>
									DESREQUISITAR
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-row>
			</v-col>
			<v-col cols="3" lg="2" class="pr-0 mt-3" align="right">
				<v-row v-if="showActions">
					<v-dialog max-width="50%" v-model="showChangeRequestItemDialog">
						<v-form v-model="isValidRequest" autocomplete="off" @submit.prevent="submitChangeRequestItemForm">
							<v-card class="pa-2">
								<v-card-title>
									<span class="headline ml-3 mt-3"
										>Alterar requisição -
										<span style="color: #137b89">{{ this.changeRequestItemFormData.name }}</span></span
									>
								</v-card-title>
								<v-card-text>
									<v-container>
										<v-row class="ml-0">
											<p>
												Quantidade disponível:
												<strong v-if="requestType === 'request'" style="color: #137b89; font-size: 20px">{{
													availableStock
												}}</strong>
												<strong v-else style="color: #137b89; font-size: 20px">{{ stock }}</strong>
											</p>
										</v-row>
										<v-row>
											<v-radio-group v-model="requestType" row mandatory>
												<v-radio value="request">
													<template v-slot:label>
														<span>
															Requisitar
														</span>
													</template>
												</v-radio>
												<v-radio value="return">
													<template v-slot:label>
														<span>
															Devolver
														</span>
													</template>
												</v-radio>
											</v-radio-group>
											<v-col>
												<v-text-field
													label="Quantidade"
													v-model="changeRequestItemFormData.quantity"
													outlined
													type="number"
													:rules="rules.quantityRequest.concat(checkQuantity)"
												/>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>
								<v-card-actions class="mr-3 pb-5">
									<v-spacer></v-spacer>
									<v-btn color="primary" text @click="cancelChangeRequestItem">
										CANCELAR
									</v-btn>
									<v-btn
										color="primary"
										@click="submitChangeRequestItemForm"
										:loading="loadingChangeRequest"
										:disabled="!isValidRequest"
									>
										ALTERAR
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-form>
					</v-dialog>
					<v-col cols="12" align="center" class="pa-0">
						<v-row justify="center">
							<v-btn
								:loading="loadingUpdate"
								elevation="5"
								rounded
								x-large
								class="button--sec"
								style="width: 243px"
								@click="editInfo"
								:disabled="editing ? !editCheck : !hasLoaded"
							>
								{{ editBtnText }}
								<font-awesome-icon :icon="['fas', editBtnIcon]" class="ml-3" />
							</v-btn>
						</v-row>
						<v-row justify="center">
							<v-dialog v-if="!editing" v-model="deleteDialog" persistent max-width="500">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										elevation="5"
										rounded
										large
										class="button--danger mt-2"
										style="width: 237px"
										v-bind="attrs"
										v-on="on"
									>
										Eliminar perfil
										<font-awesome-icon :icon="['fas', 'trash']" class="ml-3" />
									</v-btn>
								</template>
								<v-form v-model="isValidDelete" @submit.prevent="deleteUser">
									<v-card class="pa-3">
										<v-card-title class="headline mb-1">
											Apagar perfil
											<font-awesome-icon
												style="color: #cc2836"
												:icon="['fas', 'exclamation-triangle']"
												class="ml-3"
											/>
										</v-card-title>
										<v-card-text style="font-size: 18px">
											Tem a certeza que deseja apagar o seu perfil? Se sim, introduza a password e clique em
											'Remover'.
										</v-card-text>
										<v-card-text class="pb-0 pt-2">
											<v-text-field
												rounded
												outlined
												placeholder="Password"
												v-model="deleteUserPassword"
												:rules="rules.password"
												:type="deleteVisibility ? 'text' : 'password'"
											>
												<font-awesome-icon :icon="['fas', 'key']" slot="prepend-inner" />
												<font-awesome-icon
													:icon="['fas', deleteVisibility ? 'eye-slash' : 'eye']"
													slot="append"
													style="cursor: pointer"
													@click="deleteVisibility = !deleteVisibility"
												/>
											</v-text-field>
										</v-card-text>
										<v-card-actions>
											<v-spacer></v-spacer>
											<v-btn text @click="deleteDialog = false">
												Cancelar
											</v-btn>
											<v-btn
												rounded
												elevation="3"
												large
												class="button--danger pl-4 pr-4"
												@click="deleteUser"
												:loading="loadingRemove"
												:disabled="!isValidDelete"
											>
												Remover
											</v-btn>
										</v-card-actions>
									</v-card>
								</v-form>
							</v-dialog>
						</v-row>
					</v-col>
					<v-col v-if="editing" cols="12" align="center" class="pt-1">
						<v-btn text class="button--ter" @click="cancelEditInfo">
							Cancelar
							<font-awesome-icon :icon="['fas', 'times']" class="ml-2" />
						</v-btn>
					</v-col>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import api from "../services/api";
import imgur from "../services/imgur";
import ItemsTable from "@/components/itemsTable.vue";

export default {
	name: "User",
	components: {
		ItemsTable,
	},
	data() {
		return {
			showChangeRequestItemDialog: false,

			stock: 0,
			availableStock: 0,
			requestType: "request",

			isValidRequest: false,
			changeRequestItemFormData: {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			},
			loadingChangeRequest: false,
			isValidDelete: false,
			editCheck: false,
			hasLoaded: false,
			newInfo: {},
			deleteUserPassword: "",
			deleteDialog: false,
			deleteVisibility: false,
			loadingRemove: false,
			loadingDerequest: false,
			newImgFile: null,
			projects: [],
			loading: true,
			loadingUpdate: false,
			loadingPassword: false,
			editing: false,
			passwordUpdated: 0,
			user: {},
			search: "",
			editBtnText: "Editar perfil",
			editBtnIcon: "wrench",
			userId: this.$route.params.id,
			items: [],
			rules: {
				mandatory: [
					(val) => {
						if ((val || "").length > 0) {
							return true;
						} else {
							return "É necessário preencher este campo!";
						}
					},
				],
				password: [
					(val) => {
						if (this.passwordUpdated || (val || "").length > 0) {
							this.passwordUpdated--;
							return true;
						} else {
							return "É necessário fornecer uma password";
						}
					},
				],
				quantityRequest: [
					(val) => (val ? true : "Este campo é obrigatório!"),
					(val) => (val > 0 ? true : "Insira um número positivo"),
				],
			},
			visibility1: false,
			visibility2: false,
			passwords: {
				old: "",
				new: "",
			},
			derequestInfo: {
				id: "",
				name: "",
			},
			showDerequestItemDialog: false,
			possibleLocations: [
				{ label: "Armário", value: "a" },
				{ label: "Caixa", value: "c" },
				{ label: "Divisão", value: "d" },
				{ label: "Saco", value: "s" },
			],
			locations: [],
		};
	},
	methods: {
		showChangeRequestDialog(id, availableStock, name, currentStock) {
			if (this.changeRequestItemFormData._id != id) {
				this.availableStock = availableStock;
				this.stock = currentStock;

				this.changeRequestItemFormData = {
					member: this.userId,
					quantity: 0,
					_id: id,
					name,
				};
			}
			this.showChangeRequestItemDialog = true;
		},

		cancelChangeRequestItem() {
			this.showChangeRequestItemDialog = false;
			this.availableStock = 0;
			this.changeRequestItemFormData = {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			};
		},

		checkQuantity(val) {
			if (this.requestType === "request" && val > this.availableStock) {
				return "Quantidade indisponivel";
			} else if (this.requestType === "return" && val > this.stock) {
				return "Quantidade em excesso";
			} else return true;
		},

		async submitChangeRequestItemForm() {
			if (!this.isValidRequest) return;

			this.loadingChangeRequest = true;

			// probs nao a melhor maneira de fazer isto
			const sign = this.requestType === "request" ? 1 : -1;

			try {
				let res = await api.put(`/user/${this.changeRequestItemFormData.member}/items/${this.changeRequestItemFormData._id}`, {
					quantity: sign * this.changeRequestItemFormData.quantity,
				});

				this.stock += sign * this.changeRequestItemFormData.quantity;

				let index = this.items.findIndex((item) => item._id == this.changeRequestItemFormData._id);
				this.items[index].stock.available = res.data + "";

				this.items[index].quantity = this.stock;
				// this.items = [...this.items];

				if (this.stock === 0) {
					this.items.splice(index, 1);
				}

				if (sign === 1) {
					this.flashMessage.success({
						title: "Requisição efetuada",
						message: `O item foi requistado com sucesso (${this.changeRequestItemFormData.name} - ${this.changeRequestItemFormData.quantity}).`,
					});
				} else {
					this.flashMessage.success({
						title: "Devolução efetuada",
						message: `O item foi devolvido com sucesso (${this.changeRequestItemFormData.name} - ${this.changeRequestItemFormData.quantity}).`,
					});
				}
			} catch (err) {
				console.log(err);
				this.flashMessage.error({
					title: "Requisição falhada",
					message: `Não foi possível proceder à requisição do item. Por favor tente novamente mais tarde.`,
				});
			}
			this.showChangeRequestItemDialog = false;
			this.availableStock = 0;
			this.changeRequestItemFormData = {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			};

			this.loadingChangeRequest = false;
			this.showDerequestItemDialog = false;
		},

		showDerequestDialog(id, name, returnVal) {
			this.isValidRequest = true;
			this.stock = returnVal;
			this.requestType = "return";

			this.changeRequestItemFormData = {
				member: this.userId,
				quantity: returnVal,
				_id: id,
				name,
			};

			this.derequestInfo.id = id;
			this.derequestInfo.name = name;
			this.showDerequestItemDialog = true;
		},

		/* async derequestItem() {
			console.log(this.changeRequestItemFormData.quantity);
			this.loadingDerequest = true;
			try {
				await api.delete(`/user/${this.userId}/items/${this.derequestInfo.id}`);

				let pos = this.items.findIndex((item) => item._id == this.derequestInfo.id);

				this.items.splice(pos, 1);
			} catch {
				this.flashMessage.error({
					title: "Desrequisição falhada",
					message: `Não foi possível proceder à desrequisição do item. Por favor tente novamente mais tarde.`,
				});
			}
			this.loadingDerequest = false;
			this.showDerequestItemDialog = false;
		}, */

		cancelRequestItem() {
			this.isValidRequest = false;
			this.requestType = "request";

			this.showDerequestItemDialog = false;
			this.changeRequestItemFormData = {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			};
		},

		async updatePassword() {
			this.loadingPassword = true;
			if (
				(this.passwords.old || "").length >= 8 &&
				(this.passwords.old || "").length <= 30 &&
				(this.passwords.new || "").length >= 8 &&
				(this.passwords.new || "").length <= 30
			) {
				if (this.passwords.new != this.passwords.old) {
					try {
						await api.put(`/user/${this.userId}/password`, {
							passwords: this.passwords,
						});
						this.flashMessage.success({
							title: "Password atualizada",
							message: "Password alterada com sucesso!",
						});
						this.passwordUpdated = 2;
						this.passwords = {
							old: "",
							new: "",
						};
					} catch {
						this.flashMessage.error({
							title: "Credenciais erradas",
							message: "A password atual indicada está incorreta!",
						});
					}
				} else {
					this.flashMessage.warning({
						title: "Nova password inválida",
						message: "A password nova não pode ser igual à antiga",
					});
				}
			} else {
				this.flashMessage.warning({
					title: "Formato das passwords",
					message: "As duas passwords tem de ter entre 8 e 30 caracteres.",
				});
			}
			this.loadingPassword = false;
		},

		triggerImageUpload() {
			this.$refs["image_upload"].click();
		},

		handleImageFile(e) {
			this.newImgFile = e.target.files[0];
			this.newInfo.image = URL.createObjectURL(e.target.files[0]);
		},

		deleteImage() {
			this.newImgFile = null;
			this.newInfo.image = "/noImage.svg";
		},

		toggleEdit() {
			this.editing = !this.editing;
			this.editBtnText = this.editing ? "Guardar" : "Editar perfil";
			this.editBtnIcon = this.editing ? "save" : "wrench";
		},

		cancelEditInfo() {
			this.newInfo = { ...this.user };
			if (this.user.project == "Nenhum projeto associado") this.newInfo.project = null;
			this.newImgFile = null;
			this.toggleEdit();
		},

		async editInfo() {
			if (this.editing) {
				this.loadingUpdate = true;
				let allCheck = true;

				let projectInput = document.querySelector("#project").value;
				this.newInfo.project = projectInput;

				if (!this.newInfo.name) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Nome",
						message: "É obrigatório especificar o nome.",
					});
				}

				if (allCheck) {
					let data = {};

					for (let key in this.newInfo) {
						if (this.newInfo[key] != this.user[key]) {
							data[key] = this.newInfo[key];
						}
					}

					if (Object.keys(data).length > 0) {
						if (data.image == "/noImage.svg" && this.user.imageDeleteHash) {
							delete data.image;
							try {
								await imgur.delete(`/${this.user.imageDeleteHash}`);
								data.image = "";
								data.imageDeleteHash = "";
								this.newInfo.image = "/noImage.svg";
								this.newInfo.imageDeleteHash = "";
							} catch {
								this.newInfo.image = this.user.image;
								this.newInfo.imageDeleteHash = this.user.imageDeleteHash;
								this.flashMessage.error({
									title: "Remoção de imagem falhada",
									message: "Não foi possivel remover a imagem. A tentar atualizar o resto da informação...",
								});
							}
						} else if (this.newImgFile) {
							delete data.image;

							try {
								if (this.user.imageDeleteHash) {
									await imgur.delete(`/${this.user.imageDeleteHash}`);
									data.image = "";
									data.imageDeleteHash = "";
									this.newInfo.image = "/noImage.svg";
									this.newInfo.imageDeleteHash = "";
								}

								try {
									const img = new FormData();
									img.append("image", this.newImgFile);
									img.append("album", "CPFyamF");

									const imgurData = await imgur.post("/", img);

									data.image = imgurData.data.data.link;
									data.imageDeleteHash = imgurData.data.data.deletehash;
									this.newInfo.image = imgurData.data.data.link;
									this.newInfo.imageDeleteHash = imgurData.data.data.deletehash;
								} catch {
									this.newInfo.image = "/noImage.svg";
									this.newInfo.imageDeleteHash = "";
									this.flashMessage.error({
										title: "Upload da imagem falhado",
										message: "Não foi possivel carregar a imagem. A tentar atualizar o resto da informação...",
									});
								}
							} catch {
								this.newInfo.image = this.user.image;
								this.newInfo.imageDeleteHash = this.user.imageDeleteHash;
								this.flashMessage.error({
									title: "Remoção da imagem falhada",
									message: "Não foi possivel remover a imagem. A tentar atualizar o resto da informação...",
								});
							}

							this.newImgFile = null;
						}

						try {
							await api.put(`/user/${this.userId}`, data);

							this.user = { ...this.newInfo };
							if (!this.user.project) this.user.project = "Nenhum projeto associado";

							if (this.user.project && this.projects.indexOf(this.user.project) == -1) this.projects.push(this.user.project);

							this.flashMessage.success({
								title: "Atualização bem sucedida",
								message: "As informações do perfil foram atualizadas com sucesso.",
							});

							this.toggleEdit();
						} catch {
							this.flashMessage.error({
								title: "Atualização da informação falhada",
								message:
									"Não foi possivel atulizar a informação do perfil. Por favor confirme que preencheu todos os campos corretamente!",
							});
						}
					} else {
						this.flashMessage.success({
							title: "Atualização bem sucedida",
							message: "As informações do perfil foram atualizadas com sucesso.",
						});

						this.toggleEdit();
					}
				}

				this.loadingUpdate = false;
			} else {
				this.toggleEdit();
			}
		},

		async deleteUser() {
			if (!this.isValidDelete) return;

			this.loadingRemove = true;
			try {
				await api.delete(`/user/${this.$route.params.id}`, {
					data: { password: this.deleteUserPassword },
				});

				if (this.user.imageDeleteHash) {
					try {
						await imgur.delete(`/${this.user.imageDeleteHash}`);
					} catch {
						this.flashMessage.error({
							title: "Remoção de imagem falhada",
							message:
								"Não foi possivel remover a sua foto de perfil. Por favor contacte o administrador do sistema para mais informações!",
						});
					}
				}

				if (this.personalId == this.userId) {
					api.post("/logout");

					this.$store.commit("logout");

					this.$router.push("/login");
				} else {
					this.$router.push("/users");
				}

				this.flashMessage.success({
					title: "Perfil eliminado",
					message: "O perfil foi eliminado com sucesso!",
				});
			} catch (err) {
				switch (err.response.status) {
					case 403:
						this.flashMessage.error({
							title: "Remoção de perfil falhada",
							message: "A password introduzida não está correta. A cancelar a remoção...",
						});
						break;
					case 409:
						this.flashMessage.error({
							title: "Remoção de perfil falhada",
							message:
								"O perfil que tentou remover tem itens associados. Por favor desrequisite-os e volte a tentar. A cancelar a remoção...",
						});
						break;
					case 404:
						this.flashMessage.error({
							title: "Remoção de perfil falhada",
							message: "O perfil que tentou remover não foi encontrado. Por favor volte a tentar mais tarde!",
						});
						break;
					default:
						this.flashMessage.error({
							title: "Remoção de perfil falhada",
							message: "Não foi possivel remover o perfil. Por favor volte a tentar mais tarde!",
						});
						break;
				}
			}

			this.deleteDialog = false;
			this.deleteUserPassword = "";
			this.loadingRemove = false;
		},

		cancelEditItem() {
			this.showEditItemDialog = false;
			this.editItemInfo.id = "";
			this.editItemInfo.name = "";
		},
	},
	computed: {
		personalId() {
			return this.$store.getters.id;
		},
		showActions() {
			return this.$store.getters.isAdmin || this.personalId == this.userId;
		},
	},
	async created() {
		this.loading = true;

		try {
			let res1 = await api.get(`/user/${this.userId}`);
			this.projects = [...res1.data.projects];
			this.user = { ...res1.data.info };
			if (!this.user.image) this.user.image = "/noImage.svg";
			this.newInfo = { ...this.user };
			if (!this.user.project) this.user.project = "Nenhum projeto associado";
		} catch (err) {
			if (err.response.status == 404) {
				this.flashMessage.error({
					title: "Obtenção da informação do membro falhada",
					message:
						"Ocorreu um erro durante a obtenção das informações do membro. Por favor, volte a tentar dentro de instantes...",
				});
			} else if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Membro não encontrado",
					message: "O item a que tentou aceder não foi encontrado.",
				});
			}
			this.$router.push("/users");
		}

		try {
			this.locations = (await api.get("/locations")).data;

			const nomeMap = { a: "Armário", c: "Caixa", d: "Divisão", s: "Saco" };

			this.locations.forEach((location) => {
				location.name = nomeMap[location.locationValue[0]] + " " + location.locationValue.substr(1, location.locationValue.length);

				let id = location.parentId;
				while (id) {
					const parentLoc = this.locations.find((l) => l.id == id);
					location.name =
						nomeMap[parentLoc.locationValue[0]] +
						" " +
						parentLoc.locationValue.substr(1, parentLoc.locationValue.length) +
						" - " +
						location.name;

					id = parentLoc.parentId;
				}
			});
		} catch (err) {
			if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Listagem de localizações falhada",
					message: "Ocorreu um erro durante a obtenção das localizações. Por favor, volte a tentar dentro de instantes...",
				});
			}
		}

		try {
			let items = await api.get(`/user/${this.userId}/items`);
			this.items = items.data.items;

			for (let item of this.items) {
				item.stock = {
					total: item.totalStock,
					available: item.availableStock,
				};

				item.location = this.locations.find((l) => l.id == item.locationId).name;
			}

			this.loadingItens = false;
		} catch (err) {
			if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Listagem de itens falhada",
					message: "Ocorreu um erro durante a obtenção dos itens. Por favor, volte a tentar dentro de instantes...",
				});
			}
		}

		this.hasLoaded = true;
		this.loading = false;
	},
};
</script>

<style lang="scss" scoped>
.user_container {
	background: #fff !important;

	.image {
		width: 90%;
		min-width: 225px;
		background-size: 100%;
		background-position: center;
		background-repeat: no-repeat;
		border-radius: 10px;

		img {
			visibility: hidden;
			width: 100%;
			margin-bottom: -7px;
		}

		input[type="file"] {
			position: absolute;
			top: -9999999px;
		}
	}

	.itens_searchbar_container {
		width: 75%;
		min-width: 550px;
		margin-top: 10%;
	}
}
</style>
