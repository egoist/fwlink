import Vue from 'vue'
import VueRouter from 'vue-router'
import routes from './routes'
import app from './app'

Vue.use(VueRouter)

const router = new VueRouter({
  history: true
})
router.map(routes)

router.start(app, 'app')
