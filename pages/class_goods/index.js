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
    checked: false,
    cpage: 1,
    searchWords: '',
    nomore: false
  },
  goodsSelect(e){
    let index = e.currentTarget.dataset.index
    let checked = this.data.list[index].checked == 1 ? 0 : 1;
    this.setData({
      ['list['+ index +'].checked']: checked
    })
  },
  onLoad(){
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
              let dataList = [];

              data.forEach(e=>{
                dataList.push({
                  goods_id: e.goods_id,
                  goods_name: e.goods_name,
                  goods_cover: e.goods_cover,
                  checked: 0,
                  store_cat_id: 2
                })
              })

                this.setData({
                    list: this.data.list.concat(res.data.data.goodslist),
                    loading: false
                });

                if(dataList.length == 0) this.setData({nomore: true})
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
