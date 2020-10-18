//index.js

const app = getApp()

const util = require('../../utils/util.js')

import Dialog from '../../vant/dialog/dialog';

Page({
  data: {
    list:[{
      name: '水果'
    },{
      name: '蔬菜'
    },{
      name: '服装'
    },{
      name: '居家'
    },{
      name: '日用品'
    }],
    loves:[{
      name: '水果'
    },{
      name: '蔬菜'
    },{
      name: '零食'
    },{
      name: '鲜花'
    },{
      name: '肉蛋'
    },{
      name: '海鲜'
    },{
      name: '美妆'
    },{
      name: '服装'
    },{
      name: '居家'
    },{
      name: '日用品'
    }],
    inputValue:'',
    show: false,
    alert: {
      title: '添加新分类',
      btn: '添加'
    }
  },
  // 监听输入
  bindKeyInput: function (e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  // 添加分类
  addClass(e){
    console.log('1',e.currentTarget.dataset)
    this.setData({
      show: true,
      inputValue: '',
      alert: {
        title: '添加新分类',
        btn: '添加',
        id: ''
      }
    })
  },
  // 删除分类
  delete(e){
    console.log('2',e.currentTarget.dataset)
    Dialog.confirm({
      message: '确定删除？'
    })
    .then(() => {
      // on confirm
    })
    .catch(() => {
      // on cancel
    });
  },
  // 修改分类
  edit(e){
    let i = e.currentTarget.dataset.index;
    this.setData({
      show: true,
      inputValue: this.data.list[i].name,
      alert: {
        title: '修改分类',
        btn: '修改',
        id: this.data.list[i].id
      }
    })
  },
  // 置顶分类
  up(e){
    console.log('4',e.currentTarget.dataset)
  },
  // 添加想添加分类
  addLoveClass(e){
    console.log('5',e.currentTarget.dataset)
  },
  // 取消添加/修改
  cancel(){
    this.setData({
      show: false
    })
  },
  // 提交添加
  sure(){
    if(this.data.inputValue){
      this.setData({
        show: false
      })
      wx.showLoading()
      util.wx.post('/api/seller/cat_add_or_edit', {
        cat_name: this.data.inputValue,
      })
      .then((res) => {
        wx.hideLoading()
        console.log(res)



        wx.showToast({
          title: this.data.alert.btn+'失败',
          icon:'none'
        })

      })
      .catch((e) => {
        wx.showToast({
          title: this.data.alert.btn+'失败',
          icon:'none'
        })
      })
    }
  }
})
