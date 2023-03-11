<template>
	<v-container fluid>
		<v-row align="center">
			<v-col>
				<v-row align="center" justify="center">
					<v-col class="itens_searchbar_container pt-0 pb-6">
						<v-row>
							<v-col style="min-width: 54px; max-width: 54px; margin-right: 24px; margin-top: 1px">
								<v-dialog max-width="50%" v-model="showExcelDialog" v-if="isAdmin">
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
													<font-awesome-icon dark :icon="['far', 'file-excel']" class="fa-lg" />
												</v-btn>
											</template>
											<span>Upload Excel</span>
										</v-tooltip>
									</template>
									<v-form v-model="isValidExcel" autocomplete="off">
										<v-card>
											<v-card-title>
												<span class="headline ml-3 mt-3">Upload excel de itens</span>
											</v-card-title>
											<v-card-text>
												<v-container>
													<v-row>
														<v-col>
															<v-file-input
																:accept="excelMimeTypes"
																label="Ficheiro de itens"
																v-model="newExcelFile"
																:rules="rules.excel"
															></v-file-input>
														</v-col>
													</v-row>
												</v-container>
											</v-card-text>
											<v-card-actions class="mr-3 pb-5">
												<v-spacer />
												<v-btn @click="showExcelDialog = false" color="primary" text>
													FECHAR
												</v-btn>
												<v-btn
													@click="submitExcelForm"
													color="primary"
													:loading="loadingExcel"
													:disabled="!isValidExcel || !newExcelFile"
												>
													CARREGAR
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-form>
								</v-dialog>
							</v-col>
							<v-col>
								<v-text-field
									class="searchbar--general elevation-2"
									rounded
									outlined
									hide-details
									clearable
									autofocus
									v-model="search"
									placeholder="Pesquisar por item"
									@click:clear="clearSearch"
								>
									<font-awesome-icon :icon="['fas', 'search']" slot="prepend-inner" />
								</v-text-field>
							</v-col>
							<v-col style="min-width: 54px; max-width: 54px; margin-left: 12px; margin-top: 1px" class="pl-0">
								<v-dialog max-width="50%" v-model="showAddItemDialog">
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
											<span>Criar Item</span>
										</v-tooltip>
									</template>
									<v-form v-model="isValidAdd" autocomplete="off">
										<v-card>
											<v-card-title>
												<span class="headline ml-3 mt-3">Criar Item</span>
											</v-card-title>
											<v-card-text>
												<v-container>
													<v-row>
														<v-col>
															<v-text-field
																label="Nome"
																hide-details
																v-model="addItemFormData.name"
																:rules="rules.mandatory"
																outlined
															/>
														</v-col>
													</v-row>
													<v-row>
														<v-col>
															<v-textarea
																hide-details
																outlined
																label="Descrição"
																v-model="addItemFormData.description"
																auto-grow
															></v-textarea>
														</v-col>
													</v-row>
													<v-row>
														<v-col cols="4">
															<v-select
																hide-details
																label="Contável"
																v-model="addItemFormData.countable"
																:items="itemIsCountable"
																item-text="text"
																item-value="isCountable"
																outlined
																type="boolean"
															/>
														</v-col>
														<v-col cols="4">
															<v-text-field
																hide-details
																label="Stock total"
																v-model="addItemFormData.totalStock"
																:disabled="!addItemFormData.countable"
																:rules="addItemFormData.countable ? rules.mandatory : ''"
																outlined
																type="number"
															/>
														</v-col>
														<v-col cols="4">
															<v-select
																hide-details
																label="Em Stock"
																v-model="addItemFormData.inStock"
																:items="itemInStock"
																:disabled="addItemFormData.countable"
																item-text="text"
																item-value="inStock"
																outlined
																type="string"
															/>
														</v-col>
													</v-row>
													<v-row justify="space-around" align="center">
														<!-- Descomentar para permitir fazer upload de uma nova imagem -->
														<!--

														<v-col style="text-align: center">
															<div
																class="image-input"
																:style="{ 'background-image': `url(${addItemFormData.image})` }"
																@click="chooseFile('imageFileInput')"
															>
																<span v-if="!addItemFormData.image" class="placeholder"></span>
																<input
																	class="file-input"
																	ref="imageFileInput"
																	type="file"
																	accept="image/*"
																	@input="onSelectImageFile"
																/>
															</div>
															<div style="height: 36px; padding-top: 12px">
																<v-btn
																	v-if="addItemFormData.image"
																	text
																	class="button--ter"
																	@click="
																		addItemFormData.image = '';
																		addItemFormData.imageLink += ' ';
																		newImgFile = null;
																	"
																	>Apagar imagem</v-btn
																>
															</div>
														</v-col>
														<span class="mr-7">OU</span>

														-->
														<v-col cols="6">
															<v-select
																hide-details
																label="Localização"
																v-model="addItemFormData.location"
																:items="locations"
																item-text="name"
																item-value="id"
																id="location"
																outlined
																:rules="rules.mandatory"
															/>
														</v-col>
														<v-col cols="6">
															<v-text-field
																clearable
																v-model="addItemFormData.imageLink"
																placeholder="Link da imagem"
																style="width: 99%"
																:rules="rules.imageLink"
															>
																<font-awesome-icon :icon="['fas', 'link']" slot="prepend" class="mt-1" />
															</v-text-field>
														</v-col>
													</v-row>
												</v-container>
											</v-card-text>
											<v-card-actions class="mr-3 pb-5">
												<v-spacer />
												<v-btn @click="showAddItemDialog = false" color="primary" text>
													FECHAR
												</v-btn>
												<v-btn
													@click="submitAddItemForm"
													color="primary"
													:loading="loadingAdd"
													:disabled="!isValidAdd"
												>
													CRIAR
												</v-btn>
											</v-card-actions>
										</v-card>
									</v-form>
								</v-dialog>
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row align="center">
					<ItemsTable
						:items="items"
						:loading="loadingItens"
						:searchQuery="search"
						:locationSearch="locationSearch"
						:isAdmin="isAdmin"
						style="width: 80%"
						@requestItem="showRequestDialog"
					/>
					<v-dialog max-width="50%" v-model="showRequestItemDialog">
						<v-form v-model="isValidRequest" autocomplete="off">
							<v-card class="pa-2">
								<v-card-title>
									<span class="headline ml-3 mt-3"
										>Requisitar Item - <span style="color: #137b89">{{ this.requestItemFormData.name }}</span></span
									>
								</v-card-title>
								<v-card-text>
									<v-container>
										<v-row>
											<v-col class="pb-0">
												<v-select
													label="Membro"
													clearable
													v-model="requestItemFormData.member"
													outlined
													:rules="rules.member"
													:items="users"
													item-text="text"
													item-value="id"
													@change="checkRequested"
													@click:clear="checkRequested"
												/>
											</v-col>
										</v-row>
										<v-row class="ml-2">
											<p>
												Existem ainda
												<strong style="color: #137b89; font-size: 20px">{{ availableStock }}</strong> unidade(s)
												para requisitar.
											</p>
										</v-row>
										<v-row>
											<v-col>
												<v-text-field
													label="Quantidade"
													v-model="requestItemFormData.quantity"
													outlined
													type="number"
													:rules="rules.quantityRequest.concat(checkQuantity)"
													@keyup.enter="submitRequestItemForm"
												/>
											</v-col>
										</v-row>
									</v-container>
								</v-card-text>
								<v-card-actions class="mr-3 pb-5">
									<v-spacer></v-spacer>
									<v-btn color="primary" text @click="cancelRequestItem">
										CANCELAR
									</v-btn>
									<v-btn
										color="primary"
										@click="submitRequestItemForm"
										:loading="loadingRequest"
										:disabled="!isValidRequest"
									>
										REQUISITAR
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-form>
					</v-dialog>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
import ItemsTable from "@/components/itemsTable.vue";
import api from "../services/api";
import imgur from "../services/imgur";

export default {
	name: "Items",
	components: {
		ItemsTable,
	},
	data() {
		return {
			newImageFile: null,
			newExcelFile: null,

			showAddItemDialog: false,
			showRequestItemDialog: false,
			showExcelDialog: false,

			isValidAdd: false,
			isValidRequest: false,
			isValidExcel: false,

			loadingItens: true,
			loadingAdd: false,
			loadingRequest: false,
			loadingExcel: false,

			addItemFormData: {
				name: "",
				description: "",
				location: "",
				totalStock: "",
				image: "",
				imageLink: "",
				countable: true,
				inStock: "",
			},
			requestItemFormData: {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			},

			availableStock: 0,

			locations: [],
			items: [],
			users: [],
			itemIsCountable: [
				{ text: "Contável", isCountable: true },
				{ text: "Não contável", isCountable: false },
			],
			itemInStock: [
				{ text: "Disponível", inStock: "Disp." },
				{ text: "Esgotado", inStock: "N/A" },
			],
			search: "",
			locationSearch: false,

			possibleLocations: [
				{ label: "Armário", value: "a" },
				{ label: "Caixa", value: "c" },
				{ label: "Divisão", value: "d" },
				{ label: "Saco", value: "s" },
			],

			excelMimeTypes: [
				"application/vnd.ms-excel",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				"application/vnd.openxmlformats-officedocument.spreadsheetml.template",
				"application/vnd.ms-excel.sheet.macroEnabled.12",
				"application/vnd.ms-excel.template.macroEnabled.12",
				"application/vnd.ms-excel.addin.macroEnabled.12",
				"application/vnd.ms-excel.sheet.binary.macroEnabled.12",
				"application/vnd.oasis.opendocument.spreadsheet",
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
				mandatoryBool: [
					(val) => {
						if (val !== null) {
							return true;
						} else {
							return "É necessário preencher este campo!";
						}
					},
				],
				member: [(val) => (val ? true : "Este campo é obrigatório!")],
				quantityRequest: [
					(val) => (val ? true : "Este campo é obrigatório!"),
					(val) => (val > 0 ? true : "Insira um número positivo"),
				],
				totalStockAdd: [
					(val) => (val ? true : "Este campo é obrigatório!"),
					(val) => (val >= 0 ? true : "Insira um número positivo"),
				],
				excel: [
					(val) => {
						if (this.newExcelFile != null)
							return this.excelMimeTypes.includes(val ? val.type : "")
								? true
								: "O ficheiro tem de ser um excel ou formato equivalente";
						else {
							return true;
						}
					},
				],
				imageLink: [
					(val) => {
						this.addItemFormData.imageLink = this.addItemFormData.imageLink ? this.addItemFormData.imageLink.trim() : "";

						if (String(val || "").length > 0) {
							if (this.addItemFormData.image) return "Existe uma imagem selecionada.";
							else return true;
						} else return true;
					},
				],
			},
		};
	},
	methods: {
		clearSearch() {
			this.search = "";
			this.locationSearch = false;

			this.$router.push("/");
		},

		chooseFile(fileRef) {
			this.$refs[fileRef].click();
		},

		onSelectImageFile() {
			const input = this.$refs.imageFileInput;
			const files = input.files;
			this.newImgFile = files[0];
			this.addItemFormData.image = URL.createObjectURL(files[0]);
			this.addItemFormData.imageLink += " ";
		},

		showRequestDialog(id, availableStock, name) {
			if (this.requestItemFormData._id != id) {
				this.hasRequested = false;
				this.availableForUser = 0;
				this.availableStock = availableStock;
				this.requestItemFormData = {
					member: "",
					quantity: "",
					_id: id,
					name,
				};
			}
			this.showRequestItemDialog = true;
		},

		cancelRequestItem() {
			this.showRequestItemDialog = false;
			this.hasRequested = false;
			this.availableStock = 0;
			this.availableForUser = 0;
			this.requestItemFormData = {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			};
		},

		async submitAddItemForm() {
			this.loadingAdd = true;
			var allCheck = true;

			if (!this.addItemFormData.name) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Nome",
					message: "É obrigatório especificar o nome do item.",
				});
			}
			if (!this.addItemFormData.location) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Localização",
					message: "É obrigatório especificar a localização do item.",
				});
			}
			if (!this.addItemFormData.countable.toString()) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Contável",
					message: "É obrigatório especificar se o item é contável.",
				});
			} else if (!this.addItemFormData.countable && !this.addItemFormData.inStock) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Stock disponível",
					message: "Como o item não é contável, é obrigatório especificar se o item está disponível ou esgotado.",
				});
			} else if (this.addItemFormData.countable && !this.addItemFormData.totalStock.toString()) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Stock disponível",
					message: "Como o item é contável, é obrigatório especificar o stock total do item..",
				});
			} else if (
				this.addItemFormData.countable &&
				(parseFloat(this.addItemFormData.totalStock) < 0 ||
					isNaN(this.addItemFormData.totalStock) ||
					!Number.isInteger(parseFloat(this.addItemFormData.totalStock)))
			) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Stock total",
					message: "O stock total do item tem de ser um número inteiro.",
				});
			} else if (!this.addItemFormData.inStock && !this.addItemFormData.totalStock.toString()) {
				allCheck = false;
				this.flashMessage.warning({
					title: "Stock total e Existência",
					message: "É obrigatório especificar o stock total do item, ou se não contável, se em stock.",
				});
			}

			if (allCheck) {
				if (!this.addItemFormData.imageLink && this.newImgFile) {
					try {
						const img = new FormData();
						img.append("image", this.newImgFile);
						img.append("album", "R08tTzC");

						const imgurData = await imgur.post("/", img);

						this.addItemFormData.image = imgurData.data.data.link;
						this.addItemFormData.imageDeleteHash = imgurData.data.data.deletehash;
					} catch {
						delete this.addItemFormData.image;
						this.flashMessage.error({
							title: "Upload da imagem falhado",
							message: "Não foi possivel carregar a imagem. A tentar atualizar o resto da informação...",
						});
					}

					this.newImgFile = null;
				} else {
					this.addItemFormData.image = this.addItemFormData.imageLink;
				}

				try {
					let res = await api.post("/item", this.addItemFormData);
					this.addItemFormData._id = res.data;
					if (this.addItemFormData.countable) {
						this.addItemFormData.stock = {
							countable: this.addItemFormData.countable,
							total: this.addItemFormData.totalStock,
							available: this.addItemFormData.totalStock,
						};
					} else {
						this.addItemFormData.stock = {
							countable: this.addItemFormData.countable,
							total: this.addItemFormData.inStock,
							available: this.addItemFormData.inStock,
						};
					}

					this.addItemFormData.location = this.locations.find((l) => l.id == this.addItemFormData.location).name;
					this.items.push(this.addItemFormData);
					this.flashMessage.success({
						title: "Novo item",
						message: "Novo item criado com sucesso",
					});
				} catch (err) {
					if (this.addItemFormData.imageDeleteHash) {
						await imgur.delete(`/${this.addItemFormData.imageDeleteHash}`);
					}
					this.flashMessage.error({
						title: "Criação de novo item falhada",
						message: "Houve um problem durante a criação de um novo item. Por favor volte a tentar mais tarde!",
					});
				}

				this.addItemFormData = {
					name: "",
					description: "",
					location: "",
					totalStock: "",
					image: "",
					imageLink: "",
					countable: true,
					inStock: "",
				};
				this.showAddItemDialog = false;
			}
			this.loadingAdd = false;
		},

		async submitRequestItemForm() {
			if (!this.isValidRequest) return;

			this.loadingRequest = true;

			try {
				let res = await api.put(`/user/${this.requestItemFormData.member}/items/${this.requestItemFormData._id}`, {
					quantity: this.requestItemFormData.quantity,
				});

				let index = this.items.findIndex((item) => item._id == this.requestItemFormData._id);
				this.items[index].stock.available = res.data + "";
				this.items = [...this.items];

				let userIndex = this.users.findIndex((user) => user.id == this.requestItemFormData.member);
				let itemIndex = this.users[userIndex].items.findIndex((item) => item._id == this.requestItemFormData._id);
				if (itemIndex != -1) {
					this.users[userIndex].items[itemIndex].quantity = Number(this.requestItemFormData.quantity);
				} else {
					this.users[userIndex].items.push({
						_id: this.requestItemFormData._id,
						quantity: Number(this.requestItemFormData.quantity),
					});
				}

				this.flashMessage.success({
					title: "Requisição efetuada",
					message: `O item foi requistado com sucesso (${this.requestItemFormData.name} - ${this.requestItemFormData.quantity}).`,
				});
			} catch (err) {
				this.flashMessage.error({
					title: "Requisição falhada",
					message: `Não foi possível proceder à requisição do item. Por favor tente novamente mais tarde.`,
				});
			}
			this.showRequestItemDialog = false;
			this.hasRequested = false;
			this.availableStock = 0;
			this.availableForUser = 0;
			this.requestItemFormData = {
				member: "",
				quantity: "",
				_id: "",
				name: "",
			};

			this.loadingRequest = false;
		},

		async submitExcelForm() {
			this.loadingExcel = true;

			try {
				let formData = new FormData();
				formData.append("excel", this.newExcelFile);

				await api.post("/items", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				this.newExcelFile = null;
				this.loadingExcel = false;
				this.showExcelDialog = false;

				this.flashMessage.success({
					title: "Importação de itens concluída",
					message: "Os itens foram importados com sucesso!",
				});
			} catch (err) {
				this.newExcelFile = null;
				this.loadingExcel = false;

				this.flashMessage.error({
					title: "Importação de itens falhada",
					message: err.response.data,
				});

				return;
			}

			this.loadingItens = true;

			try {
				let items = await api.get("/items");
				this.items = [...items.data];
				for (let item of this.items) {
					item.stock = {
						countable: item.countable,
						total: item.totalStock,
						available: item.availableStock,
					};
					item.location = this.locations.find((l) => l.id == item.locationId).name;
				}

				this.flashMessage.success({
					title: "Listagem de itens concluida",
					message: "A listagem dos novos itens foi concluida com sucesso",
				});
			} catch {
				this.flashMessage.error({
					title: "Listagem de itens falhada",
					message: "Ocorreu um erro durante a obtenção dos itens. Por favor, volte a tentar dentro de instantes...",
				});
			}

			this.loadingItens = false;
		},

		checkQuantity(val) {
			if (val > Number(this.availableForUser)) {
				return "Quantidade indisponivel";
			} else return true;
		},

		checkRequested() {
			this.hasRequested = false;
			this.requestItemFormData.quantity = null;
			this.availableForUser = this.availableStock;
		},
	},
	computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},
	},

	async created() {
		if (this.$route.query.loc) {
			let parsedLoc = this.$route.query.loc.split(".");

			this.locationSearch = true;

			if (parsedLoc.length == 1) {
				this.search =
					this.possibleLocations.find((l) => l.value == this.$route.query.loc[0]).label + " " + this.$route.query.loc.slice(1);
			} else {
				this.search =
					this.possibleLocations.find((l) => l.value == parsedLoc[parsedLoc.length - 2][0]).label +
					" " +
					parsedLoc[parsedLoc.length - 2].slice(1) +
					" - " +
					this.possibleLocations.find((l) => l.value == parsedLoc[parsedLoc.length - 1][0]).label +
					" " +
					parsedLoc[parsedLoc.length - 1].slice(1);
			}
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

			return;
		}

		try {
			const items = (await api.get("/items")).data;

			this.items = [...items];

			for (let item of this.items) {
				item.stock = {
					total: item.totalStock,
					available: item.availableStock,
				};

				item.location = this.locations.find((l) => l.id == item.locationId).name;
			}

			this.loadingItens = false;
		} catch (err) {
			console.log(err);

			if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Listagem de itens falhada",
					message: "Ocorreu um erro durante a obtenção dos itens. Por favor, volte a tentar dentro de instantes...",
				});
			}
		}

		try {
			let users = await api.get(`/items/request/usersList`);
			for (let user of users.data.list) {
				this.users[user.self ? "unshift" : "push"]({
					id: user.id,
					text:
						user.name +
						(user.project ? " - " + user.project : "") +
						(user.self ? " (Eu)" : "") +
						(user.isVirtual ? " (Virtual)" : ""),
					self: user.self,
					items: user.items,
				});
			}
		} catch (err) {
			if (err.response.status != 401) {
				this.flashMessage.error({
					title: "Listagem de membros falhada",
					message: "Ocorreu um erro durante a obtenção dos membros. Por favor, volte a tentar dentro de instantes...",
				});
			}
		}
	},
};
</script>

<style scoped lang="scss">
.itens_searchbar_container {
	max-width: 50%;

	.searchbar_icon {
		background-color: #fff;
		color: #3486d7 !important;
		height: 54px;
		width: 54px;
	}
}

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
</style>
