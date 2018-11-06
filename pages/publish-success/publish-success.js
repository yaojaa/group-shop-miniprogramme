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

          /**
     * 用户点击右上角分享
     */
   onShareAppMessage: function() {
        return {
            title: app.globalData.userInfo.nickname + '刚刚开了一个团👍快来看看',
            imageUrl: this.data.imagePath,
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id
            }
        },
  onImgOk(e) {
        this.setData({
            imagePath: e.detail.path
        })
    },
   onImgErr(){
        wx.showToast({ title: "没有成功，以后再说吧" })

        wx.redirectTo({
        url:'../goods/goods?goods_id='+this.data.goods_id
     })
    },

  viewGoods:function(){

    wx.navigateTo({
            url: '../goods/goods?goods_id='+this.data.goods_id
     })
              
  }
})
