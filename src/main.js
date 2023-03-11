import Vue from "vue";
import App from "@/App.vue";

//inicializacao
import GAuth from 'vue-google-oauth2'
const gauthOption = {
  clientId: '970575657381-1dtvfi39r4t51oth4aj67fufbn2638pf.apps.googleusercontent.com',
  //scope: 'profile email',
  //prompt: 'select_account'
}
Vue.use(GAuth, gauthOption)


//routing
import router from "@/router.js";

//Vuex store
import store from "@/store.js";

//vuetify
import Vuetify from "vuetify";
import "vuetify/dist/vuetify.min.css";
Vue.use(Vuetify);

//Flash messages
import FlashMessage from "@smartweb/vue-flash-message";
Vue.use(FlashMessage, { strategy: "multiple" });

//fontawesome icons
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

//
import { faGoogle } from "@fortawesome/free-brands-svg-icons"; //fab



import {
	faKey,
	faEye,
	faEyeSlash,
	faSearch,
	faSignOutAlt,
	faUsers,
	faPlus,
	faHome,
	faWrench,
	faTimes,
	faUpload,
	faSave,
	faInfoCircle,
	faExclamationTriangle,
	faTrash,
	faCog,
	faLink,
	faCircleNotch,
	faBars,
} from "@fortawesome/free-solid-svg-icons"; //fas
import { faUser, faEdit, faFileExcel } from "@fortawesome/free-regular-svg-icons"; //far

Vue.component("font-awesome-icon", FontAwesomeIcon);
library.add(
	faUser,
	faKey,
	faEye,
	faEyeSlash,
	faEdit,
	faSearch,
	faSignOutAlt,
	faUsers,
	faPlus,
	faHome,
	faWrench,
	faTimes,
	faUpload,
	faSave,
	faTrash,
	faInfoCircle,
	faExclamationTriangle,
	faFileExcel,
	faCog,
	faLink,
	faCircleNotch,
	faBars,
	faGoogle
);

//mdi icons
import "@mdi/font/css/materialdesignicons.css";

//Create Vue Instance
Vue.config.productionTip = false;

new Vue({
	store,
	router,
	vuetify: new Vuetify(),
	render: (h) => h(App),
}).$mount("#app");
