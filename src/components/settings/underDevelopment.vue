<template>
	<v-container fluid pa-0>
		<v-row align="center" justify="center" style="margin-top: 17.5%">
			<v-col style="max-width: 200px" class="pa-0">
				<font-awesome-icon
					:icon="['fas', 'exclamation-triangle']"
					style="color: red; width: 200px; height: 200px; border: 1px solid red; border-radius: 25%; padding: 30px 40px 40px 40px"
				/>
			</v-col>
			<v-col cols="12" class="mt-3">
				<h2 style="text-align: center">Página atualmente em desenvolvimento!</h2>
			</v-col>
		</v-row>
	</v-container>
</template>

<script>
export default {
	name: "UnderDevelopment",
};
</script>
