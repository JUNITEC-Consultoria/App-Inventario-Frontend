<template>
	<v-container fluid class="pa-0">
		<v-data-table
			class="userlist elevation-10"
			fixed-header
			loading-text="A carregar... Aguarde por favor"
			no-data-text="Nenhum utilizador encontrado"
			no-results-text="Nenhum utilizador corresponde aos critérios definidos"
			item-key="id"
			locale="pt-PT"
			sort-by="name"
			:headers="headers"
			:items="users"
			:item-class="(item) => (item.self ? 'userlist_entry_self' : '')"
			:search="searchQuery"
			:custom-sort="customSort"
			:must-sort="true"
			:loading="loading"
			:footer-props="{
				'items-per-page-text': 'Utilizadores por página:',
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
					style="vertical-align:middle; margin:8px 0px"
					:src="item.image ? item.image : defaultImage"
					:class="item.image ? '' : 'profile_image'"
				>
					<template v-slot:placeholder>
						<v-row align="center" justify="center" class="fill-height">
							<v-progress-circular color="grey" indeterminate></v-progress-circular>
						</v-row>
					</template>
				</v-img>
			</template>

			<template v-slot:[`item.quantity`]="{ item }">
				<v-chip v-if="showRequestedQnt" color="#137b89" class="color-chip user" text-color="white" style="cursor: pointer">
					{{ item.quantity }}
				</v-chip>
			</template>

			<template v-slot:[`item.actions`]="{ item }">
				<v-tooltip top>
					<template v-slot:activator="{ on, attrs }">
						<v-btn v-bind="attrs" v-on="on" class="userlist_actionbtn font-size-inherit" icon @click="goto(item.id)">
							<v-icon large> mdi-clipboard-edit-outline </v-icon>
						</v-btn>
					</template>
					<span>Info pessoal</span>
				</v-tooltip>
			</template>
		</v-data-table>
	</v-container>
</template>

<script>
export default {
	name: "UsersTable",
	props: {
		users: {
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
		showRequestedQnt: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			defaultImage:
				"data:image/svg+xml;base64,PHN2ZyBhcmlhLWhpZGRlbj0idHJ1ZSIgZm9jdXNhYmxlPSJmYWxzZSIgZGF0YS1wcmVmaXg9ImZhciIgZGF0YS1pY29uPSJ1c2VyIiByb2xlPSJpbWciIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgdmlld0JveD0iMCAwIDQ0OCA1MTIiIGNsYXNzPSJzdmctaW5saW5lLS1mYSBmYS11c2VyIGZhLXctMTQgZmEtN3giPjxwYXRoIGZpbGw9ImN1cnJlbnRDb2xvciIgZD0iTTMxMy42IDMwNGMtMjguNyAwLTQyLjUgMTYtODkuNiAxNi00Ny4xIDAtNjAuOC0xNi04OS42LTE2QzYwLjIgMzA0IDAgMzY0LjIgMCA0MzguNFY0NjRjMCAyNi41IDIxLjUgNDggNDggNDhoMzUyYzI2LjUgMCA0OC0yMS41IDQ4LTQ4di0yNS42YzAtNzQuMi02MC4yLTEzNC40LTEzNC40LTEzNC40ek00MDAgNDY0SDQ4di0yNS42YzAtNDcuNiAzOC44LTg2LjQgODYuNC04Ni40IDE0LjYgMCAzOC4zIDE2IDg5LjYgMTYgNTEuNyAwIDc0LjktMTYgODkuNi0xNiA0Ny42IDAgODYuNCAzOC44IDg2LjQgODYuNFY0NjR6TTIyNCAyODhjNzkuNSAwIDE0NC02NC41IDE0NC0xNDRTMzAzLjUgMCAyMjQgMCA4MCA2NC41IDgwIDE0NHM2NC41IDE0NCAxNDQgMTQ0em0wLTI0MGM1Mi45IDAgOTYgNDMuMSA5NiA5NnMtNDMuMSA5Ni05NiA5Ni05Ni00My4xLTk2LTk2IDQzLjEtOTYgOTYtOTZ6IiBjbGFzcz0iIj48L3BhdGg+PC9zdmc+",
		};
	},
	methods: {
		goto(id) {
			this.$router.push("/user/" + id);
		},
		customSort(users, sortBy, sortDesc) {
			//sortDesc -> asc = false; desc = true
			function sort(a, b, fields) {
				if (a[fields[0]] != b[fields[0]]) {
					return a[fields[0]] < b[fields[0]] ? 1 : -1;
				} else if (a[fields[1]] != b[fields[1]]) {
					return a[fields[1]] < b[fields[1]] ? 1 : -1;
				} else if (a.id != b.id) {
					return a.id < b.id ? 1 : -1;
				} else {
					return 0;
				}
			}

			let sortFields = {
				name: ["name", "project", "type"],
				project: ["project", "name", "type"],
				type: ["type", "name", "project"],
			};

			users = users.sort((a, b) => {
				if (a.self) {
					return -1;
				} else if (b.self) {
					return 1;
				} else {
					return sort(a, b, sortFields[sortBy[0]]) * (sortDesc[0] ? 1 : -1);
				}
			});

			return users;
		},
	},
	computed: {
		headers() {
			let data = [
				{
					text: "Fotografia",
					value: "image",
					align: "center",
					sortable: false,
					filterable: false,
					groupable: false,
				},
				{
					text: "Nome",
					value: "name",
					align: "center",
					groupable: false,
				},
				{
					text: "Projeto",
					value: "project",
					align: "center",
				},
				{
					text: "Tipo",
					value: "type",
					align: "center",
				},
				{
					text: "Ações",
					value: "actions",
					align: "center",
					sortable: false,
					filterable: false,
					groupable: false,
				},
			];

			if (this.showRequestedQnt) {
				data.splice(2, 0, {
					text: "Quantidade",
					value: "quantity",
					align: "center",
					sortable: true,
				});
			}

			return data;
		},
	},
};
</script>

<style scoped lang="scss">
.userlist {
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
