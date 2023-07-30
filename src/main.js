import { createApp } from 'vue';
import App from './App.vue';
import VueKonva from 'vue-konva';


// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})



const app = createApp(App);
app.use(VueKonva);
app.use(vuetify);
app.mount('#app');


//createApp(App).use(vuetify).mount('#app')


