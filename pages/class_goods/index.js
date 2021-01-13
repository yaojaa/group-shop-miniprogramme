//index.js

const app = getApp()

const util = require('../../utils/util.js')

import Dialog from '../../vant/dialog/dialog';

Page({
  data: {
    loading: true,
    list:[],
    show: false,
    alert: {},
    checked: false
  },
  onChange(){
    this.setData({
      checked: !this.data.checked
    })
  },
  onLoad(){

  },
})
