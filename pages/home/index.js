const app = getApp()


const util = require('../../utils/util.js')


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


        if(typeof this.data.userInfo.token == 'undefined'){
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

        wx.navigateTo({
            url: '../ordermanage/list?goods_id=' + url+'&goods_name='+name,
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
     formSubmit:function(e){
    util.formSubmitCollectFormId.call(this,e)
  }

})