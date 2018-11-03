const app = getApp()
const util = require('../../utils/util')



Page({
  data: {
    imagePath: '',
    goods_id:''
  },
  onLoad:function(options){

     util.get_painter_data_and_draw.call(this,options.goods_id)
     this.data.goods_id =options.goods_id
   
  },
    onImgOk(e) {

        console.log('成功后返回的', e.detail.path)
        this.setData({
            imagePath: e.detail.path
        })

    },
  viewGoods:function(){

    wx.navigateTo({
            url: '../goods/goods?goods_id='+this.data.goods_id
     })
              
  }
})
