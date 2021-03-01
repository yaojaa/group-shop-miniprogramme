//index.js

const app = getApp()

const util = require('../../utils/util.js');

let class_list = []

import Dialog from '../../vant/dialog/dialog';

Page({
  data: {
    loading: true,
    list:[],
    show: false,
    alert: {},
    checked: false,
    cpage: 1,
    searchWords: '',
    nomore: false
  },
  goodsSelect(e){
    let index = e.currentTarget.dataset.index
    this.setData({
      ['list['+ index +'].checked']: !this.data.list[index].checked
    })
  },
  onLoad(){
    console.log(app.globalData.class_list)
    if(app.globalData.class_list){
      class_list = app.globalData.class_list;
      app.globalData.class_list = null;
    }
    this.getGoodsList();
  }, // 搜索
  onSearch(e) {
      var sv = e.detail.replace(/(^\s*)|(\s*$)/g, '');
      console.log(sv);
      if (sv) {
          this.data.cpage = 1;
          this.setData({
              searchWords: sv
          });
          this.getGoodsList();
      }
  },
  onCancel() {
      this.setData({
          searchWords: ''
      });
      this.data.cpage = 1;
      this.getGoodsList();
  },
  goBack(){
    wx.navigateBack()
  },
  goSave(){
    let selectGoods = [];
    this.data.list.forEach( e=> {
      if(e.checked){
        selectGoods.push(e)
      }

    })


    util.setParentData({
        ['list.goods']: selectGoods
    })
  },
  getGoodsList: function() {
    let ajaxData = {
        cpage: this.data.cpage,
        pagesize: 15
    };
    if(this.data.searchWords) ajaxData.keyword=this.data.searchWords
    if(ajaxData.cpage == 1){
      this.setData({
        nomore: false,
        list: []
      })
    }

    util.wx
        .get('/api/seller/get_goods_list', ajaxData)
        .then((res) => {
            if (res.data.code == 200) {
              let data = res.data.data.goodslist;
              data.forEach(e=>{
                let checkeds = class_list.filter(c => {
                  return e.goods_id == c.goods_id;
                })

                e.checked = checkeds.length > 0 ? true : false
              })

                this.setData({
                    list: this.data.list.concat(data),
                    loading: false
                });

                if(data.length == 0) this.setData({nomore: true})
            } else {
                this.setData({
                    loading: false
                });
            }
        })
        .catch((e) => {
          this.setData({
              loading: false
          });
        });
    },
    onReachBottom: function() {
      if(!this.data.nomore) this.data.cpage++;
      this.getGoodsList();
    },
})
