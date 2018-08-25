import Vue from 'vue'
import App from './index'
const app = new Vue(App)
app.$mount()

export default {
	config:{
		"usingComponents": {
          "i-card": "../../../static/iView/card/index",
            "i-button": "../../../static/iView/button/index"
       }
	}
}
