<template>
	<v-container fluid class="users_container">
		<v-row align="center">
			<v-col>
				<v-row align="center" justify="center">
					<v-col class="users_searchbar_container pt-0 pb-6">
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
												<span class="headline ml-3 mt-3">Upload excel de utilizadores</span>
											</v-card-title>
											<v-card-text>
												<v-container>
													<v-row>
														<v-col>
															<v-file-input
																:accept="excelMimeTypes"
																label="Ficheiro de utilizadores"
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
									clearable
									autofocus
									hide-details
									v-model="searchQuery"
									placeholder="Pesquisar por nome ou projeto"
								>
									<font-awesome-icon :icon="['fas', 'search']" slot="prepend-inner" />
								</v-text-field>
							</v-col>
							<v-col style="min-width: 54px; max-width: 54px; margin-left: 12px; margin-top: 1px" class="pl-0">
								<AddUserDialog v-if="isAdmin" :availableProjects="availableProjects" @newUser="appendUserToTable" />
							</v-col>
						</v-row>
					</v-col>
				</v-row>
				<v-row align="center">
					<UsersList :users="users" :loading="loading" :searchQuery="searchQuery" style="width: 80%" />
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<style scoped lang="scss">
.users_searchbar_container {
	max-width: 50%;

	.searchbar_icon {
		background-color: #fff;
		color: #3486d7 !important;
		height: 54px;
		width: 54px;
	}
}
</style>

<script>
import api from "../services/api";
import UsersList from "@/components/usersTable.vue";
import AddUserDialog from "@/components/addUserDialog.vue";

export default {
	name: "Users",
	components: {
		UsersList,
		AddUserDialog,
	},
	data() {
		return {
			users: [],
			searchQuery: "",
			loading: true,
			availableProjects: [],
			showExcelDialog: false,
			isValidExcel: false,
			newExcelFile: null,
			loadingExcel: false,
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
			},
		};
	},
	methods: {
		getUsers() {
			api.get(`/users`)
				.then((res) => {
					this.users = res.data.list;
					this.availableProjects = res.data.projects;

					this.users.forEach((user) => {
						user.type = user.isVirtual ? "Virtual" : user.isAdmin ? "Admin" : "Real";
					});
				})
				.catch((err) => {
					if (err.response.status !== 401) {
						this.flashMessage.error({
							title: "Não foi possível listar utilizadores",
							message: "Por favor tente mais tarde",
						});
					}
				})
				.finally(() => (this.loading = false));
		},

		appendUserToTable(data) {
			this.users.push(data);

			if (this.availableProjects.indexOf(data.project) == -1) this.availableProjects.push(data.project);
		},

		async submitExcelForm() {
			this.loadingExcel = true;

			try {
				let formData = new FormData();
				formData.append("excel", this.newExcelFile);
				await api.post("/users", formData, {
					headers: {
						"Content-Type": "multipart/form-data",
					},
				});

				this.newExcelFile = null;
				this.loadingExcel = false;
				this.showExcelDialog = false;

				this.flashMessage.success({
					title: "Importação de utilizadores concluída",
					message: "Os utilizadores foram importados com sucesso!",
				});
			} catch (err) {
				this.newExcelFile = null;
				this.loadingExcel = false;

				this.flashMessage.error({
					title: "Importação de utilizadores falhada",
					message: err.response.data,
				});

				return;
			}

			this.loading = true;

			this.getUsers();
		},
	},
	computed: {
		isAdmin() {
			return this.$store.getters.isAdmin;
		},
	},
	created() {
		this.getUsers();
	},
};
</script>
