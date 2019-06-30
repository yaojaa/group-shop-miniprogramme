//index.js
//获取应用实例
const util = require('../../utils/util')
const { $Message } = require('../../iView/base/index');
import { $wuxGallery } from '../../wux/index'

console.log('$wuxGallery', $wuxGallery)

const app = getApp()
app.that = null;
let drawGoods = null;
let drawBuyuser = null;
let orderUsersLen = 30; // 购买用户每次加载数量
let orderUsersFlag = false; // 购买用户是否正在加载
let orderUsersPage = 2; // 购买用户是否正在加载
let timer2 = null
let timer3 = null

Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        imgs: { // 动画相册配置
            src: [],
            height: 800, //动态图片高度
            animationDuration: 13, // 动画持续时间基数
            minScaleVal: 50, //最小缩放值
            minXYVale: 50, //xy轴最小运动值
        },
        scrollTop: 0,
        hasScope: false, //是否授权
        goods: '',
        visibleU: false,
        seller: {},
        sell_address: [],
        goods_spec: [],
        code: false,
        cartPanel: false,
        amountMoney: 0,
        countdownTime: 0,
        clearTimer: false,
        myFormat: ['天', '小时', '分', '秒'],
        orderUsers: [],
        _orderUsers: [], // 存储
        _orderUsers_: [], // 执行
        orderUsersLoading: true,
        imagePath: "",
        collection_methods: '',
        copy: false,
        msgvisible: false,
        showShareFriendsCard: false,
        shareFriendsImg: '',
        template: {},
        shareCardConfig: {
            width: 750,
            goodsImg: {
                height: 380 //默认400
            },
            headImg: {
                size: 140, //默认140
            },
            userName: '开心麻团儿',
            content: {
                des: [], //一个元素一个段落
                margin: 30, //左右边界默认30
                lineHeight: 52,
                fontSize: 30,
                title: {
                    fontSize: 38,
                    lineHeight: 50
                },
            },
            qrcode: {
                src: '',
                size: 300 //二维码显示尺寸默认300
            },
            hw_data: null,
            showAuth: false,
            showRoll: 0,
            totalNum: 0, //已选择的总数
            notice: '', //价格提示框class
            StatusBar: '',
            toShowPic: false,
            poster: false,
            winWidth: app.globalData.winWidth,
            imgPreviewFlag: false, // 是否查看图片预览  true 是  false 否
        },
    },
    onShow: function() {

        console.log('onshow....')
        // 关闭查看图片预览标识
        this.data.imgPreviewFlag = false;

        this.setData({
            cartPanel: false
        })

        if (this.data.goods_id) {
            this.getOrderUserList(this.data.goods_id)
        }


    },
    onReady: function() {

        if (app.globalData.userInfo) {

            this.setData({
                hasScope: true
            })

            this.add_access()

            return
        }


        wx.getSetting({
            success: res => {

                if (res.authSetting['scope.userInfo']) {
                    app.globalData.hasScope = true

                } else {
                    app.globalData.hasScope = false
                }

                this.setData({
                    hasScope: app.globalData.hasScope
                })
            }
        })
    },
    onShareAppMessage: function() {

        console.log('onShareAppMessage', this, this.shareImg)


        return {
            title: this.data.goods.goods_name || '我开了一个团推荐大家看看',
            imageUrl: this.shareImg,
            path: '/pages/goods/goods?goods_id=' + this.data.goods.goods_id
        }
    },
    openShareFriends() {


        this.setData({
            showShareFriendsCard: true
        })



    },
    closeShareFriends() {
        this.setData({
            showShareFriendsCard: false
        })
    },
    handlePoster() {
        this.setData({
            showShareFriendsCard: false,
            poster: !this.data.poster
        })
    },
    savaSelfImages() {
        var _this = this;
        console.log('savaSelfImages', this.data.shareFriendsImg)
        if (this.data.shareFriendsImg) {
            // 用户授权
            wx.getSetting({
                success(res) {
                    if (!res.authSetting['scope.writePhotosAlbum']) {
                        wx.authorize({
                            scope: 'scope.writePhotosAlbum',
                            success() {
                                console.log(1)
                                wx.saveImageToPhotosAlbum({
                                    filePath: _this.data.shareFriendsImg,
                                });
                            }
                        })
                    } else {
                        console.log(2)
                        wx.saveImageToPhotosAlbum({
                            filePath: _this.data.shareFriendsImg,
                        });
                    }
                }
            })

            this.handlePoster();
        }
    },
    onFriendsImgOK(e) {
        this.setData({
            shareFriendsImg: e.detail.path
        })
        console.log('imgOk', e);
    },
    copy: function() {

        wx.redirectTo({
            url: '../publish/publish?goods_id=' + this.data.goods_id
        })

    },

    showGallery(e) {
        const { current } = e.currentTarget.dataset
        const urls = this.data.goods.content_imgs

        this.$wuxGallery = $wuxGallery()

        this.$wuxGallery.show({
            current,
            showDelete: false,
            indicatorDots: true,
            indicatorColor: '#fff',
            indicatorActiveColor: '#04BE02',
            urls,
            cancel() {},
            onTap(current, urls) {
                console.log(current, urls)
                return true
            },
            onChange(e) {
                console.log(e)
            },
        })
    },

    showGallerySpec(e) {
        const { current } = e.currentTarget.dataset
        const { urls } = e.currentTarget.dataset

        this.$wuxGallery = $wuxGallery()

        this.$wuxGallery.show({
            current,
            showDelete: false,
            indicatorDots: true,
            indicatorColor: '#fff',
            indicatorActiveColor: '#04BE02',
            urls,
            cancel() {},
            onTap(current, urls) {
                console.log(current, urls)
                return true
            },
            onChange(e) {
                console.log(e)
            },
        })
    },

    goHomePage() {
        wx.navigateTo({
            url: '../userhome/index?id=' + this.data.store_id
        })
    },

    getShareImg(id) {


        util.wx.get('/api/index/goods_card', {
            goods_id: this.data.goods_id
        }).then(res => {

            if (res.data.code == 200) {
                this.shareImg = res.data.data.path
            }

        })
    },

    add_access() {
        //提交访问记录
        util.wx.get('/api/index/add_access', {
            type: 'goods_detail',
            obj_id: this.data.goods_id,
            user_scene: app.globalData.userScene,
            user_phone: app.globalData.userPhone
        }).then(res => {
            this.access_id = res.data.data.access_id
        }).catch(e => {
            console.log(e)
        })
    },

    getGoodsInfo() {

        util.wx.get('/api/goods/get_goods_detail', {
                goods_id: this.data.goods_id
            })
            .then(res => {
                if (res.data.code == 200) {

                    const d = res.data.data

                    //绘制朋友圈图片
                    drawGoods = d;

                    //延迟5秒再绘制 提高首次加载性能速度
                    timer2 = setTimeout(() => {

                        if (drawBuyuser) {
                            util.drawShareFriends(this, d, drawBuyuser);
                        }

                    }, 5e3)




                    //把数量设为0

                    d.goods.goods_spec.forEach(item => {
                        console.log(item)
                        item.item_num = 0
                        console.log(item)

                    })

                    // console.log('goods_spec bingen',d.goods.goods_spec)

                    // 没有规格图片使用第一张头图
                    d.goods.goods_spec.forEach(e => {
                        if (e.spec_pic.length == 0) {
                            e.spec_pic.push(d.goods.goods_images[0].img_url)
                        }
                    })

                    this.setData({
                        goods: d.goods,
                        'imgs.src': d.goods.goods_images,
                        goods_spec: d.goods.goods_spec.length == 0 ? d.goods.goods_images : d.goods.goods_spec,
                        // hw_data: d.hw_data,
                        countdownTime: new Date(d.goods.end_time * 1000).getTime()
                    })

                    this.data.seller = d.goods.user,
                        this.data.store_id = d.goods.store.store_id



                }
            })
    },
    onHide: function() {
        // 用户查看图片不触发
        if (this.data.imgPreviewFlag) { return; }

        if (timer2) {

            clearTimeout(timer2)
            console.log('this.timer2', timer2)
            timer2 == null
        }


        if (timer3) {
            clearTimeout(timer3)
            timer3 == null
        }



        console.log('用户离开了')
        this.leaveDate = new Date()

        //用户停留时间毫秒
        const userStayTime = this.leaveDate.getTime() - this.enterDate.getTime()

        //提交访问记录
        util.wx.get('/api/index/set_user_staytime', {
            access_id: this.access_id,
            user_staytime: userStayTime,
        })
    },
    onLoad: function(option) {
        console.log('用户进入了', option)

        if (option.scene) {
            option = decodeURIComponent(option.scene)

            option = option.split('?')[1] || option

            console.log(' decodeURIComponent(option.scene)', option)

            option = util.url2json(option)
        }

        app.that = this


        this.enterDate = new Date()

        this.data.goods_id = option.goods_id || option.id


        this.getGoodsInfo()

        this.getShareImg()

        this.add_access()



        //获取价格区域的高度，滚动到此位置

        const query = wx.createSelectorQuery()
        query.select('#spec_box').boundingClientRect()
        query.selectViewport().scrollOffset()
        query.exec((res) => {

            this.data.spec_box_top = res[0].top
        })


        this.setData({
            StatusBar: app.globalData.StatusBar
        })



    },
    codeHide() {
        this.setData({
            code: false
        })
    },
    ok_i_know() {
        this.setData({
            msgvisible: false
        })
    },
    codeShow() {
        this.setData({
            code: true
        })
    },
    handleCountChange(e) {
        console.log('handleCountChange', e)
        let id = e.target.id

        this.type = e.detail.type

        let key = "goods_spec[" + id + "].item_num"

        this.data.goods_spec[id].item_num = parseInt(e.detail.value)

        let amountMoney = 0;

        let totalNum = 0


        this.data.goods_spec.forEach(value => {

            console.log('parseInt(value.spec_price * 100)', parseInt(value.spec_price * 100))
            amountMoney += parseInt(value.spec_price * 100) * parseInt(value.item_num)
            totalNum += value.item_num
        })




        this.setData({
            [key]: e.detail.value,
            amountMoney: amountMoney / 100,
            totalNum: totalNum
        })

        console.log('totalNum', this.data.totalNum)



    },
    addAnimate(e) {
        console.log('this.type', this.type)
        if (this.type === 'plus') {

            this.starPos = {}
            this.starPos['x'] = e.detail.x - 20
            this.starPos['y'] = e.detail.y - this.data.scrollTop
            console.log('starPos', this.starPos)
            this.startAnimation()

        }
    },
    cartPanelHide() {
        this.setData({
            cartPanel: false
        })
    },
    cartPanelShow() {

        var hasAdd = false

        console.log('this.data.goods_spec[0].item_num', this.data.goods_spec[0].item_num)
        //如果只有一个商品规格 
        if (this.data.goods_spec.length <= 1) {
            let value = this.data.goods_spec[0]
            let currentNum = value.item_num == 0 ? '1' : value.item_num
            this.setData({
                'goods_spec[0].item_num': currentNum,
                amountMoney: parseInt(value.spec_price * 100 * currentNum) / 100,
                totalNum: 1
            })

            this.setData({
                cartPanel: true
            })

        } else {
            this.data.goods_spec.forEach(item => {
                if (item.item_num > 0) {
                    hasAdd = true
                    this.setData({
                        cartPanel: true
                    })

                }
            })

            if (!hasAdd) {

                console.log('this.data.spec_box_top', this.data.spec_box_top)

                wx.pageScrollTo({
                    scrollTop: this.data.spec_box_top - 100
                })

                this.setData({
                    notice: 'notice'
                })

                setTimeout(() => {
                    this.setData({
                        notice: ''
                    })
                }, 2000)

            }
        }






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
        console.log(e)
        if (e.detail.errMsg !== "getUserInfo:ok") {
            return wx.showToast({ 'title': '允许一下又不会怀孕', icon: 'none' })
        }
        app.globalData.userInfo = e.detail.userInfo
        wx.showLoading()
        app.getOpenId().then((openid) => {
            console.log(openid)
            app.globalData.openid = openid
            app.login_third(e.detail).then((res) => {
                    console.group('登陆成功:', res)
                    wx.hideLoading()
                    this.setData({
                        showAuth: false
                    })

                    this.add_access()
                })
                .catch(e => console.log(e))


        })


    },
    //购物车抛物线
    startAnimation() {
        console.log('开始动画')
        this.setData({
            showRoll: 1
        })
        this.busPos = {};
        this.busPos['x'] = 80; //购物车的位置
        this.busPos['y'] = app.globalData.winHeight;


        this.linePos = util.bezier([this.busPos, { x: 82, y: 100 }, this.starPos], 20).bezier_points

        console.log('this.linePos', this.linePos)
        var len = this.linePos.length
        this.timer && clearInterval(this.timer)

        this.timer = setInterval(() => {
            len--
            this.setData({
                bus_x: this.linePos[len].x,
                bus_y: this.linePos[len].y
            })



            if (len == 0) {
                console.log(len)
                this.setData({
                    showRoll: 0
                })
                clearInterval(this.timer)
            }

        }, 25)

    },
    getOrderUserList(goods_id) {

        util.wx.get('/api/goods/get_minorders_by_goods_id', {
            goods_id: goods_id,
            pagesize: 30
        }).then(res => {

            drawBuyuser = res.data.data.order_list;

            timer3 = setTimeout(() => {

                if (drawBuyuser) {
                    util.drawShareFriends(this, drawGoods, drawBuyuser);
                }

            }, 5e3)


            this.data.orderUsers = res.data.data.order_list;

            this.data._orderUsers = [];
            this.data._orderUsers_ = [];

            this.data._orderUsers[0] = [];

            res.data.data.order_list.forEach((e, i) => {
                let _i = parseInt(i / orderUsersLen);
                if (i % orderUsersLen == 0 && i >= orderUsersLen - 1) {
                    this.data._orderUsers[_i] = [];
                }
                this.data._orderUsers[_i].push(e)
            })

            console.log(this.data._orderUsers)

            this.data._orderUsers_.push(this.data._orderUsers.shift())

            this.setData({
                _orderUsers_: this.data._orderUsers_,
                orderUsers: this.data.orderUsers
            })




        })

        // wx.request({
        //     method: 'get',
        //     url: 'https://www.kaixinmatuan.cn/api/goods/get_minorders_by_goods_id',
        //     data: {
        //         token: app.globalData.token,
        //         goods_id: goods_id
        //     },
        //     success: (res) => {
        //         if (res.data.code == 200) {

        //             //***后两位
        //             // res.data.data.map(value => {
        //             //     value.specs.map(val => {
        //             //         val.spec_key_name = val.spec_key_name.replace(/[a-zA-Z]/g, '*')
        //             //     })
        //             // })

        //             //绘制朋友圈图片
        //             drawBuyuser = res.data.data;
        //             if (drawGoods) {
        //                 util.drawShareFriends(this, drawGoods, res.data.data);
        //             }

        //             this.data.orderUsers = res.data.data;

        //             this.data._orderUsers = [];
        //             this.data._orderUsers_ = [];

        //             this.data._orderUsers[0] = [];

        //             res.data.data.forEach((e, i) => {
        //                 let _i = parseInt(i / orderUsersLen);
        //                 if (i % orderUsersLen == 0 && i >= orderUsersLen - 1) {
        //                     this.data._orderUsers[_i] = [];
        //                 }
        //                 this.data._orderUsers[_i].push(e)
        //             })

        //             console.log(this.data._orderUsers)

        //             this.data._orderUsers_.push(this.data._orderUsers.shift())

        //             this.setData({
        //                 _orderUsers_: this.data._orderUsers_,
        //                 orderUsers: this.data.orderUsers
        //             })

        //         }




        //     }
        // })


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



                    // //大于3公里
                    // if (dis > 3 && this.data.delivery_method == 2) {
                    //     setTimeout(() => {
                    //         this.setData({
                    //             msgvisible: true
                    //         })
                    //     }, 3000)
                    // }


                })





            }
        })







    },
    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

        if (timer2) {
            clearTimeout(timer2)
            console.log('timer2', timer2)
            timer2 == null
        }


        if (timer3) {
            clearTimeout(timer3)
            timer3 == null
        }

        console.log('用户离开了')


    },

    // checkUserIslogin() {
    //     wx.getStorage({ //获取本地缓存
    //         key: "token",
    //         success: function(res) {
    //             console.log('checkUserIslogin', res)
    //         },
    //         fail: (res) => {
    //             console.log('checkUserIslogin', res)
    //             this.setData({
    //                 showAuth: true
    //             })
    //         }
    //     })
    // },
    //预览图片
    imgPreview: function(event) {
        var src = event.currentTarget.dataset.src; //获取data-src
        var imgList = event.currentTarget.dataset.list; //获取data-list
        var _this = this;
        // 打开查看图片预览标识
        this.data.imgPreviewFlag = true;

        //图片预览
        wx.previewImage({
            current: src, // 当前显示图片的http链接
            urls: imgList, // 需要预览的图片http链接列表
        })
    },
    buy() {

        console.log('buy')
        //默认选一份

        if (this.data.amountMoney == 0) {

            return $Message({
                content: '请选择数量',
                type: 'warning',
                duration: 5
            })
        }


        let shopcar = this.data.goods_spec.filter(value => value.item_num > 0)

        wx.setStorageSync('cart', shopcar)
        wx.setStorageSync('goods', {
            goods_name: this.data.goods.goods_name,
            sell_address: this.data.sell_address,
            seller: this.data.goods.user
        })

        wx.navigateTo({
            url: '../order-confirm/index?goods_id=' + this.data.goods.goods_id + '&delivery_method=' + this.data.goods.delivery_method
        })
    },
    formSubmit: function(e) {
        util.formSubmitCollectFormId.call(this, e)
    },
    calluser(e) {
        wx.makePhoneCall({
            phoneNumber: e.target.dataset.mobile
        })
    },
    copyGoods() {

        wx.navigateTo({
            url: '../publish/publish?goods_id=' + this.data.goods.goods_id
        })

    },
    copyDetail() {
        var price = '规格：\n'
        console.log(this.data.goods_spec)
        this.data.goods_spec.forEach((item, index) => {
            price += item.spec_name + ' \b 💰' + item.spec_price + "元\n"
        })
        var userList = []
        var len = this.data.orderUsers.length
        this.data.orderUsers.forEach((item, index) => {
            let spec = ''
            console.log(item)
            item.spec.forEach((k, v) => {
                spec += k.spec_name + ' × ' + k.qty + '\b '
            })
            userList.unshift(item.create_number + '.' + item.nickname + " \b " + spec + (item.pay_status == 1 ? "(已付)" : "未付"))
        })

        var content = this.data.goods.goods_name + "\n" + this.data.goods.goods_content + "\n" +
            price +
            '----' + this.data.seller.nickname + "\n" +
            "⏰ 截团时间:" + util.formatTime(new Date(this.data.goods.end_time * 1000)) +
            "\n" + '为节约时间，请大家继续在小程序里接龙哦:\n' +
            userList.join('\n')

        wx.setClipboardData({
            data: content,
            success: function(res) {
                wx.showToast({
                    title: '已复制去粘贴吧',
                    icon: 'none',
                    duration: 2000
                })
            }
        });
    },
    buyUserScroll: function(e) {
        if(orderUsersFlag){
            return;
        }

        orderUsersFlag = true;

        util.wx.get('/api/goods/get_minorders_by_goods_id', {
            goods_id: this.data.goods_id,
            pagesize: 30,
            cpage: orderUsersPage
        }).then(res => {

                console.log(res)

            if(res.data.data.order_list && res.data.data.order_list.length > 0){
                orderUsersPage ++;

                orderUsersFlag = false;

                this.setData({
                    ['_orderUsers_[' + this.data._orderUsers_.length + ']']: res.data.data.order_list
                })
            }else{
                this.setData({
                    orderUsersLoading: false
                })
            }

        })


        // if (this.data._orderUsers.length > 0) {
        //     if (orderUsersFlag) {
        //         return;
        //     }

        //     let index = this.data._orderUsers_.length;

        //     orderUsersFlag = true;

        //     this.data._orderUsers_.push(this.data._orderUsers.shift())

        //     this.setData({
        //         ['_orderUsers_[' + index + ']']: this.data._orderUsers_[index]
        //     }, function() {
        //         orderUsersFlag = false;
        //     })

        //     console.log(this.data._orderUsers_)
        // } else {
        //     this.setData({
        //         orderUsersLoading: false
        //     })
        // }
    },
    onPageScroll: function(e) {

        if (e.scrollTop > 300 && !this.data.toShowPic) {
            this.setData({
                toShowPic: true
            })
            console.log('toShowPictoShowPictoShowPictoShowPic')
        }

        // if (this.data._orderUsers.length > 0 && e.scrollTop > 60 * orderUsersLen) {
        //     let index = this.data._orderUsers_.length;
        //     this.data._orderUsers_.push(this.data._orderUsers.shift())

        //     this.setData({
        //         ['_orderUsers_[' + index + ']']: this.data._orderUsers_[index]
        //     })

        //     console.log(this.data._orderUsers_)
        // }

        this.data.scrollTop = e.scrollTop

        if (!this.timer) {
            this.timer = setTimeout(() => {
                this.setData({
                    scrollTop: this.data.scrollTop,
                })
                clearTimeout(this.timer)
                this.timer = null;
            }, 200)
        }
    }

})