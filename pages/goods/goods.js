//index.js
//获取应用实例
const util = require('../../utils/util')
const { $Message } = require('../../iView/base/index');

const app = getApp()

Page({
    data: {
        hasScope: false, //是否授权
        imgUrls: [],
        goods: {},
        visibleU:false,
        seller_user: {},
        sell_address: [],
        spec_goods_price: [],
        code: false,
        cartPanel: false,
        amountMoney: 0,
        countdownTime: 0,
        clearTimer: false,
        myFormat: ['天', '时', '分', '秒'],
        orderUsers: [],
        imagePath: "",
    },
    onShow: function(option) {
        this.setData({
            cartPanel: false
        })
        console.log('(this.data.goods_id', this.data.goods_id)
        this.getOrderUserList(this.data.goods_id)

    },
    onReady: function() {

        app.getUserInfoScopeSetting().then(res => {

            this.setData({
                hasScope: res
            })


        })

    },
    onShareAppMessage: function(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target, this.data.goods.goods_id)
        }

        return {
            title: this.data.goods.goods_name,
            imageUrl: this.data.imagePath,
            path: '/pages/goods/goods?goods_id=' + this.data.goods.goods_id
        }
    },
    onLoad: function(option) {
        console.log('token', app.globalData.token)

        this.data.goods_id = option.goods_id

        util.getShareImg(option.goods_id, this);

        wx.request({
            url: 'https://www.daohangwa.com/api/goods/get_goods_info',
            data: {
                // token :app.globalData.token,
                goods_id: option.goods_id
            },
            success: (res) => {
                if (res.data.code == 0) {

                    console.log(res.data.data.goods)

                    let spec_goods_price = res.data.data.spec_goods_price

                    spec_goods_price.map(value => {
                        value.item_num = 0
                    })

                    this.setData({
                        goods: res.data.data.goods,
                        imgUrls: res.data.data.images,
                        sell_address: res.data.data.sell_address,
                        seller_user: res.data.data.seller_user,
                        spec_goods_price: spec_goods_price,
                        delivery_method:res.data.data.goods.delivery_method,
                        countdownTime: new Date(res.data.data.goods.sell_end_time * 1000).getTime()
                    })

                }

                //计算位置
                this.computeDistance()

                this.getOrderUserList(option.goods_id)

            }
        })
    },
    codeHide() {
        this.setData({
            code: false
        })
    },
    codeShow() {
        this.setData({
            code: true
        })
    },
    handleCountChange(e) {
        let id = e.target.id

        let key = "spec_goods_price[" + id + "].item_num"

        this.data.spec_goods_price[id].item_num = e.detail.value



        let amountMoney = 0;

        this.data.spec_goods_price.forEach(value => amountMoney += parseInt(value.price * 100) * parseInt(value.item_num))



        this.setData({
            [key]: e.detail.value,
            amountMoney: amountMoney / 100
        })

    },
    cartPanelHide() {
        this.setData({
            cartPanel: false
        })
    },
    cartPanelShow() {
        this.setData({
            cartPanel: true
        })

    },
    openMap(e) {
        let goodId = e.currentTarget.dataset.goodId
        wx.navigateTo({
            url: '../userLocation/index?id=' + goodId,
        })
    },
    homepage() {
        wx.navigateTo({
            url: '../home/index'
        })
    },
    getUserInfoEvt: function(e) {
        app.globalData.userInfo = e.detail.userInfo
        app.login_third(e.detail).then((res) => {
                console.group('登陆成功:', res)
                this.buy()
            })
            .catch(e => console.log(e))

    },
    getOrderUserList(goods_id) {

        wx.request({
            method: 'post',
            url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
            data: {
                token: app.globalData.token,
                goods_id: goods_id
            },
            success: (res) => {



                if (res.data.code == 0) {
                    this.setData({
                        orderUsers: res.data.data.lists
                  })

                }




            }
        })


    },
    userpage() {
        wx.navigateTo({
            url: '../orderList/orderList'
        })
    },
    //计算距离
    computeDistance() {


        wx.getLocation({
            type: 'wgs84',
            success: (res) => {
                console.log(res)
                var latitude = res.latitude
                var longitude = res.longitude
                var speed = res.speed
                var accuracy = res.accuracy



                this.data.sell_address.forEach(value => {


                    const la2 = value.latitude
                    const lo2 = value.longitude

                    let dis = util.distance(latitude, longitude, la2, lo2)

                    console.log('dis距离是',dis,this.data.delivery_method)


                    //大于3公里
                    if (dis > 3 && this.data.delivery_method == 2) {

                        $Message({
                            content: '温馨提醒：您的位置不在取货范围内哦',
                            type: 'warning',
                            duration: 5
                        })

                    }


                })





            }
        })







    },
    //预览图片
    imgPreview: function(event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var imgList = event.currentTarget.dataset.list; //获取data-list
        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList // 需要预览的图片http链接列表
        })
    },
    buy() {



        if (this.data.amountMoney == 0) {
            return $Message({
                content: '请选择数量',
                type: 'warning',
                duration: 5
            })
        }


        let shopcar = this.data.spec_goods_price.filter(value => value.item_num > 0)
        wx.setStorageSync('cart', shopcar)
        wx.setStorageSync('goods', {
            goods_name: this.data.goods.goods_name,
            sell_address: this.data.sell_address,
            cover_pic: this.data.imgUrls[0],
            delivery_method: this.data.goods.delivery_method,
            sell_end_time: this.data.goods.sell_end_time,
            goods_content: this.data.goods.goods_content
        })

        wx.navigateTo({
            url: '../order/index?goods_id=' + this.data.goods.goods_id + '&delivery_method=' + this.data.goods.delivery_method
        })
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    }
})