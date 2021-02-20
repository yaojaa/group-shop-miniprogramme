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
    cpage: 1
  },
  onChange(){
    this.setData({
      checked: !this.data.checked
    })
  },
  onLoad(){
    this.getGoodsList();
  },    
  getGoodsList: function() {
    let ajaxData = {
        cpage: this.data.cpage,
        pagesize: 10
    };

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
      this.data.cpage++;
      this.getGoodsList();
    },
})
