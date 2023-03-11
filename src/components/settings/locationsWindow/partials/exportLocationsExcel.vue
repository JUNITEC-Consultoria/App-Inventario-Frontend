<template>
	<v-container fluid class="ma-0 pa-0">
		<v-row class="subtitle">
			<h4>Exportação de localizações</h4>
		</v-row>
		<v-row>
			<v-col class="separators_container--padding">
				<!-- Descrição da área de exportação -->
				<v-row class="separator mt-0">
					<p class="infoText">
						Exportar todas as localizações num ficheiro excel. O ficheiro tem um formato tal que permite voltar as localizações
						existentes no mesmo caso tal seja necessário.
					</p>
				</v-row>

				<!-- Area de importação -->
				<v-row class="separator">
					<!-- Botão para proceder à exportação das localizações num ficheiro excel -->
					<v-btn color="primary" :loading="loadingExcelExport" class="mt-2" @click="exportExcel">
						Exportar
					</v-btn>
				</v-row>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "ExportLocationsExcel",
	data() {
		return {
			loadingExcelExport: false,
		};
	},
	methods: {
		async exportExcel() {
			this.loadingExcelExport = true;

			this.$emit("exportExcel", () => (this.loadingExcelExport = false));
		},
	},
};
</script>
