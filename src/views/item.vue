<template>
	<v-container fluid class="item_container">
		<v-row>
			<v-col cols="3" justify="center">
				<v-row justify="center" align="center">
					<v-dialog v-model="imageDialogue" persistent max-width="1000">
						<template v-slot:activator="{ on, attrs }">
							<v-col justify="center" align="center" class="ml-3 mr-3 pb-0">
								<div
									class="image elevation-10"
									:style="{
										'background-image': `url(${edit ? newInfo.imageLink || newInfo.image : item.image})`,
										cursor: `${edit ? 'pointer' : 'auto'}`,
									}"
									v-bind="edit ? attrs : ''"
									v-on="edit ? on : ''"
								>
									<img :src="edit ? newInfo.imageLink || newInfo.image : item.image" />
								</div>
							</v-col>
						</template>
						<v-form v-model="isValidImage" autocomplete="off">
							<v-card>
								<v-card-title>
									<span class="headline ml-3 mt-3">Atualizar imagem</span>
								</v-card-title>
								<v-card-text>
									<v-container>
										<v-row justify="space-around" align="center">
											<!-- Descomentar para permitir fazer upload de uma nova imagem -->
											<!--

											<v-col style="text-align: center">
												<div
													class="image-input"
													:style="{ 'background-image': `url(${tmpImage})` }"
													@click="chooseFile('imageFileInput')"
												>
													<span v-if="!tmpImage" class="placeholder"></span>
													<input
														class="file-input"
														ref="imageFileInput"
														type="file"
														accept="image/*"
														@input="onSelectImageFile"
													/>
												</div>
												<div style="height: 36px; padding-top: 20px">
													<v-btn v-if="tmpImage != '/noImage.svg'" text class="button--ter" @click="deleteImage"
														>Apagar imagem</v-btn
													>
												</div>
											</v-col>
											<span class="mr-7">OU</span>

											-->

											<v-col class="ml-1">
												<!-- quando upload de imagem esta ativo adicionar -> :rules="rules.imageLink" -->
												<v-text-field
													clearable
													v-model="tmpImageLink"
													placeholder="Link da imagem"
													style="width: 99%"
												>
													<font-awesome-icon :icon="['fas', 'link']" slot="prepend" class="mt-1" />
												</v-text-field>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>
								<v-card-actions class="mr-3 pb-5">
									<v-spacer />
									<v-btn @click="cancelImageUpdate" color="primary" text>
										Cancelar
									</v-btn>
									<v-btn @click="updateImage" color="primary" :loading="loadingUpdate" :disabled="!isValidImage">
										Atualizar imagem
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-form>
					</v-dialog>
				</v-row>
			</v-col>
			<v-col cols="6" lg="7">
				<v-form v-model="editCheck" autocomplete="off">
					<v-row :class="edit ? 'mt-3' : 'mt-2 mb-5'">
						<h2 v-if="!edit">{{ item.name }}</h2>
						<v-text-field
							v-if="edit"
							outlined
							clearable
							v-model="newInfo.name"
							:rules="rules.mandatory"
							label="Nome do item"
						></v-text-field>
					</v-row>
					<v-row class="mb-3" align="center">
						<h3>Localização:</h3>
						<p v-if="!edit" class="ml-2 ma-0">{{ item.location }}</p>
						<v-select
							v-if="edit"
							clearable
							v-model="newInfo.locationId"
							:items="locations"
							item-text="name"
							item-value="id"
							class="pl-3"
							:rules="rules.mandatory"
							id="location"
						></v-select>
					</v-row>
					<v-row class="mb-3" align="center">
						<h3>Quantidade Total:</h3>
						<p v-if="!edit" :class="'ml-2 ma-0 ' + totalColor">{{ item.totalStock }}</p>
						<v-text-field v-if="edit" clearable v-model="newInfo.totalStock" :rules="rules.stock" class="pl-3"></v-text-field>
					</v-row>
					<v-row v-if="!edit" class="mb-3" align="center">
						<h3>Quantidade Disponível:</h3>
						<p :class="'ml-2 ma-0 ' + availableColor">{{ item.availableStock }}</p>
					</v-row>
					<v-row class="mb-3" align="center">
						<h3>Especificações:</h3>
						<a v-if="!edit" :href="item.link" class="ml-2 ma-0" target="_blank">
							{{ item.linkTitle }}
						</a>
						<v-col v-if="edit" cols="12" class="pa-0 ma-0">
							<v-text-field clearable label="Descrição" v-model="newInfo.linkTitle"></v-text-field>
						</v-col>
						<v-col v-if="edit" cols="12" class="pa-0 ma-0">
							<v-text-field clearable label="Link" v-model="newInfo.link"></v-text-field>
						</v-col>
					</v-row>
					<v-row class="mb-10">
						<v-col cols="12" class="pt-5 pb-1">
							<v-row>
								<h3>Descrição:</h3>
							</v-row>
						</v-col>
						<v-col cols="12" class="pt-0">
							<v-row>
								<p v-if="!edit" class="ma-0">
									{{ item.description }}
								</p>
								<v-textarea v-if="edit" clearable filled v-model="newInfo.description"> </v-textarea>
							</v-row>
						</v-col>
					</v-row>
				</v-form>
				<v-row v-if="!edit" class="users_searchbar_container pb-6">
					<v-col class="pb-0 pl-0">
						<v-text-field
							rounded
							outlined
							clearable
							hide-details
							class="searchbar elevation-2"
							v-model="searchQuery"
							placeholder="Pesquisar por nome ou projeto"
						>
							<font-awesome-icon :icon="['fas', 'search']" slot="prepend-inner" />
						</v-text-field>
					</v-col>
				</v-row>
				<v-row v-if="!edit" align="center">
					<UsersList :users="users" :loading="loading" :searchQuery="searchQuery" :showRequestedQnt="true" />
				</v-row>
				<v-row v-if="!edit" align="center">
					<ItemHistory :requests="requests" :loading="loading" :searchQuery="searchQuery" :showRequestedQnt="true" />
				</v-row>
			</v-col>
			<v-col cols="3" lg="2" class="pr-0 mt-3" align="right">
				<v-row>
					<v-col cols="12" align="center" class="pa-0">
						<v-row justify="center">
							<v-btn
								:loading="loadingUpdate"
								elevation="5"
								rounded
								x-large
								class="button--sec"
								style="width: 218px"
								@click="editInfo"
								:disabled="edit ? !editCheck : !hasLoaded"
							>
								{{ editBtnText }}
								<font-awesome-icon :icon="['fas', editBtnIcon]" class="ml-3" />
							</v-btn>
						</v-row>
						<v-row justify="center">
							<v-dialog v-if="!edit" v-model="deleteDialog" persistent max-width="500">
								<template v-slot:activator="{ on, attrs }">
									<v-btn
										elevation="5"
										rounded
										large
										class="button--danger mt-2"
										style="width: 212px"
										v-bind="attrs"
										v-on="on"
									>
										Eliminar Item
										<font-awesome-icon :icon="['fas', 'trash']" class="ml-3" />
									</v-btn>
								</template>
								<v-card>
									<v-card-title class="headline mb-1">
										Eliminar item
										<font-awesome-icon style="color: #cc2836" :icon="['fas', 'exclamation-triangle']" class="ml-3" />
									</v-card-title>
									<v-card-text style="font-size: 18px">
										Tem a certeza que deseja apagar o item?
									</v-card-text>
									<v-card-actions class="mr-3 pb-5">
										<v-spacer></v-spacer>
										<v-btn text @click="deleteDialog = false">
											Cancelar
										</v-btn>
										<v-btn
											rounded
											elevation="3"
											large
											class="button--danger pl-4 pr-4"
											@click="deleteItem"
											:loading="loadingRemove"
										>
											Remover
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-row>
					</v-col>
					<v-col v-if="edit" cols="12" align="center" class="pt-1">
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
import imgur from "../services/imgur";
import api from "../services/api";

import UsersList from "@/components/usersTable.vue";
import ItemHistory from "@/components/itemHistory.vue";

export default {
	name: "Item",
	components: {
		UsersList,
		ItemHistory,
	},
	data() {
		return {
			editCheck: false,
			deleteDialog: false,
			newImgFile: null,
			users: [],
			requests: [],
			searchQuery: "",
			loading: true,
			loadingUpdate: false,
			loadingRemove: false,
			edit: false,
			editBtnText: "Editar Item",
			editBtnIcon: "wrench",
			item: {},
			newInfo: {},
			locations: [],
			possibleLocations: [
				{ label: "Armário", value: "a" },
				{ label: "Caixa", value: "c" },
				{ label: "Divisão", value: "d" },
				{ label: "Saco", value: "s" },
			],
			rules: {
				mandatory: [
					(val) => {
						if (String(val || "").length > 0) {
							return true;
						} else {
							return "É necessário preencher este campo!";
						}
					},
				],
				stock: [
					(val) => {
						if ((val || "").length <= 0) {
							return "É necessário preencher este campo!";
						} else if (isNaN(this.newInfo.totalStock) || !Number.isInteger(parseFloat(this.newInfo.totalStock))) {
							return "A quantidade total tem de ser um número inteiro";
						} else if (Number(val) < 0) {
							return "A quantidade total tem de ser um número não negativo";
						} else if (Number(val) < Number(this.item.totalStock) - Number(this.item.availableStock)) {
							return `A quantidade total tem de ser superior á quantidade já requisitada (atualmente ${Number(
								this.item.totalStock
							) - Number(this.item.availableStock)})`;
						} else return true;
					},
				],
				imageLink: [
					(val) => {
						this.tmpImageLink = this.tmpImageLink ? this.tmpImageLink.trim() : "";

						if (String(val || "").length > 0) {
							if (this.tmpImage != "/noImage.svg") return "Existe uma imagem selecionada.";
							else return true;
						} else return true;
					},
				],
			},
			imageDialogue: false,
			isValidImage: false,
			tmpImage: "",
			tmpImageLink: "",
			hasLoaded: false,
		};
	},
	methods: {
		chooseFile(fileRef) {
			this.$refs[fileRef].click();
		},

		onSelectImageFile() {
			const input = this.$refs.imageFileInput;
			const files = input.files;
			this.newImgFile = files[0];
			this.tmpImage = URL.createObjectURL(files[0]);
			this.tmpImageLink += " ";
		},

		deleteImage() {
			this.newImgFile = null;
			this.tmpImage = "/noImage.svg";
			this.tmpImageLink += " ";
		},

		cancelImageUpdate() {
			this.newImgFile = null;
			this.tmpImage = this.newInfo.image;
			this.tmpImageLink = this.newInfo.imageLink;

			this.imageDialogue = false;
		},

		updateImage() {
			this.newInfo.image = this.tmpImage;
			this.newInfo.imageLink = this.tmpImageLink;

			this.imageDialogue = false;
		},

		toggleEdit() {
			this.edit = !this.edit;
			this.editBtnText = this.edit ? "Guardar" : "Editar Item";
			this.editBtnIcon = this.edit ? "save" : "wrench";
		},

		async editInfo() {
			if (this.edit) {
				this.loadingUpdate = true;
				let allCheck = true;

				if (!((this.newInfo.linkTitle && this.newInfo.link) || (!this.newInfo.linkTitle && !this.newInfo.link))) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Especificações",
						message: "É obrigatório os dois campos estarem ou preenchidos ou vazios.",
					});
				}

				if (!this.newInfo.name) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Nome",
						message: "É obrigatório especificar o nome do item.",
					});
				}

				if ((this.newInfo.totalStock || "").length <= 0) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Quantidade",
						message: "É obrigatório especificar a quantidade do item.",
					});
				} else if (isNaN(this.newInfo.totalStock) || !Number.isInteger(parseFloat(this.newInfo.totalStock))) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Quantidade",
						message: "A quantidade do item tem de ser um número inteiro.",
					});
				} else if (Number(this.newInfo.totalStock) < 0) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Quantidade",
						message: "A quantidade do item tem de ser um número não negativo.",
					});
				} else if (Number(this.newInfo.totalStock) < Number(this.item.totalStock) - Number(this.item.availableStock)) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Quantidade",
						message: "A quantidade total tem de ser superior á quantidade já requisitada.",
					});
				}

				if (!this.newInfo.location) {
					allCheck = false;
					this.flashMessage.warning({
						title: "Localização",
						message: "É obrigatório especificar a localização do item.",
					});
				}

				if (allCheck) {
					let data = {};

					for (let key in this.newInfo) {
						if (this.newInfo[key] != this.item[key]) {
							data[key] = this.newInfo[key];
						}
					}

					if (Object.keys(data).length > 0) {
						if (data.image != this.item.image && this.item.imageDeleteHash) {
							try {
								await imgur.delete(`/${this.item.imageDeleteHash}`);
								data.imageDeleteHash = "";
								this.newInfo.imageDeleteHash = "";
							} catch {
								this.flashMessage.error({
									title: "Remoção de imagem falhada",
									message: "Não foi possivel remover a imagem. A tentar atualizar o resto da informação...",
								});
							}
						}

						if (!this.newInfo.imageLink && this.newImgFile) {
							try {
								const img = new FormData();
								img.append("image", this.newImgFile);
								img.append("album", "R08tTzC");

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

							this.newImgFile = null;
						} else if (this.newInfo.imageLink && !this.newImgFile) {
							data.image = this.newInfo.imageLink;
						}

						delete data.imageLink;

						try {
							await api.put(`/item/${this.$route.params.id}`, data);

							let available = Number(this.item.availableStock);
							let total = Number(this.item.totalStock);
							let dif = Number(this.newInfo.totalStock) - total;
							this.newInfo.availableStock = available + dif;
							this.newInfo.location = this.locations.find((l) => l.id == this.newInfo.locationId).name;

							this.newInfo.image = data.image || this.item.image || "/noImage.svg";
							this.newInfo.imageLink = "";
							this.item = { ...this.newInfo };
							this.tmpImage = this.item.image;
							this.tmpImageLink = "";

							this.flashMessage.success({
								title: "Atualização bem sucedida",
								message: "As informações do item foram atualizadas com sucesso.",
							});

							this.toggleEdit();
						} catch {
							this.flashMessage.error({
								title: "Atualização da informação falhada",
								message:
									"Não foi possivel atulizar a informação do item. Por favor confirme que preencheu todos os campos corretamente!",
							});
						}
					}
				}

				this.loadingUpdate = false;
			} else {
				this.toggleEdit();
			}
		},

		cancelEditInfo() {
			this.newInfo = { ...this.item };
			this.newImgFile = null;
			this.tmpImage = "";
			this.tmpImageLink = "";
			this.toggleEdit();
		},

		async deleteItem() {
			this.loadingRemove = true;

			try {
				await api.delete(`/item/${this.$route.params.id}`);

				if (this.item.imageDeleteHash) {
					try {
						await imgur.delete(`/${this.item.imageDeleteHash}`);
					} catch {
						this.flashMessage.error({
							title: "Remoção de imagem falhada",
							message: "Não foi possivel remover a imagem. A canelar operação... Por favor tente mais tarde!",
						});
					}
				}

				this.$router.push("/");
				this.flashMessage.success({
					title: "Item eliminado",
					message: "O item foi eliminado com sucesso",
				});
			} catch (err) {
				switch (err.response.status) {
					case 403:
						this.flashMessage.error({
							title: "Remoção de item falhada",
							message: "O item que tentou remover foi requisitado por um utilizador. A cancelar a remoção...",
						});
						break;
					case 404:
						this.flashMessage.error({
							title: "Remoção de item falhada",
							message: "O item que tentou remover não fo encontrado. Por favor volte a tentar mais tarde!",
						});
						break;
					default:
						this.flashMessage.error({
							title: "Remoção de item falhada",
							message: "Não foi possivel remover o item. Por favor volte a tentar mais tarde!",
						});
						break;
				}
			}

			this.deleteDialog = false;
			this.loadingRemove = false;
		},
	},
	async created() {
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
			let item = await api.get(`/item/${this.$route.params.id}`);

			this.item = { ...item.data };

			this.item.location = this.locations.find((l) => l.id == this.item.locationId).name;
			this.item.imageLink = "";
			if (!this.item.image) this.item.image = "/noImage.svg";

			this.newInfo = { ...this.item };
			this.tmpImage = this.item.image;
			this.tmpImageLink = "";

			this.loading = false;
			this.hasLoaded = true;
		} catch (err) {
			console.log(err);
			if (err.response.status == 404) {
				this.flashMessage.error({
					title: "Item não encontrado",
					message: "O item a que tentou aceder não foi encontrado.",
				});
			} else if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Obtenção da informação do item falhada",
					message: "Ocorreu um erro durante a obtenção das informações do item. Por favor, volte a tentar dentro de instantes...",
				});
			}
			this.$router.push("/");
		}
		//chamada ao backend de users -- definida em routes --> fazer semelhante no history

		try {
			let users = await api.get(`/item/${this.$route.params.id}/users/${this.personalId}`);
			this.users = users.data.users;
			this.users.forEach((user) => {
				user.type = user.isVirtual ? "Virtual" : user.isAdmin ? "Admin" : "Real";
			});
		} catch (err) {
			if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Listagem de membros falhada",
					message: "Ocorreu um erro durante a obtenção dos membros. Por favor, volte a tentar dentro de instantes...",
				});
			}
		}

		try {
			let response = await api.get(`/requests/${this.$route.params.id}`);
			this.requests = response.data.requests;

			console.log(this.requests);
		} catch (err) {
			if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Historico Falhado",
					message: "Ocorreu um erro durante a obtenção do historico. Por favor, volte a tentar dentro de instantes...",
				});
			}
		}
	},

	computed: {
		totalColor() {
			if (this.item.totalStock != 0) {
				return "qnt--green";
			} else {
				return "qnt--red";
			}
		},
		availableColor() {
			if (this.item.availableStock != 0) {
				return "qnt--green";
			} else {
				return "qnt--red";
			}
		},
		personalId() {
			return this.$store.getters.id;
		},
	},
};
</script>

<style scoped lang="scss">
.image-input {
	width: 250px;
	height: 250px;
	display: block;
	cursor: pointer;
	margin: 0 auto;
	background-size: contain;
	background-position: center;
	background-repeat: no-repeat;

	input[type="file"] {
		position: absolute;
		top: -9999999px;
	}
}

.placeholder {
	background: url("../assets/images/placeholder.png");
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}

.item_container {
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

	.qnt {
		&--red {
			color: red;
		}

		&--green {
			color: green;
		}
	}

	.users_searchbar_container {
		width: 75%;
		min-width: 550px;
	}
}
</style>
