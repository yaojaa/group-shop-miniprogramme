const app = getApp()

const util = require('../../utils/util.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address_id: '',
        address: '',
        addressList: [],
        goods_name: '',
        sell_address: {},
        seller: {},
        delivery_method: 0
    },
    getAddressList() {
        util.wx.get('/api/user/address_list')
            .then(res => {
                if (res.data.code == 200) {
                    let data = res.data.data.address_list
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
    getAddress() {
        util.wx.get('/api/user/address_detail', { address_id: this.data.address_id })
            .then(res => {
                if (res.data.code == 200) {
                    this.setData({
                        address: res.data.data
                    })
                }
            })
    },
    /**
     * 生命周期函数--监听页面加载 /order/create_order

     */
    onLoad: function(options) {



        let amountMoney = 0;
        let totalNumer = 0
        let cartSource = wx.getStorageSync('cart')
        let cart = typeof cartSource === 'string' ? JSON.parse(cartSource) : cartSource;

        let goodsSource = wx.getStorageSync('goods');

        let goods = typeof goodsSource === 'string' ? JSON.parse(goodsSource) : goodsSource;


        cart.map(value => {
            amountMoney += parseInt(value.spec_price * 100) * parseInt(value.item_num)
            totalNumer += parseInt(value.item_num)


        })



        this.setData({
            // consignee: app.globalData.userInfo.nickname || wx.getStorageSync('userInfo').nickname,
            goods_id: options.goods_id,
            cart: cart || [],
            amountMoney: amountMoney / 100,
            totalNumer: totalNumer,
            seller: goods.seller,
            goods_name: goods.goods_name,
            delivery_method: options.delivery_method
            // collection_methods:options.collection_methods || 1
        })

        //快递发货获取用户快递地址
        if (options.delivery_method == 1) {
            this.getAddressList()
        }





    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.getAddress();
    },
    //确认订单
    createOrder: function() {


        // let address = wx.getStorageSync('goods').sell_address[0].address


        //   if(this.data.nickName ==''){
        //   $Message({
        //     content:'请填写收货人'
        //   })
        //   return
        // }




        // if(this.data.mobile ==''){
        //   $Message({
        //     content:'请填写手机号码'
        //   })
        //   return
        // }





        let addressData = {
            'consignee': this.data.consignee,
            'province_name': this.data.province_name,
            'city_name': this.data.city_name,
            'district_name': this.data.district_name,
            'address': this.data.address,
            'mobile': this.data.mobile
        }


        this.setData({
            loading: true
        })

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
                mobile: this.data.mobile
            }
        } else {
            postData = {
                address_id: this.data.address_id
            }

        }

        console.log(postData)


        util.wx.post('/api/order/create_order', Object.assign({
            specs: specs,
            user_message: '2222'
        }, postData)).then(res => {

            this.setData({
                loading: false
            })

            if (res.data.code == 200) {

                this.pay(res.data.data.order_sn)


            } else {

                wx.showToast({
                    title:res.data.msg,
                    icon:'none'
                })
            }



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
            url: '../paySuccess/index?order_id=' + this.data.order_id + '&goods_id=' + this.data.goods_id + '&collection_methods=' + this.data.collection_methods
        })
    },

    pay: function(order_sn) {



        util.wx.post('/api/pay/pay',
             {
                order_sn: order_sn
            }
            ).then(res=>{

                var data = res.data.data;

                wx.requestPayment({
                    timeStamp: data['timeStamp'],
                    nonceStr: data['nonceStr'],
                    package: data['package'],
                    signType: data['signType'],
                    paySign: data['paySign'],
                    success: (res) => {


                        util.wx.post('/api/pay/orderpay',{
                            order_sn:order_sn
                        })



                        wx.redirectTo({
                            url:'../paySuccess/index?order_id='+order_sn
                        })
                    },
                    fail:(res)=>{
                        wx.redirectTo({
                            url:'../order-list/index'
                        })
                    }
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