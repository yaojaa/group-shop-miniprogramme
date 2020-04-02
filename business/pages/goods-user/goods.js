//index.js
//获取应用实例
const util = require('../../../utils/util')
const { $Message } = require('../../../iView/base/index');
import { $wuxGallery } from '../../../wux/index'
import { $wuxCountDown } from '../../../wux/index'
import Dialog from '../../../vant/dialog/dialog';

const app = getApp()
app.that = null;
let drawGoods = null;
let drawBuyuser = null;
let orderUsersLen = 30; // 购买用户每次加载数量
let orderUsersFlag = false; // 购买用户是否正在加载
let orderUsersPage = 1; // 购买用户是否正在加载页
let timer2 = null
let timer3 = null
let uid = ''

function formatDateTime(inputTime) {
    var date = new Date(inputTime * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
}

Page({
    data: {
        StatusBar: app.globalData.StatusBar,
        CustomBar: app.globalData.CustomBar,
        url: '',
        showMsgTips: false,
        previewImgs: {
            current: "",
            urls: [],
        },
        previewImgHidden: true,
        imgs: { // 动画相册配置
            src: [],
            height: 800, //动态图片高度
            animationDuration: 13, // 动画持续时间基数
            minScaleVal: 50, //最小缩放值
            minXYVale: 50, //xy轴最小运动值
        },
        note: '',
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
        orderUsersLoading: false,
        imagePath: "",
        collection_methods: '',
        copy: false,
        msgvisible: false,
        showShareFriendsCard: false,
        currentIndex: 0,
        shareFriendsImg: '',
        shareFriendsImgStart: false,
        shareFriendsImgs: [],
        template: {},
        template2: {},
        shareCardConfig: {
            width: 750,
            goodsImg: {},
            headImg: {
                size: 120, //默认140
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
            phone: '',
            weChat: ''
        },
    },
    openUrl() {
        // let that = this
        // let reg = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g;
        // this.data.goods.goods_content.replace(reg, function(website) {
        //     that.setData({
        //         url: website
        //     })
        // });
        wx.setClipboardData({
            data: this.data.goods.goods_content,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '内容已复制'
                        })
                    }
                })
            }
        })
    },
    wuxCountDown(date) {
        console.log(date, '时间')
        this.c1 = new $wuxCountDown({
            date: date,
            render(date) {
                const years = this.leadingZeros(date.years, 4)
                const days = this.leadingZeros(date.days, 2)
                const hours = this.leadingZeros(date.hours, 2)
                const min = this.leadingZeros(date.min, 2)
                const sec = this.leadingZeros(date.sec, 2)
                this.setData({
                    years: years,
                    days: days,
                    hours: hours,
                    min: min,
                    sec: sec
                })
            }
        })
    },
    goContact(e) {
        const { phone, wx } = e.currentTarget.dataset
        this.setData({
            phone: phone,
            weChat: wx
        })
       Dialog.confirm   ({
            confirmButtonText:'进入主页',
            selector: '#contact'
        }).then(() => {

          this.goHomePage()

        }).catch(() => {
          // on cancel
        })
    },
    copyWx(event) {
        wx.setClipboardData({
            data: this.data.weChat,
            success: function(res) {
                wx.getClipboardData({
                    success: function(res) {
                        wx.showToast({
                            title: '复制成功'
                        })
                    }
                })
            }
        })
    },
    phoneCall() {
        wx.makePhoneCall({
            phoneNumber: this.data.phone
        })
    },
    onShow: function() {
        // 关闭查看图片预览标识
        this.data.imgPreviewFlag = false;

        this.setData({
            cartPanel: false
        })


    },
    onReady: function() {


    },
    onShareAppMessage: function() {
        if (app.globalData.userInfo) {
            uid = app.globalData.userInfo.user_id
        }
        return {
            title: this.data.goods.goods_name ,
            path: '/pages/goods/goods?goods_id=' + this.data.goods.goods_id + '&from_id=' + uid
        }
    },
    openShareFriends() {
        if (!this.data.shareFriendsImgStart) {
            this.data.shareFriendsImgStart = true;
            //util.drawShareFriends(this, drawGoods, drawBuyuser);
        }

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
                                      success(result) {
                                            wx.showToast({
                                                title:"保存成功",
                                                icon:"none"
                                            })
                                          }
                                });
                            }
                        })
                    } else {
                        console.log(2)
                        wx.saveImageToPhotosAlbum({
                            filePath: _this.data.shareFriendsImg,
                             success(result) {
                                wx.showToast({
                                    title:"保存成功",
                                    icon:"none"
                                })
                              }
                        });
                    }
                }
            })

            this.handlePoster();
        }
    },
    onFriendsImgOK(e) {
        this.data.shareFriendsImgs.push(e.detail.path);
        this.data.shareFriendsImg = this.data.shareFriendsImgs[0];
        this.setData({
            shareFriendsImgs: this.data.shareFriendsImgs,
            shareFriendsImg: this.data.shareFriendsImg
        })
        console.log('imgOk', this.data.shareFriendsImgs);
    },
    // onFriendsImgOK(e) {
    //     this.setData({
    //         shareFriendsImg2: e.detail.path
    //     })
    //     console.log('imgOk', e);
    // },
    friendsImgChange(e){
        console.log(e.detail.current)
        this.data.shareFriendsImg = this.data.shareFriendsImgs[e.detail.current]
        this.setData({
            currentIndex: e.detail.current
        })
    },
    showGallery(e) {
        const { current } = e.currentTarget.dataset
        const urls = this.data.goods.content_imgs

        this.setData({
            previewImgs: {
                current: current,
                urls: urls
            },
            previewImgHidden: false
        })

        return;

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
        var { urls } = e.currentTarget.dataset

        urls = urls.map(item => {
            return item + '?imageMogr2/thumbnail/700x/size-limit/35k!'
        })

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
            }
        })
    },

    goods_up(){


        console.log('go')

        wx.navigateTo({
            url: '/pages/goods-up/index?goods_id=' + this.data.goods_id 
        })

    },

    toHome(){

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面


    if(prevPage){
        wx.navigateBack()
    }else{

        wx.redirectTo({
            url: '/pages/supplier-home/index?id='+this.data.goods.supplier_id
        })
    }

    },



    add_access() {

        // if (!app.globalData.userInfo) {
        //     return
        // }
        //提交访问记录
        util.wx.get('/api/index/add_access', {
            type: 'goods_detail',
            obj_id: this.data.goods_id,
            user_id: app.globalData.userInfo ? app.globalData.userInfo.user_id : '',
            user_scene: app.globalData.userScene,
            user_phone: app.globalData.userPhone
        }).then(res => {
            this.access_id = res.data.data.access_id
        }).catch(e => {
            console.log(e)
        })
    },

    getGoodsInfo() {

        util.wx.get('/api/seller/get_supplier_goods_detail', {
                goods_id: this.data.goods_id 
            })
            .then(res => {

                console.log(res)



                if (res.data.code == 200) {

                    const d = res.data.data

                    //绘制朋友圈图片
                    drawGoods = d;

                    // //延迟5秒再绘制 提高首次加载性能速度
                    // timer2 = setTimeout(() => {

                    //     if (drawBuyuser) {
                    //         util.drawShareFriends(this, d, drawBuyuser);
                    //     }

                    // }, 5e3)




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

                    this.wuxCountDown(formatDateTime(d.goods.end_time))


                    this.data.seller = d.goods.user

                }
            }).catch(res=>{
                console.log(res)


                if (res.data.code == -113 || res.data.code == -114 || res.data.code == -115) {

                    Dialog.alert({
                      title: '您无权查看该产品',
                      message: '请联系相关人员开通权限'
                    }).then(() => {

                        console.log('e',1111)

                        wx.redirectTo({
                            url:'/pages/login/login'
                        })
                      // on close
                    })


                }


            })
    },
    onHide: function() {
        // 用户查看图片不触发
        if (this.data.imgPreviewFlag) { return; }



        console.log('用户离开了 onHide')

        this.setStayTime()




    },
    setStayTime() {
        //提交访问记录
        if (this.access_id) {

            this.leaveDate = new Date()

            //用户停留时间毫秒
            const userStayTime = this.leaveDate.getTime() - this.enterDate.getTime()


            util.wx.get('/api/index/set_user_staytime', {
                access_id: this.access_id,
                user_staytime: userStayTime,
            })


        }

    },
    onLoad: function(option) {
        console.log('用户进入了', option)

        if (option.scene) {
            option = decodeURIComponent(option.scene)

            option = option.split('?')[1] || option

            option = util.url2json(option)
        }

        app.that = this


        this.enterDate = new Date()

        this.data.goods_id = option.goods_id || option.id || option
        this.data.from_id = option.from_id || ''

        this.getGoodsInfo()


        // this.add_access()

        //未登录 弹出授权弹窗
        if (!app.globalData.userInfo) {
            setTimeout(() => {
                this.setData({
                    showAuth: true
                })
            }, 5000)
        }



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
    /**群发通知**/
    setTips() {

        if (this.data.note == '') {

            return wx.showToast({ title: '没有输入内容', icon: 'none' })

        }

        wx.showLoading()


        util.wx.post('/api/seller/send_tmp_msg', {
            goods_id: this.data.goods_id,
            note: this.data.note
        }).then(res => {

            wx.hideLoading()


            if (res.data.code == 200) {
                wx.showToast({ title: "群发通知成功！" })


            } else {

                wx.showToast({
                    title: res.data.msg,
                    icon: "none"
                })


            }

            this.setData({
                showMsgTips: false
            });
        }, (res) => {

            wx.hideLoading()

            wx.showToast({
                title: res.data.msg,
                icon: "none"
            })

        })

    },
    inputNote(e) {
        this.setData({
            note: e.detail.value
        })
    },
    closeTips() {

        this.setData({
            showMsgTips: false
        })

    },
    rejectAuth() {
        this.setData({
            showAuth: false
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

        let id = e.target.id

        this.type = e.detail.type

        let key = "goods_spec[" + id + "].item_num"

        this.data.goods_spec[id].item_num = parseInt(e.detail.value)

        let amountMoney = 0;

        let totalNum = 0


        this.data.goods_spec.forEach(value => {

            console.log('value.spec_price * 100 * parseInt(value.item_num)', value.spec_price * 100 * parseInt(value.item_num))
            amountMoney += value.agent_price * 1000 * parseInt(value.item_num)
            totalNum += value.item_num
        })




        this.setData({
            [key]: e.detail.value,
            amountMoney: amountMoney / 1000,
            totalNum: totalNum
        })

        console.log('totalNum', this.data.totalNum)



    },
    toPublish() {

        wx.navigateTo({
            url: '../publish-select/index'
        })

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
    //点击参与按钮
    cartPanelShow() {

        console.log('cartPanelShow')

        var hasAdd = false

        console.log(this.data.goods_spec.length)

        //如果只有一个商品规格 
        if (this.data.goods_spec.length <= 1) {
            let value = this.data.goods_spec[0]
            let currentNum = value.item_num == 0 ? '1' : value.item_num
            this.setData({
                'goods_spec[0].item_num': currentNum,
                amountMoney: value.agent_price * 100 * currentNum / 100,
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

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2]; //上一个页面
        if (prevPage && prevPage.route == 'pages/home/index') {
            wx.navigateBack()
        } else {
            wx.redirectTo({
                url: '../home/index'
            })

        }
    },
    getUserInfoEvt: function(e) {
        console.log(e)
        if (e.detail.errMsg !== "getUserInfo:ok") {
            return wx.showToast({ 'title': '允许一下又不会怀孕', icon: 'none' })
        }

        app.globalData.userInfo = e.detail.userInfo
        wx.showLoading()
        app.getOpenId().then((openid) => {
            app.globalData.openid = openid
            app.login_third(e.detail).then((res) => {
                    wx.hideLoading()
                    wx.showToast({
                        title: '登录成功',
                        icon: 'none'
                    })

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

    userpage() {
        wx.navigateTo({
            url: '../orderList/orderList'
        })
    },
    onUnload: function() {



        console.log('用户离开了onUnload')
        this.setStayTime()


    },

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

        if (!app.globalData.userInfo) {
            this.setData({
                showAuth: true,
                cartPanel: false

            })

            return
        }

        //默认选一份

        if (this.data.amountMoney == 0) {

            return $Message({
                content: '请选择数量',
                type: 'warning',
                duration: 5
            })
        }


        let shopcar = this.data.goods_spec.filter(value => value.item_num > 0)


        wx.setStorage({
            key: 'cart',
            data: shopcar,
            success: () => {

                wx.navigateTo({
                    url: '../order-confirm/index?goods_id=' + this.data.goods.goods_id + '&delivery_method=1'
                })


            }
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

    // wx.redirectTo({
    //       url: '../publish/publish?copy_id=' + this.data.goods.goods_id
    //   })
    copyGoods() {

          //未登录 弹出授权弹窗
        if (!app.globalData.userInfo) {
                this.setData({
                    showAuth: true
                })
            return
        }

        wx.redirectTo({
            url: '../publish/publish?goods_id=' + this.data.goods.goods_id + '&copy=true'
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
                spec += k.spec_name + '' + k.qty + '\b '
            })
            userList.unshift(item.create_number + '.' + item.nickname + " \b " + spec + (item.pay_status == 1 ? "(已付)" : "未付"))
        })

        var content = this.data.goods.goods_name + "\n" + this.data.goods.goods_content + "\n" +
            price +
            '----' + this.data.seller.nickname + "\n"

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
    // buyUserScroll: function(e) {
    //     if(orderUsersFlag){
    //         return;
    //     }

    //     orderUsersFlag = true;

    //     this.setData({
    //         orderUsersLoading: true
    //     })


    // util.wx.get('/api/goods/get_minorders_by_goods_id', {
    //     goods_id: this.data.goods_id,
    //     pagesize: orderUsersLen,
    //     cpage: orderUsersPage
    // }).then(res => {

    //             console.log(res)

    //         if(res.data.data.order_list && res.data.data.order_list.length > 0){
    //             orderUsersPage ++;

    //             orderUsersFlag = false;

    //             this.setData({
    //                 orderUsersLoading: false,
    //                 ['_orderUsers_[' + this.data._orderUsers_.length + ']']: res.data.data.order_list
    //             })
    //         }else{
    //             this.setData({
    //                 orderUsersLoading: false
    //             })
    //         }

    //     })

    // },
    onPageScroll: function(e) {

        if (e.scrollTop > 50 && !this.data.toShowPic) {
            this.setData({
                toShowPic: true
            })
        }

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