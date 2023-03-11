<template>
	<v-container fluid class="ma-0 pa-0">
		<v-row class="subtitle">
			<h4>Importação de localizações</h4>
		</v-row>
		<v-row>
			<v-col class="separators_container--padding">
				<!-- Descrição da área de importação -->
				<v-row class="separator mt-0">
					<p class="infoText">
						A importação de um excel não pode ser revertida. Efetue esta ação apenas se tiver a certeza de que o excel que
						pretende importar está correto. Ao clicar em 'IMPORTAR' assume a total responsabilidade pela ação efetuada.
					</p>
				</v-row>

				<!-- Area de importação -->
				<v-row class="separator">
					<v-form v-model="isValidExcel">
						<!-- Campo para fazer upload do excel -->
						<v-file-input
							:accept="excelmimetypes"
							label="Ficheiro de localizações"
							v-model="newExcelFile"
							:rules="rules.excel"
							class="mt-0"
						></v-file-input>
						<!-- Botão para proceder à importação das localizações (apenas ativo se o ficheiro for do tipo excel) -->
						<v-btn
							color="primary"
							:loading="loadingExcelImport"
							:disabled="!isValidExcel || !newExcelFile"
							class="mt-2"
							@click="submitExcelForm"
						>
							Importar
						</v-btn>
					</v-form>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "ImportLocationsExcel",
	data() {
		return {
			isValidExcel: false,
			newExcelFile: null,
			loadingExcelImport: false,
			excelmimetypes: [
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
							return this.excelmimetypes.includes(val ? val.type : "")
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
		async submitExcelForm() {
			this.loadingExcelImport = true;

			let formData = new FormData();
			formData.append("excel", this.newExcelFile);

			this.$emit("importExcel", formData, () => {
				this.newExcelFile = null;
				this.loadingExcelImport = false;
			});
		},
	},
};
</script>
