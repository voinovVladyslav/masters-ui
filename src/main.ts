import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import registerVuetify from './plugins/vuetify'
import 'vuetify/styles'

const app = createApp(App)

registerVuetify(app)
app.use(createPinia())
app.use(router)

app.mount('#app')
