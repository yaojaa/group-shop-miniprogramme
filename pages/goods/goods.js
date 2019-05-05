//index.js
//获取应用实例
const util = require('../../utils/util')
const { $Message } = require('../../iView/base/index');

const app = getApp()
app.that = null

Page({
    data: {
        imgs: { // 动画相册配置
            src: [],
            height: 800, //动态图片高度
            animationDuration: 15, // 动画持续时间基数
            minScaleVal: 50, //最小缩放值
            minXYVale: 50, //xy轴最小运动值
        },
        scrollTop: 0,
        hasScope: false, //是否授权
        goods: {},
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
                    fontSize: 32,
                    lineHeight: 52,
                },
            },
            qrcode: {
                src: '',
                size: 300 //二维码显示尺寸默认300
            },
            hw_data: null,
            showAuth: false,
            showRoll: 0,
            totalNum: 0 ,//已选择的总数
            notice:'' ,//价格提示框class
            StatusBar:'',
            toShowPic:false,
            poster:false,
        },
    },
    onShow: function() {

        console.log('onshow....')

        this.setData({
            cartPanel: false
        })

        if (this.data.goods_id) {
            this.getOrderUserList(this.data.goods_id)
        }

    },
    onReady: function() {


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
    onShareAppMessage: function(res) {
        // if (res.from === 'button') {
        //     // 来自页面内转发按钮
        //     console.log(res.target, this.data.goods.goods_id)
        // }

        return {
            title: this.data.goods.goods_name || '我开了一个团推荐大家看看',
            imageUrl: this.data.imagePath,
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
    handlePoster(){
        this.setData({
            showShareFriendsCard: false,
            poster: !this.data.poster
        })
    },
    savaSelfImages() {
        console.log('savaSelfImages')
        if (this.data.shareFriendsImg) {
            wx.saveImageToPhotosAlbum({
                filePath: this.data.shareFriendsImg,
            });
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



    getGoodsInfo(id) {
        //提交访问记录
       util.wx.get('/api/index/add_access', {
          type:'goods_detail', 
          obj_id: id,
          user_scene:app.globalData.userScene,
          user_phone:app.globalData.userPhone
        }).then(res=>{
          this.access_id = res.data.data.access_id
        })




        util.wx.get('/api/goods/get_goods_detail', { 
          goods_id: id
        })
            .then(res => {
                console.log(res)

                if (res.data.code == 200) {


                    // let goods_spec = res.data.data.goods_spec

                    // goods_spec.map(value => {
                    //   value.item_num = 0
                    // })
                    const d = res.data.data

                    console.log('done', res.data.data.goods.goods_images)

                    //把数量设为0

                   d.goods.goods_spec.forEach(item => {
                        console.log(item)
                        item.item_num = 0
                        console.log(item)

                    })

                    console.log('goods_spec bingen',d.goods.goods_spec)


                    this.setData({
                        goods: d.goods,
                        'imgs.src': d.goods.goods_images,
                        // sell_address: res.data.data.sell_address,
                        // seller: res.data.data.seller,
                        goods_spec: d.goods.goods_spec,
                        seller:d.user,
                        hw_data: d.hw_data,
                        // endTime: res.data.data.goods.sell_end_time,
                        countdownTime: new Date(d.goods.end_time * 1000).getTime()
                    })

                    // wx.setNavigationBarTitle({
                    //   title: '【' + res.data.data.seller.nickname + '】 ' + res.data.data.goods.goods_name//页面标题为路由参数
                    // })


                }
            })
    },
    onHide:function(){
      console.log('用户离开了')
      this.leaveDate = new Date()

      //用户停留时间毫秒
      const userStayTime = this.leaveDate.getTime() - this.enterDate.getTime()

      wx.showToast({
        title:'用户离开了'
      })
        //提交访问记录
       util.wx.get('/api/index/set_user_staytime', {
          access_id:this.access_id, 
          user_staytime: userStayTime,
        })
    },
    onLoad: function(option) {
      console.log('用户进入了')

      app.that = this


      this.enterDate = new Date()

        console.log(option)

        this.setData({
            copy: option.copy || false
        })

        this.getGoodsInfo(option.goods_id)

        this.checkUserIslogin()


        //获取价格区域的高度，滚动到此位置
        
        const query = wx.createSelectorQuery()
                query.select('#spec_box').boundingClientRect()
                query.selectViewport().scrollOffset()
                query.exec( (res)=> {

                    this.data.spec_box_top = res[0].top
                  // res[0].top // #the-id节点的上边界坐标
                  // res[1].scrollTop // 显示区域的竖直滚动位置
                  console.log(res)
                })


        this.setData({
            StatusBar:app.globalData.StatusBar
        })

        // wx.showLoading({
        //       title: '玩命加载中...',
        // })
        //没有传ID的情况跳转
        //
        // if(!option.goods_id && !option.scene){

        //      wx.redirectTo({
        //         url:'../login/login'
        //       })

        //      return

        // }

        this.data.goods_id = option.goods_id || option.scene

        util.getShareImg(option.goods_id, this);

        // Promise.all([
        //   util.getQrcode({
        //     page: 'pages/goods/goods',
        //     scene: this.data.goods_id
        //   }),
        //   new Promise(resolve => {
        //     wx.request({
        //       url: 'https://www.daohangwa.com/api/goods/get_goods_info',
        //       data: {
        //         // token: app.globalData.token,
        //         goods_id: this.data.goods_id
        //       },
        //       success: (res) => {
        //         resolve(res);
        //       }

        //     })
        //   })
        // ])
        // .then(arr=>{
        //   console.log('arr',arr);
        //   let res = arr[1];
        //   //绘制朋友圈图片
        //   util.drawShareFriends(this,[arr[0], res.data]);
        //   wx.hideLoading()
        //   if (res.data.code == 0) {

        //     console.log(res.data.data.goods)

        //     let spec_goods_price = res.data.data.spec_goods_price

        //     spec_goods_price.map(value => {
        //       value.item_num = 0
        //     })

        //     this.setData({
        //       goods: res.data.data.goods,
        //       imgUrls: res.data.data.images,
        //       sell_address: res.data.data.sell_address,
        //       seller: res.data.data.seller,
        //       spec_goods_price: spec_goods_price,
        //       delivery_method: res.data.data.goods.delivery_method,
        //       collection_methods: res.data.data.goods.collection_methods,
        //       endTime: res.data.data.goods.sell_end_time,
        //       countdownTime: new Date(res.data.data.goods.sell_end_time * 1000).getTime()
        //     })

        //     wx.setNavigationBarTitle({
        //       title: '【' + res.data.data.seller.nickname + '】 ' + res.data.data.goods.goods_name//页面标题为路由参数
        //     })

        //     //计算位置
        //     if (res.data.data.goods.delivery_method == 2) {
        //       this.computeDistance()
        //     }

        //   }




        // })
        // .catch(e=>{console.log(e)})

        // wx.request({
        //     url: 'https://www.daohangwa.com/api/goods/get_goods_info',
        //     data: {
        //         // token :app.globalData.token,
        //         goods_id: this.data.goods_id
        //     },
        //     success: (res) => {
        //         wx.hideLoading()
        //         if (res.data.code == 0) {

        //             console.log(res.data.data.goods)

        //             let spec_goods_price = res.data.data.spec_goods_price

        //             spec_goods_price.map(value => {
        //                 value.item_num = 0
        //             })

        //             this.setData({
        //                 goods: res.data.data.goods,
        //                 imgUrls: res.data.data.images,
        //                 sell_address: res.data.data.sell_address,
        //                 seller: res.data.data.seller,
        //                 spec_goods_price: spec_goods_price,
        //                 delivery_method:res.data.data.goods.delivery_method,
        //                 collection_methods:res.data.data.goods. collection_methods,
        //                 endTime: res.data.data.goods.sell_end_time,
        //                 countdownTime: new Date(res.data.data.goods.sell_end_time * 1000).getTime()
        //             })

        //             wx.setNavigationBarTitle({
        //               title: '【'+res.data.data.seller.nickname +'】 '+ res.data.data.goods.goods_name//页面标题为路由参数
        //             })

        //              //计算位置
        //         if(res.data.data.goods.delivery_method ==2){
        //             this.computeDistance()
        //         }

        //         }




        //        // this.getOrderUserList(option.goods_id)

        //     }
        // })




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

         var hasAdd =false

         console.log('this.data.goods_spec[0].item_num',this.data.goods_spec[0].item_num)
         //如果只有一个商品规格 
        if (this.data.goods_spec.length <= 1) {
            let value = this.data.goods_spec[0]
            let currentNum = value.item_num ==0 ?'1':value.item_num
            this.setData({
                'goods_spec[0].item_num':currentNum,
                amountMoney: parseInt(value.spec_price * 100 * currentNum ) / 100,
                totalNum:1
            })

            this.setData({
            cartPanel: true
            })

        }else{
          this.data.goods_spec.forEach(item=>{
            if(item.item_num>0){
              hasAdd = true
               this.setData({
                cartPanel: true
                })

            }
          })

          if(!hasAdd){

            console.log('this.data.spec_box_top',this.data.spec_box_top)

            wx.pageScrollTo({
            scrollTop: this.data.spec_box_top -100
          })

            this.setData({
                notice:'notice'
            })

            setTimeout(()=>{
                this.setData({
                notice:''
            })
            },2000)

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

        wx.request({
            method: 'post',
            url: 'https://www.daohangwa.com/api/goods/get_buyusers_by_goodsid',
            data: {
                token: app.globalData.token,
                goods_id: goods_id
            },
            success: (res) => {



                if (res.data.code == 0) {

                    //***后两位
                    res.data.data.lists.map(value => {
                        value.specs.map(val => {
                            val.spec_key_name = val.spec_key_name.replace(/[a-zA-Z]/g, '*')
                        })
                    })

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
    checkUserIslogin() {
        wx.getStorage({ //获取本地缓存
            key: "token",
            success: function(res) {
                console.log('checkUserIslogin', res)
            },
            fail: (res) => {
                console.log('checkUserIslogin', res)
                this.setData({
                    showAuth: true
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
            seller:this.data.goods.user
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
    copyDetail() {
        var price = '规格：\n'
        this.data.goods_spec.forEach((item, index) => {
            price += item.key_name + ' \b 💰' + item.price + "元\n"
        })
        var userList = []
        var len = this.data.orderUsers.length
        this.data.orderUsers.forEach((item, index) => {
            let spec = ''
            item.specs.forEach((k, v) => {
                spec += k.spec_key_name + ' × ' + k.goods_num + '\b '
            })
            userList.unshift((len - index) + '.' + item.user.nickname + " \b " + spec + (item.pay_status == 1 ? "(已付)" : "未付"))
        })
        var content = this.data.goods.goods_name + "\n" + this.data.goods.goods_content + "\n" +
            price +
            '----' + this.data.seller.nickname + "\n" +
            "⏰ 截团时间:" + util.formatTime(new Date(this.data.endTime * 1000)) +
            "\n" + '为节约时间，请大家继续在小程序里接龙哦:\n' +
            userList.join('\n')

        wx.setClipboardData({
            data: content,
            success: function(res) {
                wx.showToast({
                    title: '已复制去粘贴吧',
                    icon: 'success',
                    duration: 2000
                })
            }
        });
    },
    onPageScroll: function(e){

        if(e.scrollTop > app.globalData.winHeight/2){
            this.setData({
              toShowPic:true
            })
        }

        this.setData({
            scrollTop: e.scrollTop,
        })
    }

})