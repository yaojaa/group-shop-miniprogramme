//index.js

const app = getApp()

const util = require('../../utils/util.js')

import Dialog from '../../vant/dialog/dialog';

let date = new Date()

Page({
  data: {
    loading: true,
    list:[],
    date: date.getFullYear()+'-'+(date.getMonth()+1),
    total: 0
  },
  onLoad(opt){
    if(opt.date){
      this.setData({
        date: opt.date
      })
    }
    this.getList();
  },
  selectDate(e){
    this.setData({
      date: e.detail.value
    })
    this.getList();
  },
  getList(){
    util.wx.get('/api/seller/income_records?ymonth='+this.data.date)
    .then((res) => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          loading: false,
          list: res.data.data.goods,
          total: res.data.data.total || 0
        })
      }
    })
    .catch((e) => {

    })
  }
})
