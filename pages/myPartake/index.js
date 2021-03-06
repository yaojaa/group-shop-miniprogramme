const app = getApp()
const util = require('../../utils/util.js')
const { $Message } = require('../../iView/base/index');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        orders: [],
        cpage:1,
        totalpage:1,
        loading:true,
        total:'--'
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
      this.getBuyList()
    },
    getBuyList: function() {

        return new Promise((reslove,reject)=>{

        this.data.loading = true

        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_list',
            data: {
                token: app.globalData.token,
                cpage:this.data.cpage,
                pagesize:10
            },
            success: (res) => {

                var resdata= []
                if (res.data.code == 0) {

                      if(this.data.cpage<=1){
                               resdata = res.data.data.order_list
                            }else{
                               resdata = this.data.orders.concat(res.data.data.order_list)
                       }


                    this.setData({
                        orders: resdata,
                        loading:false,
                        totalpage:res.data.data.page.totalpage,
                        total:res.data.data.page.total,
                    })
                }
            }
        })

      })
    },
    //取消订单

    cancel_order({ target }) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/cancel_order',
            method: 'POST',
            data: {
                token: app.globalData.token,
                order_id: target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Message({
                        content: '订单取消成功',
                        type: 'success'
                    })
                    this.getBuyList()
                }
            }
        })
    },

    //确认收货
    confirm_order({ target }) {

        wx.request({
            url: 'https://www.daohangwa.com/api/user/confirm_order',
            method: 'POST',
            data: {
                token: app.globalData.token,
                order_id: target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                    $Message({
                        content: '确认成功'
                    })
                    this.getBuyList()

                }
            }
        })



    },
    pay({ target }) {


        let order_id = target.dataset.id;
        let goods_id = target.dataset.goods_id;
        let wx_collection_code = target.dataset.wx_collection_code;



        let collection_methods =  target.dataset.collection_methods

        let index = target.dataset.idx;
        let _this = this;


        if(collection_methods==2){

        var src = wx_collection_code; //获取data-src
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: [src] // 需要预览的图片http链接列表
        })
        return
        }



        wx.login({
            success: res => {
                var code = res.code;
                wx.request({
                    url: 'https://www.daohangwa.com/api/pay/pay',
                    method: "POST",
                    data: {
                        order_id: order_id,
                        code: code,
                        token: app.globalData.token,

                    },
                    success: function(res) { //后端返回的数据 
                        var data = res.data.data;
                        console.log(data);
                        console.log(data["timeStamp"]);
                        wx.requestPayment({
                            timeStamp: data['timeStamp'],
                            nonceStr: data['nonceStr'],
                            package: data['package'],
                            signType: data['signType'],
                            paySign: data['paySign'],
                            success: function(res) {
                                console.log(res)

                                wx.request({
                                    url: 'https://www.daohangwa.com/api/pay/orderpay',
                                    data: {
                                        token: app.globalData.token,
                                        order_id: order_id
                                    }

                                })

                                wx.showLoading()



                                wx.redirectTo({
                                    url: '../paySuccess/index?order_id=' + order_id + '&goods_id=' + goods_id
                                })

                            },
                            fail: function(res) {
                                console.log("fail", res)
                            }

                        });
                    }
                })
            }
        })

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getBuyList()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
  },

   /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
        console.log('boottom',this.data.cpage,this.data.loading)
        if (this.data.cpage && !this.data.loading) {

            this.setData({
                cpage: this.data.cpage + 1,  //每次触发上拉事件，把requestPageNum+1
            })

            if(this.data.cpage>this.data.totalpage){
                return 
            }


             this.getBuyList().then(()=>{
               // 隐藏导航栏加载框
                wx.hideNavigationBarLoading();
                // 停止下拉动作
                wx.stopPullDownRefresh();
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})