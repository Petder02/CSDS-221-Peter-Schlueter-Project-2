import Vue from "vue";
import App from "./App.vue";
import Vuetify from "vuetify";
import "material-icons/iconfont/material-icons.css";
import "vuetify/dist/vuetify.min.css";
import VueToastr from "vue-toastr";

Vue.use(VueToastr, {
  defaultTimeout: 5000,
  defaultPosition: "toast-bottom-right",
  defaultCloseonHover: false
});

const opts = {
  icons: {
    iconfont: "mdi"
  }
};
Vue.use(Vuetify);

new Vue({
  vuetify: new Vuetify(opts),
  render: (h) => h(App)
}).$mount("#app");
