//index.js

const app = getApp()

const util = require('../../utils/util.js')

import Dialog from '../../vant/dialog/dialog';

Page({
  data: {
    loading: true,
    list:[],
    loves: [],
    inputValue:'',
    show: false,
    alert: {}
  },
  onLoad(opt){
    console.log(opt)
    if(opt.name){
      this.setData({
        inputValue: opt.name
      })
    }
    if(opt.id){
      this.getList();
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
    if(this.closeAdd()) return;
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
    let i = e.currentTarget.dataset.index;
    Dialog.confirm({
      message: '确定删除？'
    })
    .then(() => {
      this.submitClass({
        cat_name: this.data.list[i].cat_name,
        cat_id: this.data.list[i].cat_id,
        enable: -1
      })
    });
  },
  // 修改分类
  edit(e){
    let i = e.currentTarget.dataset.index;
    this.setData({
      show: true,
      inputValue: this.data.list[i].cat_name,
      alert: {
        title: '修改分类',
        btn: '修改',
        id: this.data.list[i].cat_id
      }
    })
  },
  // 置顶分类
  up(e){
    let i = e.currentTarget.dataset.index;
    wx.showLoading()
    util.wx.post('/api/seller/cat_set_top', {
      cat_id: this.data.list[i].cat_id,
      cat_is_top: 1
    }).then((res) => {
        wx.hideLoading()
        console.log(res)
        if(res.data.code == 200){
          this.getList();
        }
      })
      .catch((e) => {
        wx.showToast({
          title: '网络繁忙',
          icon:'none'
        })
      })
  },
  // 添加想添加分类
  addLoveClass(e){
    if(this.closeAdd()) return;
    let i = e.currentTarget.dataset.index;
    this.submitClass({
      cat_name: this.data.loves[i].name,
      enable: 1
    });
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
      let data = {
        cat_name: this.data.inputValue,
        enable: 1
      };
      if(this.data.alert.id){
        data.cat_id = this.data.alert.id;
      }
      this.submitClass(data)
    }
  },
  submitClass(data){
    wx.showLoading()
    util.wx.post('/api/seller/cat_add_or_edit', data)
      .then((res) => {
        wx.hideLoading()
        console.log(res)
        if(res.data.code == 200){
          this.getList();
        }else{
          wx.showToast({
            title: this.data.alert.btn+'失败',
            icon:'none'
          })
        }
      })
      .catch((e) => {
        wx.showToast({
          title: this.data.alert.btn+'失败',
          icon:'none'
        })
      })
  },
  closeAdd(){
    if(this.data.list.length >= 150){
      Dialog.alert({
        message: '最多只能添加150个分类',
      }).then(() => {
        // on close
      });
      return true;
    }
  },
  getList(){
    util.wx.get('/api/seller/get_cat_list')
    .then((res) => {
      if(res.data.code == 200){
        res.data.data.cats = res.data.data.cats.filter(e => {return e.enable == 1})
        this.setData({
          loading: false,
          list: res.data.data.cats
        })
        this.data.loves = loveCopy.filter(e=>{
          let flag = true;
          this.data.list.forEach(c=>{
            if(e.name == c.cat_name){
              flag = false;
            }
          })
          return flag;
        })
        this.setData({
          loves: this.data.loves
        })
      }
    })
    .catch((e) => {

    })
  }
})
