<template>
	<v-container fluid class="ma-0 pa-0">
		<v-row class="subtitle">
			<h4>Lista de localizações</h4>
		</v-row>
		<v-row justify="center">
			<v-col class="separators_container">
				<!-- Botão de criação, barra de pesquisa e apagar múltiplos -->
				<v-row
					class="separator pre_table"
					justify="space-between"
					align="center"
					:style="selectedLocations.length && !creating ? 'background: #3486d740' : ''"
				>
					<template v-if="!selectedLocations.length">
						<!--Botão de criação de uma nova localização -->
						<v-btn color="primary" :disabled="disableCreateButton" @click="startCreation">Criar Localização</v-btn>

						<!-- Barra de pesquisa -->
						<v-text-field class="search searchbar--settings" hide-details placeholder="Pesquisar localização" v-model="search">
							<font-awesome-icon :icon="['fas', 'search']" slot="append" />
						</v-text-field>
					</template>

					<template v-if="selectedLocations.length && !creating">
						<!-- Indicação do número de localizações selecionadas (apenas visível se existirem localizações selcionadas) -->
						<h3 class="ma-0">
							{{ selectedLocations.length }} Localizaç<span>{{ selectedLocations.length == 1 ? "ão" : "ões" }}</span>
							selecionadas
						</h3>

						<!-- Botão para ativar o modal e modal para apagar múltiplas localizações -->
						<v-dialog v-model="removeMultipleDialog" max-width="650">
							<!-- Botão para ativar o modal -->
							<template v-slot:activator="scopedDialog">
								<v-tooltip top>
									<template v-slot:activator="{ on, attrs }">
										<v-btn
											v-bind="Object.assign(attrs, scopedDialog.attrs)"
											v-on="Object.assign(on, scopedDialog.on)"
											icon
											class="mr-4"
											color="rgb(24, 86, 202)"
										>
											<v-icon large> mdi-delete </v-icon>
										</v-btn>
									</template>
									<span>Remover selecionadas</span>
								</v-tooltip>
							</template>

							<!-- Modal para apagar múltiplas localizações -->
							<v-card>
								<v-card-title class="headline mb-1">
									Remover localizações
									<font-awesome-icon style="color: #cc2836" :icon="['fas', 'exclamation-triangle']" class="ml-3" />
								</v-card-title>

								<v-card-text style="font-size: 18px" class="mt-3">
									<p class="mb-2">Esta ação <strong>não poderá ser revertida</strong> posteriormente!</p>
									<p>Tem a certeza que deseja remover todas as localizações selecionadas?</p>
								</v-card-text>

								<!-- Input da password para confirmar a remoção -->
								<v-card-text class="mb-2">
									<v-text-field
										rounded
										outlined
										placeholder="Password"
										hide-details
										v-model="password"
										:type="passwordVisibility ? 'text' : 'password'"
									>
										<font-awesome-icon :icon="['fas', 'key']" slot="prepend-inner" />
										<font-awesome-icon
											:icon="['fas', passwordVisibility ? 'eye-slash' : 'eye']"
											slot="append"
											style="cursor: pointer"
											@click="passwordVisibility = !passwordVisibility"
										/>
									</v-text-field>
								</v-card-text>

								<!-- Botões para cancelar e confirmar a remoção -->
								<v-card-actions class="mr-3 pb-5">
									<v-spacer></v-spacer>

									<!-- Botão para cancelar a remoção -->
									<v-btn text @click="removeMultipleDialog = false">
										Cancelar
									</v-btn>

									<!-- Botão para confirmar a remoção (apenas ativo se uma password for especificada) -->
									<v-btn
										rounded
										elevation="3"
										large
										class="button--danger pl-4 pr-4"
										@click="removeMultiple"
										:loading="loadingRemoveMultiple"
										:disabled="!password"
									>
										Remover
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</template>
				</v-row>

				<!-- Tabela com as localizações -->
				<v-row class="separator">
					<v-data-table
						show-select
						locale="pt-PT"
						sort-by="locationName"
						class="elevation-1"
						style="width: 100%; position: relative"
						v-model="selectedLocations"
						:headers="headers"
						:items="locations"
						:search="search"
						:loading="loading"
						:custom-filter="filter"
						:footer-props="{
							'items-per-page-text': 'Localizações por página:',
							'items-per-page-options': [10, 25, 50, -1],
							'items-per-page-all-text': 'Todas',
							'show-first-last-page': true,
							'show-current-page': true,
							'page-text': '',
						}"
					>
						<!-- Especificação do icon a mostrar quando tabela parcialmente selecionada -->
						<template v-slot:[`header.data-table-select`]="{ on, props }">
							<v-simple-checkbox v-bind="props" v-on="on" :disabled="disableSelect" indeterminate-icon="mdi-plus-box" />
						</template>

						<!-- Slot de seleção da linha -->
						<template v-slot:[`item.data-table-select`]="{ isSelected, select }">
							<v-simple-checkbox :value="isSelected" :disabled="disableSelect" @input="select($event)"></v-simple-checkbox>
						</template>

						<!-- Slots informativo e de edição referente à localização em si -->
						<template v-slot:[`item.locationName`]="{ item }">
							<!-- Slot informativo -->
							<span v-if="!item.editing">{{ item.locationName }}</span>

							<!-- Slot de edição -->
							<template v-if="item.editing">
								<v-row>
									<!-- Seleção do tipo de localização -->
									<v-select
										:items="locationTypes"
										item-value="value"
										item-text="label"
										single-line
										hide-details
										style="width: 70%"
										class="ma-0 pa-0 pl-2"
										v-model="newData.locationValue"
										clearable
									></v-select>
									<!-- Indicação do id (número) da localização -->
									<v-text-field
										type="number"
										min="1"
										single-line
										hide-details
										style="width: 27%; margin-left: 3% !important"
										class="ma-0 pa-0"
										v-model="newData.locationId"
										@keyup.enter="finishEditionOrCreation(item.index)"
									></v-text-field>
								</v-row>
							</template>
						</template>

						<!-- Slots informativo e de edição referente à localização pai -->
						<template v-slot:[`item.parentId`]="{ item }">
							<!-- Slot informativo -->
							<span v-if="!item.editing">{{
								item.parentId != null ? locations.find((l) => l.id == item.parentId).locationName : ""
							}}</span>

							<!-- Slot de edição -->
							<template v-if="item.editing">
								<v-row>
									<!-- Seleção da localização pai (tem de ser escolhida de entre as localizações já existes) -->
									<v-select
										:items="locations.filter((l) => !!l.locationName && l.locationValue != 'd')"
										item-value="id"
										item-text="locationName"
										single-line
										hide-details
										class="ma-0 pa-0 pl-2"
										v-model="newData.parentLocationId"
										clearable
									></v-select>
								</v-row>
							</template>
						</template>

						<!-- Slots de ações (editar e eliminar / guardar e cancelar localização) -->
						<template v-slot:[`item.actions`]="{ item }">
							<v-row align="center" justify="center">
								<!-- Ações mostradas quando a localização não está a ser editada (editar e eliminar) -->
								<div v-if="!item.editing">
									<!-- Botão de editar localização -->
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												v-bind="attrs"
												v-on="on"
												icon
												class="ml-2"
												@click="startEdition(item.index)"
												:disabled="disableEditButton"
											>
												<v-icon large> mdi-pencil </v-icon>
											</v-btn>
										</template>
										<span>Editar</span>
									</v-tooltip>

									<!-- Botão de eliminar localização -->
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												v-bind="attrs"
												v-on="on"
												icon
												class="ml-2"
												@click="startRemoval(item.index)"
												:disabled="disableRemoveButton"
											>
												<v-icon large> mdi-delete </v-icon>
											</v-btn>
										</template>
										<span>Remover</span>
									</v-tooltip>
								</div>

								<!-- Ações mostradas quando a localização está a ser editada (guardar e cancelar) -->
								<div v-if="item.editing">
									<!-- Botão para guardar as edições -->
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn
												v-bind="attrs"
												v-on="on"
												icon
												class="ml-2"
												@click="finishEditionOrCreation(item.index)"
												:loading="loadingEdition[item.index] || false"
											>
												<v-icon large> mdi-check </v-icon>
											</v-btn>
										</template>
										<span>Guardar</span>
									</v-tooltip>

									<!-- Botão para cancelar as edições -->
									<v-tooltip top>
										<template v-slot:activator="{ on, attrs }">
											<v-btn v-bind="attrs" v-on="on" icon class="ml-2" @click="cancelCreationOrEdition(item.index)">
												<v-icon large> mdi-close </v-icon>
											</v-btn>
										</template>
										<span>Cancelar</span>
									</v-tooltip>
								</div>
							</v-row>
						</template>

						<template v-slot:[`footer`]>
							<div style="position: absolute; bottom: 10px; left: 11px; ">
								<v-tooltip right>
									<template v-slot:activator="{ on }">
										<v-btn icon outlined color="#777777" v-on="on" @click="reload">
											<v-icon>mdi-refresh</v-icon>
										</v-btn>
									</template>
									<span>Recarregar</span>
								</v-tooltip>
							</div>
						</template>
					</v-data-table>

					<!-- Modal para apagar uma localização -->
					<v-dialog v-model="removeDialog" max-width="500">
						<v-card>
							<v-card-title class="headline mb-1">
								Remover localização
								<font-awesome-icon style="color: #cc2836" :icon="['fas', 'exclamation-triangle']" class="ml-3" />
							</v-card-title>

							<v-card-text style="font-size: 18px; padding-bottom: 15px; padding-top: 10px">
								Localização a ser apagada:
								<strong>{{ locationToBeRemovedName }}</strong>
							</v-card-text>

							<v-card-text style="font-size: 18px">
								Tem a certeza que deseja remover esta localização?
							</v-card-text>

							<!-- Botões para cancelar e confirmar a remoção -->
							<v-card-actions class="mr-3 pb-5">
								<v-spacer></v-spacer>
								<!-- Botão para cancelar a remoção -->
								<v-btn text @click="cancelRemoval">
									Cancelar
								</v-btn>

								<!-- Botão para confirmar a remoção -->
								<v-btn
									rounded
									elevation="3"
									large
									class="button--danger pl-4 pr-4"
									@click="remove"
									:loading="loadingRemove"
								>
									Remover
								</v-btn>
							</v-card-actions>
						</v-card>
					</v-dialog>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "LocationsTable",

	props: {
		locations: {
			type: Array,
			default: () => [],
		},
		locationTypes: {
			type: Array,
			default: () => [],
		},
		loading: {
			type: Boolean,
			default: false,
		},
		creating: {
			type: Boolean,
			default: false,
		},
		editing: {
			type: Boolean,
			default: false,
		},
	},

	data() {
		return {
			password: "",
			passwordVisibility: false,

			search: decodeURI(this.$route.query.search || ""),

			removeDialog: false,
			loadingRemove: false,
			locationToBeRemovedIndex: -1,
			locationToBeRemovedName: "",

			removeMultipleDialog: false,
			loadingRemoveMultiple: false,
			selectedLocations: [],

			loadingEdition: [],
			newData: {
				locationValue: "",
				locationId: null,
				parentLocationId: null,
			},

			headers: [
				{ text: "Localização", value: "locationName", width: "50%" },
				{ text: "localização-pai", value: "parentId", width: "40%" },
				{ text: "Ações", sortable: false, filterable: false, value: "actions", width: "122px", align: "center" },
			],
		};
	},

	methods: {
		startCreation() {
			if (this.creating) {
				this.flashMessage.warning({
					title: "Criação de localização não permitida",
					message: "Já está a ser criada uma nova localização!",
				});
			} else if (this.editing) {
				this.flashMessage.warning({
					title: "Criação de localização não permitida",
					message: "Não é possível criar uma localização enquanto outra estiver a ser atualizada!",
				});
			} else if (Object.keys(this.selectedLocations).length) {
				this.flashMessage.warning({
					title: "Criação de localização não permitida",
					message: "Não é possível criar uma localização enquanto existirem localizações selecionadas!",
				});
			} else {
				this.$emit("startCreation");
			}
		},

		startEdition(index) {
			if (this.creating) {
				this.flashMessage.warning({
					title: "Atualização de localização não permitida",
					message: "Não é possível atualizar uma localização enquanto outra estiver a ser criada!",
				});
			} else if (Object.keys(this.selectedLocations).length) {
				this.flashMessage.warning({
					title: "Atualização de localização não permitida",
					message: "Não é possível atualizar uma localização enquanto existirem localizações selecionadas!",
				});
			} else {
				this.newData = {
					locationValue: this.locations[index].locationValue || "",
					locationId: this.locations[index].id || null,
					parentLocationId: this.locations[index].parentId || null,
				};

				this.$emit("startEdition", index);
			}
		},

		cancelCreationOrEdition() {
			this.$emit(this.creating ? "cancelCreation" : "cancelEdition");

			this.flashMessage.warning({
				title: this.creating ? "Criação de localização cancelada" : "Atualização de localização cancelada",
				message: this.creating ? "A criação de uma nova localização foi cancelada!" : "A atualização da localização foi cancelada!",
			});

			this.newData = {
				locationValue: "",
				locationId: null,
				parentLocationId: null,
			};
		},

		finishEditionOrCreation(index) {
			function parentLinkageSearch(data) {
				let location = data.locations.find(
					(l) => l.locationValue == data.newData.locationValue && l.locationId == data.newData.locationId
				);
				let parentLocation = data.locations.find((l) => l.id == data.newData.parentLocationId);

				if (parentLocation && location) {
					while (parentLocation.parentId != null) {
						if (location.id == parentLocation.parentId) return true;

						parentLocation = data.locations.find((l) => l.id == parentLocation.parentId);
					}
				}

				return false;
			}

			//location verifications
			if (!this.newData.locationValue) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "É obrigatório indicar o nome da localização!",
				});
			} else if (!this.newData.locationId) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "É obrigatório indicar o ID da localização!",
				});
			} else if (!Number.isInteger(parseFloat(this.newData.locationId)) || Number(this.newData.locationId) < 1) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "É obrigatório o ID da localização ser um número inteiro positivo!",
				});
			} else if (
				this.locations.some((l) => {
					if (l.index == index) {
						return false;
					} else if (
						l.locationValue == this.newData.locationValue &&
						l.locationId == this.newData.locationId &&
						(this.newData.locationValue != "d" ||
							(this.newData.locationValue == "d" && l.parentId == this.newData.parentLocationId))
					) {
						return true;
					} else {
						return false;
					}
				})
			) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "A localização introduzida já existe!",
				});
			}
			//parent location verifications
			else if (this.newData.parentLocationId && !this.locations.some((l) => l.id == this.newData.parentLocationId)) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "A localização-pai introduzida tem de existir!",
				});
			} else if (this.newData.parentLocationId && parentLinkageSearch(this)) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "A localização-pai introduzida é uma sub-localização da localização!",
				});
			}
			//different data verifications
			else if (
				this.newData.parentLocationId &&
				this.locations.find((l) => l.id == this.newData.parentLocationId).locationValue == this.newData.locationValue &&
				this.locations.find((l) => l.id == this.newData.parentLocationId).locationId == this.newData.locationId
			) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "A localização-pai não pode ser igual à própria localização!",
				});
			}
			//division verifications
			else if (
				this.newData.parentLocationId &&
				this.locations.find((l) => l.id == this.newData.parentLocationId).locationValue[0] != "c" &&
				this.newData.locationValue[0] == "d"
			) {
				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: "Uma divisão tem de ter obrigatoriamente uma caixa como localização-pai!",
				});
			}
			//edit functionalities
			else {
				this.loadingEdition[index] = true;
				this.$forceUpdate();

				let location = {
					value: this.newData.locationValue + this.newData.locationId,
					parentId: this.newData.parentLocationId || null,
				};

				this.$emit(this.creating ? "finishCreation" : "finishEdition", location, index, (success) => {
					if (success) {
						this.newData = {
							locationValue: "",
							locationId: null,
							parentLocationId: null,
						};
					}

					this.loadingEdition[index] = false;
				});
			}
		},

		removeMultiple() {
			if (this.creating) {
				this.flashMessage.warning({
					title: "Remoção de localizações não permitida",
					message: "Não é possível remover uma localização enquanto outra estiver a ser criada!",
				});
			} else if (this.editing) {
				this.flashMessage.warning({
					title: "Remoção de localizações não permitida",
					message: "Não é possível remover uma localização enquanto outra estiver a ser atualizada!",
				});
			} else {
				this.loadingRemoveMultiple = true;

				let selectedIds = this.selectedLocations.map((l) => l.id);
				let notSelected = this.locations.filter((l) => !this.selectedLocations.includes(l));

				if (notSelected.some((l) => selectedIds.includes(l.parentId))) {
					this.removeMultipleDialog = false;
					this.loadingRemoveMultiple = false;

					this.flashMessage.error({
						title: "Remoção de localizações falhada",
						message: "Não foi possível remover as localizações porque alguma ainda contém sub-localizações!",
					});
				} else {
					this.$emit("removeMultiple", { password: this.password, ids: selectedIds }, (success) => {
						if (success) this.selectedLocations = [];
						this.removeMultipleDialog = false;
						this.loadingRemoveMultiple = false;
					});
				}
			}
		},

		startRemoval(index) {
			if (this.creating) {
				this.flashMessage.warning({
					title: "Remoção de localização não permitida",
					message: "Não é possível remover uma localização enquanto outra estiver a ser criada!",
				});
			} else if (this.editing) {
				this.flashMessage.warning({
					title: "Remoção de localização não permitida",
					message: "Não é possível remover uma localização enquanto outra estiver a ser atualizada!",
				});
			} else if (Object.keys(this.selectedLocations).length) {
				this.flashMessage.warning({
					title: "Remoção de localização não permitida",
					message: "Não é possível remover uma localização enquanto existirem localizações selecionadas!",
				});
			} else {
				this.removeDialog = true;
				this.locationToBeRemovedIndex = index;
				this.locationToBeRemovedName = this.locations[index].locationName;
			}
		},

		cancelRemoval() {
			this.removeDialog = false;

			this.locationToBeRemovedIndex = -1;

			this.flashMessage.warning({
				title: "Remoção de localização cancelada",
				message: this.creating ? "A criação de uma nova localização foi cancelada!" : "A atualização da localização foi cancelada!",
			});
		},

		remove() {
			this.loadingRemove = true;

			let locationToBeRemovedId = this.locations[this.locationToBeRemovedIndex].id;

			if (this.locations.some((l) => l.parentId == locationToBeRemovedId)) {
				this.removeDialog = false;
				this.loadingRemove = false;

				this.flashMessage.error({
					title: "Remoção de localização falhada",
					message: "Não foi possível remover a localização porque esta contém sub-localizações!",
				});
			} else {
				this.$emit("remove", this.locationToBeRemovedIndex, () => {
					this.removeDialog = false;
					this.loadingRemove = false;
				});
			}
		},

		reload() {
			this.$emit("reload");
		},

		filter(value, query) {
			if (typeof value == "string") {
				return value.toLowerCase().includes(query.toLowerCase());
			} else {
				if (value === null) {
					return false;
				} else {
					return this.locations
						.find((l) => l.id == value)
						.locationName.toLowerCase()
						.includes(query.toLowerCase());
				}
			}
		},
	},

	watch: {
		removeMultipleDialog(newValue) {
			if (!newValue) {
				this.password = "";
				this.passwordVisibility = false;
			}
		},

		editing() {
			this.$forceUpdate();
		},

		creating() {
			this.$forceUpdate();
		},

		search(newValue) {
			if (history.pushState) {
				var newurl =
					window.location.protocol +
					"//" +
					window.location.host +
					window.location.pathname +
					(newValue ? "?search=" + encodeURI(newValue) : "");
				window.history.pushState({ path: newurl }, "", newurl);
			}
		},
	},

	computed: {
		disableEditButton() {
			return !!(this.creating || Object.keys(this.selectedLocations).length);
		},
		disableRemoveButton() {
			return !!(this.creating || this.editing || Object.keys(this.selectedLocations).length);
		},
		disableCreateButton() {
			return !!(this.creating || this.editing || Object.keys(this.selectedLocations).length);
		},
		disableSelect() {
			return !!(this.creating || this.editing || !this.locations.length);
		},
	},
};
</script>
