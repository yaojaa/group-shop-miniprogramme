const app = getApp()


const util = require('../../utils/util.js')
const { $Message } = require('../../iView/base/index');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        order_number:0,
        goods_number:0,
        store_money:0,
      goodslist: [],
      painterData: {},
      goods_id: "",
      order_id: "",
      link_url:"",
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        if(app.globalData.userInfo){

         this.setData({
            userInfo: app.globalData.userInfo
            })

         let token = app.globalData.userInfo.token

         this.getGoodsList(token)

         this.getBuyList(token)

         this.get_store_info(token)


        }else{

        app.userLoginReadyCallback=(userInfo)=>{
             this.setData({
             userInfo: userInfo
           })
         this.getGoodsList(userInfo.token)
         this.getBuyList(app.globalData.userInfo.token)

        }


        }


        if(typeof app.globalData.token == 'undefined' || app.globalData.token ==null ){
          app.redirectToLogin()
        }




       
    },
    

    get_store_info(token){

        wx.request({
            url: 'https://www.daohangwa.com/api/seller/get_store_info',
            data: {
                token: token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        store_money: res.data.data.store_money
                    })
                }
            }
        })

        

    },
    getGoodsList:function(token){
        console.log(app.globalData.token)
        wx.request({
            url: 'https://www.daohangwa.com/api/seller/get_goods_list',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        goodslist: res.data.data.goodslist,
                        goods_number:res.data.data.goodslist.length
                    })
                }
            }
        })
    },

    getBuyList:function(token){

        wx.request({
            url: 'https://www.daohangwa.com/api/user/get_order_list',
            data: {
                token: app.globalData.token
            },
            success: (res) => {
                if (res.data.code == 0) {
                    this.setData({
                        order_number:res.data.data.order_list.length,
                        orders: res.data.data.order_list

                    })
                }
            }
        })
    },

    //取消订单
    
       cancel_order({target}){

          wx.request({
            url: 'https://www.daohangwa.com/api/user/cancel_order',
            method:'POST',
            data: {
                token: app.globalData.token,
                order_id:target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                   $Message({
                       content:'订单取消成功',
                        type: 'success'
                    })
                    this.getBuyList()

                }
            }
        })
        },
      
    //确认收货
    confirm_order({target}){

          wx.request({
            url: 'https://www.daohangwa.com/api/user/confirm_order',
            method:'POST',
            data: {
                token: app.globalData.token,
                order_id:target.dataset.id
            },
            success: (res) => {
                if (res.data.code == 0) {
                   $Message({
                       content:'确认完成',
                       type:'success'
                    })
                    this.getBuyList()
                }
            }
        })



    },
    new_btn: function() {
        wx.navigateTo({
            url: '../publish/publish'
        })
    },
    fansPage() {
        wx.navigateTo({
            url: '../fans/index'
        })
    },
    editPage(e) {
        let url = e.currentTarget.dataset.url
        wx.navigateTo({
            url: '../publish/publish?goods_id=' + url,
        })
    },
    detailPage(e) {
        let url = e.currentTarget.dataset.url
        let name = e.currentTarget.dataset.name
        let delivery_method = e.currentTarget.dataset.delivery_method

        wx.navigateTo({
            url: '../ordermanage/list?goods_id=' + url+'&goods_name='+name+'&delivery_method='+delivery_method,
        })
  },
  onImgOk(e) { //绘制成功
          wx.hideLoading()            
  },
    pay({target}) {


      let  order_id = target.dataset.id;
      let  goods_id = target.dataset.goods_id;

      let index = target.dataset.idx;
      let _this = this;     


      //绘制配置
       wx.login({ success: res => { 
       var code = res.code;      
       wx.request({
       url: 'https://www.daohangwa.com/api/pay/pay',
       method: "POST", 
       data: { 
        order_id:order_id,
       code: code, 
       token :app.globalData.token,

       }, 
       success: function (res) {  //后端返回的数据 
             var data = res.data.data;     
             console.log(data);          
             console.log(data["timeStamp"]);          
         wx.requestPayment({
              timeStamp: data['timeStamp'],
              nonceStr: data['nonceStr'], 
              package: data['package'], 
              signType: data['signType'], 
              paySign: data['paySign'], 
              success: function (res) { 
                console.log(res)
              
                wx.request({
                  url:'https://www.daohangwa.com/api/pay/orderpay',
                  data:{
                  token:app.globalData.token,
                  order_id:order_id
                  }

                })

                wx.showLoading()
               


                wx.redirectTo({
                  url:'../paySuccess/index?order_id='+order_id+'&goods_id='+goods_id
                })
                
              },
              fail: function (res) { 
                console.log("fail",res)
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

        this.getGoodsList()

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
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
        // 下拉刷新
  onPullDownRefresh: function () {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    this.getBuyList()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
  },
     formSubmit:function(e){
    util.formSubmitCollectFormId.call(this,e)
  }

})