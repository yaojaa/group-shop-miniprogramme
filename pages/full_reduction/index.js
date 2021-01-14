//index.js

const app = getApp()

const util = require('../../utils/util.js');

import Toast from '../../vant/toast/toast';

Page({
  data: {
    id: "",
    list: [
      {
        fullreduce_id: '',
        full: '',
        reduce: ''
      }
    ]

  },
  onLoad(){
    let data = app.globalData.fullreduce_data
    console.log(app.globalData.fullreduce_data)
    if(data && data.length > 0){
      this.setData({
        list: data
      })
    }
  },
  // 添加满减
  addCell(e){
    if(!this.verification()){
      return;
    }
    this.data.list.push({
      fullreduce_id: '',
      full: '',
      reduce: ''
    })
    this.setData({
      list: this.data.list
    })
  },
  delectCell(e){
    let i = e.currentTarget.dataset.index;
    this.data.list.splice(i,1);
    this.setData({
      list: this.data.list
    })
  },
  // 监听输入
  inputFull: function (e) {
    let i = e.currentTarget.dataset.index;
    this.setData({
      ['list['+ i +'].full']: e.detail.value
    })
  },
  // 监听输入
  inputReduce: function (e) {
    let i = e.currentTarget.dataset.index;
    this.setData({
      ['list['+ i +'].reduce']: e.detail.value
    })
  },
  // 保存满减
  saveFullReduce(){
    let data = [];
    if(!this.verification()){
      return;
    }
    this.data.list.forEach((e, i) => {
      data[i] = {
        full: e.full,
        reduce: e.reduce
      }
      if(e.fullreduce_id){
        data[i].fullreduce_id = e.fullreduce_id;
      }
    });

    /*保存后清除app.globalData.fullreduce_data*/

    app.globalData.fullreduce_data = ''

    util.setParentData({
      fullreduce_data: data
    })


  },
  // 验证信息
  verification(){
    let data = this.data.list;
    let priceReg = /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/;
    for(var i=0; i<data.length; i++){
      if(!data[i].full){
        Toast('第'+ (i+1) +'行满金额不能为空');
        return false;
      }else if(data[i].full <= 0.5){
        Toast('第'+ (i+1) +'行满金额不能小于0.5');
        return false;
      }else if(!priceReg.test(data[i].full)){
        Toast('第'+ (i+1) +'行满金额要求整数或保留两位小数')
        return false;
      }
      if(!data[i].reduce){
        Toast('第'+ (i+1) +'行减金额不能为空');
        return false;
      }else if(data[i].reduce <= 0.5){
        Toast('第'+ (i+1) +'行减金额不能小于0.5');
        return false;
      }else if(!priceReg.test(data[i].reduce)){
        Toast('第'+ (i+1) +'行减金额要求整数或保留两位小数')
        return false;
      }
      if(parseFloat(data[i].full) <= parseFloat(data[i].reduce)){
        Toast('第'+ (i+1) +'行满金额必须大于减金额')
        return false;
      }
    }
    for(var i=0; i<data.length; i++){
      var v = data[i];
      for(var j=i+1; j<data.length; j++){
        var v2 = data[j];
        if(parseFloat(v.full) == parseFloat(v2.full)){
          Toast('第'+(j+1)+'行满金额重复了');
          return false;
        }
        if(parseFloat(v2.full) > parseFloat(v.full) && parseFloat(v2.reduce) <= parseFloat(v.reduce)){
          Toast('第'+(j+1)+'行高门槛金额必须大于第'+(i+1)+'行低门槛金额')
          return false;
        }
      }
    }

    return true;
  },

})