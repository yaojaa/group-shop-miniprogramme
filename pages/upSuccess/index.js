// pages/paySuccess/index.js
const app = getApp()
const util = require('../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        info:{}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.data.goods_id = options.goods_id
        this.getGoodsInfo();

       

    },
 
    
    goback() {

        wx.redirectTo({
            url: '../home/index'
        })

    },
    toDetail(){

         wx.redirectTo({
            url: '../goods/goods?goods_id='+this.data.goods_id
        })


    },
    getGoodsInfo(){

          util.wx.get('/api/goods/get_goods_detail', {
                goods_id: this.data.goods_id 
            })
            .then(res => {

                this.setData({
                    info:res.data.data.goods
                })
              
            })
    },
    // addListener:util.userListner,
    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function(res) {

        this.setData({
            clickShare:true,
            onshare:true
        })



        let shareTitle = this.data.wordArr[this.data.create_number] || '大家再接再厉...' + this.data.goods_name
        let numberIcon = ''
        return {
            title: '',
            path: '/pages/goods/goods?goods_id=' + this.data.goods_id
        }
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    addListener:function () {
          wx.requestSubscribeMessage({
              tmplIds: ['17y_mLplxTn0resiR34oUsJMZu2E2W6i0x2YIRZgvZ4','Wu_vie78kgoRr8y90IAsxoEn87BJ3nDrEBLP0MK6208'],
              success (res) { }
            })
    }
})