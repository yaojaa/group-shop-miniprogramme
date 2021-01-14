//index.js

const app = getApp()

const util = require('../../utils/util.js')

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
    this.data.list.forEach((e, i) => {
      data[i] = {
        full: e.full,
        reduce: e.reduce
      }
      if(e.fullreduce_id){
        data[i].fullreduce_id = e.fullreduce_id;
      }
    });
    // data = data.filter(e => {
    //   return e.full > 0.5 && e.reduce > 0.5;
    // })
    console.log(data)


    /*保存后清除app.globalData.fullreduce_data*/

    app.globalData.fullreduce_data = ''

    util.setParentData({
      fullreduce_data: data
    })


  },





















  

  



})
