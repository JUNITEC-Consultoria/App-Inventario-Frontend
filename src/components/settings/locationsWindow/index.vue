<template>
	<v-container fluid class="ma-0 pa-0">
		<v-row class="ma-0 pa-0">
			<v-col class="window">
				<!-- Título -->
				<v-row class="title mb-3">
					<h2>Localizações</h2>
				</v-row>
				<v-divider></v-divider>

				<!-- Listagem das localizações -->
				<LocationsTable
					:locations="locations"
					:locationTypes="possibleLocations"
					:loading="loadingLocations"
					:creating="creatingLocation"
					:editing="editingLocation"
					@startCreation="startCreatingLocation"
					@cancelCreation="cancelLocationCreation"
					@finishCreation="finishLocationCreation"
					@startEdition="startEditingLocation"
					@cancelEdition="cancelLocationEdition"
					@finishEdition="finishLocationEdition"
					@removeMultiple="removeMultipleLocations"
					@remove="removeLocation"
					@reload="fetchLocations"
				/>

				<!-- Upload de localizações -->
				<ImportLocationsExcel @importExcel="importLocationsExcel" />

				<!-- Exportar as localizações -->
				<ExportLocationsExcel @exportExcel="exportLocationsExcel" />

				<!-- Apagar todas as localizações -->
				<RemoveAllLocations @removeAll="removeAllLocations" />
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
//serviços
import FileSaver from "file-saver";
import api from "@/services/api";

//componentes
import LocationsTable from "./partials/locationsTable.vue";
import ImportLocationsExcel from "./partials/importLocationsExcel.vue";
import ExportLocationsExcel from "./partials/exportLocationsExcel.vue";
import RemoveAllLocations from "./partials/removeAllLocations.vue";

export default {
	name: "LocationsWindow",

	components: {
		LocationsTable,
		ImportLocationsExcel,
		ExportLocationsExcel,
		RemoveAllLocations,
	},

	data() {
		return {
			locations: [],
			loadingLocations: true,
			creatingLocation: false,
			editingLocation: false,
			possibleLocations: [
				{ label: "Armário", value: "a" },
				{ label: "Caixa", value: "c" },
				{ label: "Divisão", value: "d" },
				{ label: "Saco", value: "s" },
			],
			nomeMap: { a: "Armário", c: "Caixa", d: "Divisão", s: "Saco" },
		};
	},

	methods: {
		async fetchLocations() {
			this.loadingLocations = true;

			try {
				this.locations = (await api.get("/locations")).data;

				this.locations.forEach((location, index) => {
					location.index = index;
					location.editing = false;

					location.locationName =
						this.nomeMap[location.locationValue[0]] + " " + location.locationValue.substr(1, location.locationValue.length);
				});
			} catch (err) {
				if (err.response.status != 401) {
					this.flashMessage.error({
						title: "Listagem de localizações falhada",
						message: "Ocorreu um erro durante a obtenção das localizações. Por favor, volte a tentar dentro de instantes...",
					});
				}
			}

			this.loadingLocations = false;
		},

		startCreatingLocation() {
			let id = 0;
			for (let location of this.locations) {
				if (location.id > id) id = location.id;
			}

			this.locations.push({
				index: this.locations.length,
				editing: true,
				id: id + 1,
				locationName: "",
				locationValue: "",
				locationId: null,
				parentId: null,
			});

			this.creatingLocation = true;
		},

		cancelLocationCreation() {
			this.locations.pop();

			this.creatingLocation = false;
		},

		async finishLocationCreation(locationInfo, index, cb) {
			try {
				let location = (await api.post("/location", locationInfo)).data;

				Object.assign(this.locations[index], {
					...location,
					locationName:
						this.nomeMap[location.locationValue[0]] + " " + location.locationValue.substr(1, location.locationValue.length),
					editing: false,
				});

				this.creatingLocation = false;

				this.flashMessage.success({
					title: "Criação de localização concluída",
					message: "A nova localização foi criada com sucesso!",
				});

				cb(true);
			} catch (err) {
				let errors = {
					"400": "Os dados introduzidos estão incorretos. Por favor, corrija e volte a tentar...",
					"409": "A localização introduzida já existe.",
					default: "Ocorreu um erro durante a remoção das localizações. Por favor, volte a tentar dentro de instantes...",
				};

				this.flashMessage.error({
					title: "Criação de localização falhada",
					message: errors[[400, 409].includes(err.response.status) ? err.response.status + "" : "default"],
				});

				cb(false);
			}
		},

		startEditingLocation(index) {
			this.locations.forEach((l) => (l.editing = false));

			this.locations[index].editing = true;

			this.editingLocation = true;
		},

		cancelLocationEdition() {
			this.locations.forEach((l) => (l.editing = false));

			this.editingLocation = false;
		},

		async finishLocationEdition(locationInfo, index, cb) {
			try {
				let location = (await api.put(`/location/${this.locations[index].id}`, locationInfo)).data;

				Object.assign(this.locations[index], {
					...location,
					locationName: this.possibleLocations.find((l) => l.value == location.locationValue).label + " " + location.locationId,
					editing: false,
				});

				this.editingLocation = false;

				this.flashMessage.success({
					title: "Atualização de localização concluída",
					message: "A localização foi atualizada com sucesso!",
				});

				cb(true);
			} catch (err) {
				let errors = {
					"400": "Os dados introduzidos estão incorretos. Por favor, corrija e volte a tentar...",
					"404": "A localização que tentou atualizar não existe.",
					"409": "A localização introduzida já existe.",
					default: "Ocorreu um erro durante a atualização da localização. Por favor, volte a tentar dentro de instantes...",
				};

				this.flashMessage.error({
					title: "Atualização de localização falhada",
					message: errors[[400, 404, 409].includes(err.response.status) ? err.response.status + "" : "default"],
				});

				cb(false);
			}
		},

		async removeLocation(index, cb) {
			try {
				await api.delete(`/location/${this.locations[index].id}`);

				this.flashMessage.success({
					title: "Remoção de localização concluída",
					message: "A localização foi removida com sucesso!",
				});

				cb();

				this.loadingLocations = true;

				this.locations.splice(index, 1);
				this.locations.forEach((location, newIndex) => {
					location.index = newIndex;
				});

				this.loadingLocations = false;
			} catch (err) {
				let errors = {
					"404": "A localização que tentou remover não existe!",
					"409_child": "Não foi possível remover a localização porque esta contém sub-localizações!",
					"409_item": "Não foi possível remover a localização porque esta é referenciada por um item!",
					default: "Ocorreu um erro durante a remoção da localização. Por favor, volte a tentar dentro de instantes...",
				};

				this.flashMessage.error({
					title: "Remoção de localização falhada",
					message:
						errors[
							[404, 409].includes(err.response.status)
								? err.response.status + (["child", "item"].includes(err.response.data) ? "_" + err.response.data : "")
								: "default"
						],
				});

				cb();
			}
		},

		async removeMultipleLocations(data, cb) {
			try {
				await api.delete(`/locations`, { data });

				this.flashMessage.success({
					title: "Remoção de localizações concluída",
					message: "As localizações foram removidas com sucesso!",
				});

				cb(true);

				await this.fetchLocations();
			} catch (err) {
				let errors = {
					"403": "A password introduzida não está correta. A cancelar a remoção...",
					"404": "Utilizador não encontrado. A cancelar a remoção...",
					"409_child": "Não foi possível remover as localizações porque alguma ainda contém sub-localizações!",
					"409_item": "Não foi possível remover as localizações porque alguma é referenciada por um item!",
					default: "Ocorreu um erro durante a remoção das localizações. Por favor, volte a tentar dentro de instantes...",
				};

				this.flashMessage.error({
					title: "Remoção de localizações falhada",
					message:
						errors[
							[403, 404, 409].includes(err.response.status)
								? err.response.status + (["child", "item"].includes(err.response.data) ? "_" + err.response.data : "")
								: "default"
						],
				});

				cb(false);
			}
		},

		async removeAllLocations(data, cb) {
			try {
				await api.delete("/locations/all", { data });

				this.flashMessage.success({
					title: "Remoção de localizações concluída",
					message: "As localizações foram removidas com sucesso!",
				});

				this.locations = [];
			} catch (err) {
				let errors = {
					"403": "A password introduzida não está correta. A cancelar a remoção...",
					"404": "Utilizador não encontrado. A cancelar a remoção...",
					"409": "Não foi possível remover as localizações porque alguma é referenciada por um item!",
					default: "Ocorreu um erro durante a remoção das localizações. Por favor, volte a tentar dentro de instantes...",
				};

				this.flashMessage.error({
					title: "Remoção de localizações falhada",
					message: errors[[403, 404, 409].includes(err.response.status) ? err.response.status + "" : "default"],
				});
			}

			cb();
		},

		async importLocationsExcel(data, cb) {
			try {
				await api.post("/locations/import", data, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				this.flashMessage.success({
					title: "Importação de localizações concluída",
					message: "As localizações foram importadas com sucesso!",
				});

				cb();

				await this.fetchLocations();
			} catch (err) {
				this.flashMessage.error({
					title: "Importação de localizações falhada",
					message: err.response.data,
				});

				cb();
			}
		},

		async exportLocationsExcel(cb) {
			try {
				const response = await api.get("/locations/export?name=locations", { responseType: "blob" });
				FileSaver.saveAs(response.data, `locations.xlsx`);
			} catch {
				this.flashMessage.error({
					title: "Exportação de localizações falhada",
					message: "Ocorreu um erro durante a exportação das localizações. Por favor, volte a tentar dentro de instantes...",
				});
			}

			cb();
		},
	},

	async created() {
		await this.fetchLocations();
	},
};
</script>
