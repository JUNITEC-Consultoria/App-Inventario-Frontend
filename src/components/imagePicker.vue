<!-- 
Para por o upload da imagem a funcionar basta descomentar 
os elementos ou passar para dentro os que estão na linha
-->

<template>
  <v-col cols="auto" class="d-flex flex-column justify-center align-center">
    <!-- <v-tooltip right> -->
      <template> <!-- v-slot:activator="{ on, attrs }" -->
        <div class="imagepicker_container"><!-- v-on="on" v-bind="attrs" @click="$refs.fileinput.click()" -->
          <v-img :src="value || defaultImage" contain :aspect-ratio="1" width="5em">
            <template v-slot:placeholder>
              <v-row align="center" justify="center" class="fill-height">
                <v-progress-circular color="grey" indeterminate></v-progress-circular>
              </v-row>
            </template>
          </v-img>
          <span class="d-flex justify-center align-center"><font-awesome-icon :icon="['fas', 'upload']"/></span>
        </div>
      </template>
      <!-- <span>Alterar Imagem</span> -->
    <!-- </v-tooltip> -->
    <v-btn x-small text outlined class="mt-1" color="red" @click="clearImage" :style="value ? '' : 'visibility: hidden;'">
      Apagar
    </v-btn>
    <!-- <input ref="fileinput" class="imagepicker d-none" type="file" accept="image/*" @change="readImage" /> -->
  </v-col>
</template>

<style scoped lang="scss">
.imagepicker_container {
  transition: all 0.3s ease;
  //cursor: pointer;
  border-radius: 10%;
  overflow: hidden;
  margin-top: -5px;

  span {
    opacity: 0;
    position: absolute;
    top: 0;
    width: 5em;
    height: 5em;

    svg {
      width: 40%;
      height: 40%;
      color: white;
    }
  }

  /*&:hover {
    transform: scale(1.05);

    span {
      opacity: 0.8;
      background-color: #222;
    }
  }*/
}
</style>

<script>
export default {
  name: "ImagePicker",
  props: ["defaultImage", "value"],
  methods: {
    readImage(event) {
      let vm = this;
      let file;
      if (event.target.files && event.target.files.length === 1 && (file = event.target.files[0])) {
        let reader = new FileReader();
        reader.onload = function(e) {
          vm.$emit("input", e.target.result);
        };
        reader.readAsDataURL(file);
      }
    },
    clearImage() {
      this.$emit("input", null);
    },
  },
};
</script>
