const app = getApp()

const util = require('../../utils/util.js')

import Toast from '../../vant/toast/toast';

Page({

    /**
     * 页面的初始数据
     */
    data: {
        address_id: '',
        address: '',
        self_address: [],
        goods_name: '',
        seller: {},
        delivery_method: 0,
        consignee: '',
        mobile: '',
        user_message: '',
        btn_load: false,
        loading: false,
        address_load: false
    },
    getUserAddress() {
        this.setData({
            address_load: true
        })
        util.wx.get('/api/user/address_list',{
            pagesize:5
        })
            .then(res => {
                this.setData({
                    address_load: false
                })
                var data = res.data.data.address_list
                if (res.data.code == 200) {
                    if (data.length > 0) {
                        data.forEach((item) => {
                            console.log(item, 'item')
                            if (item.is_address_default == 1) {
                                this.setData({
                                    address: item,
                                    address_id: item.address_id
                                })
                            } else {
                                this.setData({
                                    address: data[0],
                                    address_id: data[0].address_id
                                })
                            }
                        })
                    } else {
                        this.setData({
                            address: null,
                            address_id: ''
                        })
                    }
                }
            })
    },
    addAddress(data) {
        let that = this
        util.wx.post('/api/user/address_add_or_edit', data)
            .then(res => {
                console.log(res)
                if (res.data.code == 200) {
                    Toast.success(res.data.msg);
                    that.setData({
                        address: res.data.data.address,
                        address_id: res.data.data.address.address_id
                    })
                } else {
                    Toast.fail(res.data.msg);
                }
            })
    },
    openAddress() {
        let that = this
        wx.chooseAddress({
            success(res) {
                let sendData = {
                    "consignee": res.userName,
                    "mobile": res.telNumber,
                    "province": res.provinceName,
                    "city": res.cityName,
                    "district": res.countyName,
                    "address": res.detailInfo
                }
                that.addAddress(sendData)
            },
            fail() {
                wx.showToast({
                    title: '获取失败',
                    icon: 'none'
                })
            }
        })
    },
    getAddressList() {
        util.wx.get('/api/goods/get_goods_detail', {
                goods_id: this.data.goods_id
            })
            .then(res => {
                if (res.data.code == 200) {
                    let data = res.data.data.goods.self_address
                    console.log(data)
                    this.setData({
                        self_address: data,
                        address_id: data[0].self_address_id || ''
                    })

                }
            })
    },

    onAddressChange(e) {

        this.setData({
            address_id: e.currentTarget.dataset.name
        });
    },

    getGoodsInfo(){
        util.wx.get('/api/goods/get_goods_detail', {
                goods_id: this.data.goods_id
            })
            .then(res => {

                const goods = res.data.data.goods

                /***处理快递自提****/
                if(goods.delivery_method ==1){

                     this.getUserAddress()

                }else{

                    if(goods.self_address.length == 0){
                        wx.showToast({
                            title:'该商品没有录入取货点',
                            icon:'none'
                        })
                      return
                    }

                    this.setData({
                        self_address: goods.self_address,
                        address_id: goods.self_address[0].self_address_id,
                          consignee: app.globalData.userInfo.nickname,
                          mobile: app.globalData.userInfo.mobile,
                    })
                }

                 this.setData({
            seller: goods.user,
            goods_name: goods.goods_name,
            delivery_method: goods.delivery_method
                    })

              



            })
    },

    /**
     * 生命周期函数--监听页面加载 /order/create_order

     */
    onLoad: function(options) {

        this.data.goods_id = options.goods_id
        this.getGoodsInfo()
       

        let amountMoney = 0;
        let totalNumer = 0
        let cartSource = wx.getStorageSync('cart')
        let cart = typeof cartSource === 'string' ? JSON.parse(cartSource) : cartSource;

        // let goodsSource = wx.getStorageSync('goods');

        // let goods = typeof goodsSource === 'string' ? JSON.parse(goodsSource) : goodsSource;


        cart.map(value => {
            amountMoney += parseInt(value.spec_price * 100) * parseInt(value.item_num)
            totalNumer += parseInt(value.item_num)


        })



        this.setData({
          
            goods_id: options.goods_id,
            cart: cart || [],
            amountMoney: amountMoney / 100,
            totalNumer: totalNumer       
             })

   
    },
    inputConsignee(e) {
        this.setData({
            consignee: e.detail
        })
    },
    inputMobile(e) {
        this.setData({
            mobile: e.detail
        })
    },
    inputUser_message(e) {
        this.setData({
            user_message: e.detail
        })
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        //this.getAddress();
    },
    //确认订单
    createOrder: function() {


        let addressData = {
            'consignee': this.data.consignee,
            'mobile': this.data.mobile
        }
        this.setData({
            loading: true
        })
        wx.showLoading()

        const specs = this.data.cart.map(item => {
            return {
                id: item.goods_spec_id,
                qty: item.item_num
            }
        })


        var postData = {}

        if (this.data.delivery_method == 2) {
            postData = {
                consignee: this.data.consignee,
                mobile: this.data.mobile,
                self_address_id: this.data.address_id,

            }
        } else {
            postData = {
                address_id: this.data.address_id
            }

        }

        console.log(postData)


        util.wx.post('/api/order/create_order', Object.assign({
            specs: specs,
            user_message: this.data.user_message,
            goods_id: this.data.goods_id
        }, postData)).then(res => {
                this.data.order_id = res.data.data.order_id;
                this.pay(res.data.data)

        }, (e) => {
            this.setData({
                loading: false
            })
            wx.showToast({
                title: e.data.msg,
                icon: 'none'
            })

        }).catch(e => {
            wx.showToast({
                title: '服务器出小差儿了' + e,
                icon: 'none'
            })
        })


        // wx.request({
        //       method:'post',
        //       url: 'https://www.daohangwa.com/api/cart/create_order',
        //       data:{
        //        token :app.globalData.token,
        //        goods_id:this.data.goods_id,
        //        spec_item:this.data.cart,
        //        create_remark:this.data.create_remark,
        //        address:[addressData]
        //       },
        //       success:  (res) =>{

        //        if(res.data.code !== 0){
        //          this.setData({
        //              loading: false
        //          })
        //          return $Message({
        //            content:res.data.msg
        //          })
        //        }

        //        app.globalData.userInfo.address = addressData


        //          this.data.order_id = res.data.data.order_id;

        //           //创建订单成功
        //           if(this.data.collection_methods==1){
        //               this.pay(parseInt(this.data.order_id))

        //             }else{
        //              this.jumpToSuccess()
        //            }


        //       }
        //          }
        //          )

    },

    jumpToSuccess() {
        wx.redirectTo({
            url: '../paySuccess/index?order_id=' + this.data.order_id + '&goods_id=' + this.data.goods_id
        })
    },

    pay: function(order) {
        var order_sn = order.order_sn;


        util.wx.post('/api/pay/pay', {
            order_sn: order_sn
        }).then(res => {

            var data = res.data.data;

            wx.requestPayment({
                timeStamp: data['timeStamp'],
                nonceStr: data['nonceStr'],
                package: data['package'],
                signType: data['signType'],
                paySign: data['paySign'],
                success: (res) => {

                    console.log(res)


                    util.wx.post('/api/pay/orderpay', {
                        order_sn: order_sn
                    })



                    this.jumpToSuccess();
                },
                fail: (res) => {
                    wx.redirectTo({
                        url: '../order-list/index'
                    })
                }
            })

        },(res)=>{
            this.setData({
                    loading: false
                })
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
        })

    },




    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

        this.getWxCode()

        this.timer = setInterval(() => {
            this.getWxCode()
        }, 1000 * 60 * 4)


    },
    getWxCode() {
        wx.login({
            success: res => {
                // 发送 res.code 到后台换取 openId, sessionKey, unionId
                if (res.code) {
                    console.log(res)
                    this.data.code = res.code

                    util.wx.get('/api/index/get_openid', {
                        js_code: res.code
                    }).then(res => {
                        if (res.data.code == 200) {
                            this.data.session_key = res.data.data.session_key
                        }
                    })
                }
            }
        })
    },
    //通过绑定手机号登录
    getPhoneNumber: function(e) {


        util.wx.post('/api/user/get_wx_mobile', {
            'encryptedData': e.detail.encryptedData,
            'iv': e.detail.iv,
            'session_key': this.data.session_key
        }).then((res) => {

            if (res.data.code == 200 || res.data.code == 400611) {
                this.setData({
                    mobile: res.data.data.phoneNumber
                })
                // wx.redirectTo({
                //     url: '/' + this.data.url + '?id=' + this.data.id
                // })
            } else {
                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })

                this.getWxCode()

            }
        })


    },

    clearTimer(){
        if(this.timer){
            clearInterval(this.timer)
            this.timer == null
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

       this.clearTimer()

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
       this.clearTimer()

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
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    }
})