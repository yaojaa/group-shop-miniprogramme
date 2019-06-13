const app = getApp()


const util = require('../../utils/util.js')
const { $Message } = require('../../iView/base/index');


Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        order_number: 0,
        goods_number: 0,
        store_money: 0,
        goodslist: [],
        goods_id: "",
        order_id: "",
        link_url: "",
        is_loading: true,
        scrollTop:0,
        store_money:0,
        pending_money:0

    },
    handleTabBarChange ({ detail }) {
        this.setData({
            current: detail.key
        })

        if(detail.key =='publish'){
           wx.navigateTo({
              url:'../publish-select/index'
            })
        }

        if(detail.key =='nearby'){
           wx.navigateTo({
              url:'../index/index'
            })
        }
       
  },
  removeHandle(e){
    console.log(e,'删除成功事件')

    var id = e.detail

    var c

    this.data.goodslist.forEach((item,index)=>{
        console.log(item.goods_id , id)

        if(item.goods_id == id){
            c = index
        }
    })

    console.log(c)
    if(c){
    var _data = this.data.goodslist.splice(c,1)

    console.log(_data)

    this.setData({
        'goodslist':_data
    })
        
    }

  },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

        console.log('app.globalData.userInfo', app.globalData.userInfo)



        if (app.globalData.userInfo) {

            this.setData({
                userInfo: app.globalData.userInfo
            })

             this.cpage = 1


            this.getGoodsList()

            //this.getBuyList(token)

            this.get_store_info()


        } else {

            app.userLoginReadyCallback = (userInfo) => {
                this.setData({
                    userInfo: userInfo
                })
                this.getGoodsList(userInfo.token)
                this.getBuyList(app.globalData.userInfo.token)

            }


        }


        if (typeof app.globalData.token == 'undefined' || app.globalData.token == null) {
            app.redirectToLogin()
        }


        // util.playSound('https://static.kaixinmatuan.cn/staitc-img/new_order.mp3')





    },
    getOrderCount(){

          util.wx.get('/api/user/get_order_count_groupby_static').then(res=>{
                console.log(res)
                if (res.data.code == 200) {
                    console.log('store_money: res.data.data.store_money',res.data.data.store_money)
                    this.setData({
                        store_money: res.data.data.store_money,
                        pending_money:res.data.data.pending_money
                    })
                }
        })

    },
    

    goCreate() {
        wx.redirectTo({
            url: '../create_shop/index'
        })
    },

    goHome() {

        wx.redirectTo({
            url: '../userhome/index'
        })


    },

    get_store_info() {
                console.log('get_store_info')

        util.wx.get('/api/seller/get_store_money').then(res=>{
                console.log(res)
                if (res.data.code == 200) {
                    console.log('store_money: res.data.data.store_money',res.data.data.store_money)
                    this.setData({
                        store_money: res.data.data.store_money,
                        pending_money:res.data.data.pending_money
                    })
                }
        })
    },


    getGoodsList: function(token) {

        util.wx.get('/api/seller/get_goods_list',{
        cpage:this.cpage,
        pagesize:5
        })
            .then(res => {

                if (res.data.code == 200) {
                    this.setData({
                        goodslist: this.data.goodslist.concat(res.data.data.goodslist),
                        goods_number: res.data.data.page.total,
                        is_loading: false
                    })
                this.totalpage = res.data.data.page.totalpage

                }else{
                    this.setData({
                        is_loading:false
                    })
                }
            })

    },





  
    new_btn: function() {
        wx.navigateTo({
            url: '../publish-select/index'
        })
    },
    fansPage() {
        wx.navigateTo({
            url: '../fans/index'
        })
    },
    goSite() {
        console.log(this.data.userInfo.store_id)
        wx.navigateTo({
            url: '../userhome/index?id='+this.data.userInfo.store_id
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
            url: '../ordermanage/list?goods_id=' + url + '&goods_name=' + name + '&delivery_method=' + delivery_method,
        })
    },
    //复制商品
    copyGoods(e) {
        const goods_id = e.currentTarget.dataset.id
        wx.navigateTo({
            url: '../publish/publish?copy=' + goods_id
        })


    },

 

    pay({ target }) {


        let order_id = target.dataset.id;
        let goods_id = target.dataset.goods_id;
        let wx_collection_code = target.dataset.wx_collection_code;



        let collection_methods = target.dataset.collection_methods

        let index = target.dataset.idx;
        let _this = this;


        if (collection_methods == 2) {

            var src = wx_collection_code; //获取data-src
            //图片预览
            wx.previewImage({
                current: src, // 当前显示图片的http链接
                urls: [src] // 需要预览的图片http链接列表
            })
            return
        }

        //绘制配置
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
    sortChange(e) { // solt 组件示例
        this.setData({
            example: e.detail
        })
        console.log('sort', e.detail);
    },
    /**
     * 获取用户基本信息
     */
    getUserInfo: function() {
        util.wx.get('/user/get_user_info').then(res => {

            this.setData({
                userInfo: res.data.data
            })

        })

    },







    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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

     ++ this.cpage

     if(this.cpage <= this.totalpage){
      this.getGoodsList();//重新调用请求获取下一页数据 
     }


    },
    onPageScroll:function(e){
    this.setData({
      scrollTop:e.scrollTop
    })
  },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {
        return {
            title: '一个开团小助理，可以方便的收款接单、管理发货，都说好用',
            imageUrl: 'http://img.daohangwa.com/tmp/wx6ac9955f87c289f0.o6zAJswbLfZtqnLUD5RXc3Q9FUIM.qr6svasJ7BWN1b8c4ad3d976fdedcbce1c383b653238.jpg',
            path: '/pages/login/login'
        }
    },
    // 下拉刷新
    onPullDownRefresh: function() {
        // 显示顶部刷新图标
        wx.showNavigationBarLoading();
        this.getBuyList()
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    }

})