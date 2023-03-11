<template>
	<v-container fluid class="pa-0">
		<v-data-table
			class="userlist elevation-10"
			fixed-header
			loading-text="A carregar... Aguarde por favor"
			no-data-text="Nenhuma requisição encontrada"
			item-key="id"
			locale="pt-PT"
			sort-by="name"
			:headers="headers"
			:items="items"
			:search="searchQuery"
			:loading="loading"
			:footer-props="{
				'items-per-page-text': 'Requisições por página:',
				'items-per-page-options': [20, 50, 100, -1],
				'items-per-page-all-text': 'Todos',
				'show-first-last-page': true,
				'show-current-page': true,
				'page-text': '',
			}"
		></v-data-table>
	</v-container>
</template>

<script>
export default {
	name: "itemHistory",
	props: {
		searchQuery: {
			type: String,
			default: "",
		},
		requests: {
			type: Array,
			default: () => [],
		},
		loading: {
			type: Boolean,
			default: true,
		},
		showRequestedQnt: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			defaultImage:
				"data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJ1c2VyIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0OCA1MTIiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS11c2VyIGZhLXctMTQgZmEtN3giPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTMxMy42IDMwNGMtMjguNyAwLTQyLjUgMTYtODkuNiAxNi00Ny4xIDAtNjAuOC0xNi04OS42LTE2QzYwLjIgMzA0IDAgMzY0LjIgMCA0MzguNFY0NjRjMCAyNi41IDIxLjUgNDggNDggNDhoMzUyYzI2LjUgMCA0OC0yMS41IDQ4LTQ4di0yNS42YzAtNzQuMi02MC4yLTEzNC40LTEzNC40LTEzNC40ek00MDAgNDY0SDQ4di0yNS42YzAtNDcuNiAzOC44LTg2LjQgODYuNC04Ni40IDE0LjYgMCAzOC4zIDE2IDg5LjYgMTYgNTEuNyAwIDc0LjktMTYgODkuNi0xNiA0Ny42IDAgODYuNCAzOC44IDg2LjQgODYuNFY0NjR6TTIyNCAyODhjNzkuNSAwIDE0NC02NC41IDE0NC0xNDRTMzAzLjUgMCAyMjQgMCA4MCA2NC41IDgwIDE0NHM2NC41IDE0NCAxNDQgMTQ0em0wLTI0MGM1Mi45IDAgOTYgNDMuMSA5NiA5NnMtNDMuMSA5Ni05NiA5Ni05Ni00My4xLTk2LTk2IDQzLjEtOTYgOTYtOTZ6IiBjbGFzcz0iIj48L3BhdGg+PC9zdmc+",
			headers: [
				{
					text: "Nome",
					value: "name",
					align: "center",
					sortable: false,
					groupable: true,
				},
				{
					text: "Projeto",
					value: "project",
					align: "center",
					sortable: false,
					groupable: true,
				},
				{
					text: "Quantidade",
					value: "quantidade",
					align: "center",
					sortable: false,
					filterable: false,
					groupable: false,
				},
				{
					text: "Data",
					value: "data",
					align: "center",
					sortable: false,
					filterable: false,
					groupable: false,
				},
				{
					text: "Tipo",
					value: "type",
					align: "center",
					sortable: false,
					filterable: false,
					groupable: false,
				},
			],
		};
	},

	computed: {
		// ayo pierre
		items() {
			return this.requests.map((item) => {
				// hack para ficar bacano kinda bleh
				const date = item.date.substr(0, item.date.length - 5).split("T");

				return {
					name: item.name,
					item: item.item,
					project: item.project,
					quantidade: Math.abs(item.quantity),
					data: date[1] + " " + date[0],
					type: item.quantity > 0 ? "Requesitado" : "Devolvido",
				};
			});
		},
	},
};
</script>

<style scoped lang="scss">
.userlist {
	margin-top: 5%;
	border-radius: 25px;
	position: relative;
}
</style>

<style lang="scss">
.userlist {
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
		}

		.userlist_entry_self {
			background-color: #d8eef0;
		}

		tr:nth-of-type(odd):not(.userlist_entry_self):not(.v-data-table__empty-wrapper) {
			background-color: #f5f5f5;
		}

		tr:not(.v-data-table__empty-wrapper):hover {
			background-color: #137b89 !important;
			color: white;

			.color-chip {
				&.user {
					background-color: #f5f5f5 !important;
					color: #137b89 !important;
					font-weight: bold;
					font-size: 16px;
				}
			}

			.userlist_actionbtn {
				color: white !important;
			}

			.profile_image {
				filter: invert(1);
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
