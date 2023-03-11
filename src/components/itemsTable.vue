<template>
	<v-container fluid class="pa-0" style="margin-bottom: 24px">
		<v-data-table
			:class="'itemslist elevation-10 ' + cursorStyle"
			fixed-header
			multi-sort
			loading-text="A carregar... Aguarde por favor"
			no-data-text="Nenhum item encontrado"
			no-results-text="Nenhum item corresponde aos critérios definidos"
			item-key="id"
			locale="pt-PT"
			sort-by="name"
			:headers="headers"
			:items="items"
			:search="searchQuery"
			:custom-filter="costumFilter"
			:loading="loading"
			@click:row="(e) => goto(e._id, requisitado, 1)"
			:footer-props="{
				'items-per-page-text': 'Itens por página:',
				'items-per-page-options': [20, 50, 100, -1],
				'items-per-page-all-text': 'Todos',
				'show-first-last-page': true,
				'show-current-page': true,
				'page-text': '',
			}"
		>
			<template v-slot:[`item.image`]="{ item }">
				<v-img
					contain
					height="3.5em"
					aspect-ratio="1"
					style="vertical-align:middle;margin:8px 0px"
					:src="item.image ? item.image : defaultImage"
					:alt="item.name"
				>
					<template v-slot:placeholder>
						<v-row align="center" justify="center" class="fill-height">
							<v-progress-circular color="grey" indeterminate></v-progress-circular>
						</v-row>
					</template>
				</v-img>
			</template>

			<template v-slot:[`item.stock`]="{ item }">
				<v-chip v-if="!requisitado" :class="'color-chip' + getStyle(item.stock)">
					{{ item.stock.available }} / {{ item.stock.total }}
				</v-chip>
				<v-chip v-else color="#137b89" class="color-chip user" text-color="white" style="cursor: pointer">
					{{ item.quantity }}
				</v-chip>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-row
					@click.stop="
						() => {
							return;
						}
					"
					style="cursor: default !important;"
					justify="center"
				>
					<template v-if="!requisitado">
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									v-on="on"
									class="actionbtn font-size-inherit ml-2 mr-3"
									icon
									@click.stop="requestItem(item._id, item.stock.available, item.name)"
								>
									<v-icon large> mdi-basket-plus </v-icon>
								</v-btn>
							</template>
							<span>Requisitar</span>
						</v-tooltip>

						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									v-on="on"
									class="actionbtn font-size-inherit ml-3 mr-2"
									icon
									@click.stop="goto(item._id, requisitado, 0)"
								>
									<v-icon large> mdi-clipboard-edit-outline </v-icon>
								</v-btn>
							</template>
							<span>Info Item</span>
						</v-tooltip>
					</template>

					<template v-if="requisitado">
						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									v-on="on"
									class="actionbtn font-size-inherit ml-2 mr-2"
									icon
									@click.stop="changeRequestItem(item._id, item.stock.available, item.name, item.quantity)"
								>
									<v-icon large> mdi-pencil </v-icon>
								</v-btn>
							</template>
							<span>Alterar Requisição</span>
						</v-tooltip>

						<v-tooltip top>
							<template v-slot:activator="{ on, attrs }">
								<v-btn
									v-bind="attrs"
									v-on="on"
									class="actionbtn font-size-inherit ml-2 mr-2"
									icon
									@click.stop="derequestItem(item._id, item.name, item.quantity)"
								>
									<v-icon large> mdi-delete </v-icon>
								</v-btn>
							</template>
							<span>Desrequisitar</span>
						</v-tooltip>
					</template>
				</v-row>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
export default {
	name: "ItemsTable",
	props: {
		requisitado: {
			type: Boolean,
			default: false,
		},
		items: {
			type: Array,
			default: () => [],
		},
		searchQuery: {
			type: String,
			default: "",
		},
		loading: {
			type: Boolean,
			default: true,
		},
		locationSearch: {
			type: Boolean,
			default: false,
		},
		isAdmin: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			defaultImage:
				"data:image/png;base64,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",
		};
	},
	methods: {
		goto(id, requisitado, row) {
			if (!row || (row && requisitado)) this.$router.push("/item/" + id);
		},

		getStyle(stock) {
			if (stock.countable) {
				if (stock.total == 0 && stock.available == 0) return "--red";
				else if (stock.total > 0 && stock.available == 0) return "--yellow";
				else return "--green";
			} else {
				if (stock.total === "N/A") return "--red";
				//CASO total= N/A available = N/A (dessincronizações)
				else if (stock.total === "Disp." && stock.available === "N/A") return "--yellow";
				else return "--green";
			}
		},

		requestItem(id, availableStock, name) {
			//CHANGEEEEEEEEe
			this.$emit("requestItem", id, Number(availableStock), name); //TIREI Number
		},

		derequestItem(id, name, currentVal) {
			this.$emit("derequestItem", id, name, Number(currentVal));
		},

		changeRequestItem(id, availableStock, name, currentVal) {
			this.$emit("changeRequestItem", id, Number(availableStock), name, Number(currentVal));
		},

		costumFilter(value, search, item) {
			if (this.locationSearch) {
				return (
					search != null &&
					item.location
						.toString()
						.toLocaleLowerCase()
						.indexOf(search.toString().toLocaleLowerCase()) != -1
				);
			} else {
				return (
					search != null &&
					(item.location
						.toString()
						.toLocaleLowerCase()
						.indexOf(search.toString().toLocaleLowerCase()) != -1 ||
						item.name
							.toString()
							.toLocaleLowerCase()
							.indexOf(search.toString().toLocaleLowerCase()) != -1)
				);
			}
		},
	},
	computed: {
		personalId() {
			return this.$store.getters.id;
		},
		headers() {
			let ver = this.personalId == this.$route.params.id || this.$route.name != "user" || this.isAdmin;

			let data = [
				{ text: "Imagem", value: "image", sortable: false, filterable: false, align: "center", width: "15%" },
				{ text: "Nome", align: this.requisitado ? "center" : "start", value: "name", width: "35%" },
				{ text: "Localização", value: "location", width: `${ver ? "25%" : "30%"}` },
				{
					text: this.requisitado ? "Requisitados" : "Stock",
					value: "stock",
					sortable: false,
					filterable: false,
					align: "center",
				},
			];

			if (ver) {
				data.push({ text: "Ações", sortable: false, filterable: false, value: "actions", width: "150px", align: "center" });
			}

			return data;
		},
		cursorStyle() {
			if (this.requisitado) return "cursor";
			else return "";
		},
	},
};
</script>

<style scoped lang="scss">
.itemslist {
	border-radius: 25px;
	position: relative;
}
</style>

<style lang="scss">
.itemslist {
	&.cursor {
		tbody {
			cursor: pointer;
		}
	}

	thead tr {
		th {
			background: none !important;
			font-size: 18px !important;
			padding: 14px 16px !important;
		}

		&.v-data-table__progress {
			th {
				padding: 0 16px !important;
			}
		}
	}

	tbody {
		td {
			font-size: 18px !important;

			.userlist_actionbtn {
				font-size: 25px !important;
			}
		}

		.color-chip {
			justify-content: center;
			width: 60%;
			min-width: 110px;
			font-weight: bolder;
			font-size: 16px !important;

			&--green {
				@extend .color-chip;
				background-color: #53b25744 !important;
				color: #217425;
			}

			&--yellow {
				@extend .color-chip;
				background-color: #edd41d44 !important;
				color: #e08a07;
			}

			&--red {
				@extend .color-chip;
				background-color: #f44a3e44 !important;
				color: #e01515;
			}
		}

		tr:nth-of-type(odd):not(.v-data-table__empty-wrapper) {
			background-color: #f5f5f5 !important;
		}

		tr:not(.v-data-table__empty-wrapper):hover {
			background-color: #137b89 !important;
			color: white;

			.color-chip {
				&--green {
					@extend .color-chip;
					background-color: #53b257 !important;
					color: #ffffff;
				}

				&--yellow {
					@extend .color-chip;
					background-color: #edd41d !important;
					color: #ffffff;
				}

				&--red {
					@extend .color-chip;
					background-color: #f44a3e !important;
					color: #ffffff;
				}

				&.user {
					background-color: #f5f5f5 !important;
					color: #137b89 !important;
					font-weight: bold;
					font-size: 16px;
				}
			}

			.actionbtn {
				color: white !important;
			}
		}
	}

	.v-data-footer {
		font-size: 15px !important;

		.v-select__selection {
			font-size: 15px !important;
		}
	}
}
</style>
