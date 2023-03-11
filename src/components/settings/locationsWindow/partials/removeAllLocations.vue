<template>
	<v-container fluid class="ma-0 pa-0">
		<v-row class="subtitle">
			<h4>Apagar todas as localizações <font-awesome-icon color="#cc2836" :icon="['fas', 'exclamation-triangle']" /></h4>
		</v-row>
		<v-row>
			<v-col class="separators_container--padding">
				<!-- Descrição da área de remoção de todas as localizações -->
				<v-row class="separator mt-0">
					<p class="infoText">
						Apagar todas as localizações pode levar a problemas de funcionamento na aplicação. Efetue esta ação apenas se tiver
						a certeza. Ao clicar em 'APAGAR LOCALIZAÇÕES' assume a total responsabilidade pela ação efetuada.
					</p>
				</v-row>

				<!-- Area de remoção -->
				<v-row class="separator">
					<!-- Botão para ativar o modal e modal para apagar todas as localizações -->
					<v-dialog v-model="removeAllDialog" max-width="650">
						<!-- Botão para ativar o modal -->
						<template v-slot:activator="{ on, attrs }">
							<v-btn class="button--danger mt-2" style="font-size: 0.875rem !important;" v-bind="attrs" v-on="on">
								Apagar localizações
							</v-btn>
						</template>

						<!-- Modal para apagar todas as localizações -->
						<v-card>
							<v-card-title class="headline mb-1">
								Eliminar localizações
								<font-awesome-icon style="color: #cc2836" :icon="['fas', 'exclamation-triangle']" class="ml-3" />
							</v-card-title>

							<v-card-text style="font-size: 18px" class="mt-3">
								<p class="mb-2">Esta ação <strong>não poderá ser revertida</strong> posteriormente!</p>
								<p>Tem a certeza que deseja remover todas as localizações?</p>
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
								<v-btn text @click="removeAllDialog = false">
									Cancelar
								</v-btn>

								<!-- Botão para confirmar a remoção (apenas ativo se uma password for especificada) -->
								<v-btn
									rounded
									elevation="3"
									large
									class="button--danger pl-4 pr-4"
									@click="deleteAllLocations"
									:loading="loadingRemoveAll"
									:disabled="!password"
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
	name: "RemoveAllLocations",
	data() {
		return {
			password: "",
			removeAllDialog: false,
			passwordVisibility: false,
			loadingRemoveAll: false,
		};
	},
	methods: {
		async deleteAllLocations() {
			this.loadingRemoveAll = true;

			this.$emit("removeAll", { password: this.password }, () => {
				this.removeAllDialog = false;
				this.loadingRemoveAll = false;
			});
		},
	},
	watch: {
		removeAllDialog: function(val) {
			if (!val) {
				this.password = "";
				this.passwordVisibility = false;
			}
		},
	},
};
</script>
