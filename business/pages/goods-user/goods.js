//index.js
//获取应用实例
const util = require('../../../utils/util')
const { $Message } = require('../../../iView/base/index')
import { $wuxGallery } from '../../../wux/index'
import { $wuxCountDown } from '../../../wux/index'
import Dialog from '../../../vant/dialog/dialog'

const app = getApp()
app.that = null
let drawGoods = null
let drawBuyuser = null
let orderUsersLen = 30 // 购买用户每次加载数量
let orderUsersFlag = false // 购买用户是否正在加载
let orderUsersPage = 1 // 购买用户是否正在加载页
let timer2 = null
let timer3 = null
let uid = ''

function formatDateTime(inputTime) {
  var date = new Date(inputTime * 1000)
  var y = date.getFullYear()
  var m = date.getMonth() + 1
  m = m < 10 ? '0' + m : m
  var d = date.getDate()
  d = d < 10 ? '0' + d : d
  var h = date.getHours()
  h = h < 10 ? '0' + h : h
  var minute = date.getMinutes()
  var second = date.getSeconds()
  minute = minute < 10 ? '0' + minute : minute
  second = second < 10 ? '0' + second : second
  return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second
}

Page({
  data: {
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    url: '',
    showMsgTips: false,
    previewImgs: {
      current: '',
      urls: []
    },
    previewImgHidden: true,
    imgs: {
      // 动画相册配置
      src: [],
      height: 800, //动态图片高度
      animationDuration: 13, // 动画持续时间基数
      minScaleVal: 50, //最小缩放值
      minXYVale: 50 //xy轴最小运动值
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
    imagePath: '',
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
        size: 120 //默认140
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
        }
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
    isEmptyEditor: true,
    specPopup: false,
    specItem: {}
  },
  handleSpecPopup(e) {
    let { item } = e.currentTarget.dataset
    this.setData({
      specItem: item,
      specPopup: !this.data.specPopup
    })
  },
  openUrl() {

    wx.setClipboardData({
      data: this.data.goods.goods_content,
      success: function (res) {
        wx.showToast({
                title: '内容已复制'
              })
      }
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



    toHome(){

    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面


    if(prevPage){
        wx.navigateBack()
    }else{
        wx.redirectTo({
            url: '/pages/supplier-home/index?type=supplier&id='+this.data.goods.supplier_id
        })
    }
    },

    getGoodsInfo() {

        util.wx.get('/api/seller/get_supplier_goods_detail', {
                goods_id: this.data.goods_id
            })
            .then(res => {

                console.log(res.data.code)



                if (res.data.code == 200) {

                    const d = res.data.data

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

                    let content = JSON.parse(d.goods.content)

                    
          //           let editorContent = JSON.parse(d.goods.content);
          //           editorContent = editorContent ? editorContent : {html:'', text:''};

          //           if(/^<p( wx:nodeid="\d+")?><br( wx:nodeid="\d+")?><\/p><p( wx:nodeid="\d+")?><img[ 0-9a-zA-Z'"\.=_\-\/\\%:]+editorCONTENTVIDEO[ 0-9a-zA-Z'"\.=_\-\/\\%:]+>/.test(editorContent.html)){
          //   editorContent.html = editorContent.html.replace(/^<p( wx:nodeid="\d+")?><br( wx:nodeid="\d+")?><\/p>/,'<p>');
          // }
        
          //           let isEmptyEditor = editorContent.text.replace(/\n/g,'').length == 0 && !/img/g.test(editorContent.html);

          //           editorContent.video = editorContent.html.match(/alt=["'][a-zA-Z0-9\/\\\.:=_\-]+['"]/g);
          //           editorContent.htmlArr = editorContent.html.split(/<img[ 0-9a-zA-Z'"\.=_\-\/\\%:]+editorCONTENTVIDEO[ 0-9a-zA-Z'"\.=_\-\/\\%:]+>/);

          //           if(editorContent.video){
          //             editorContent.video = editorContent.video.map(e => {
          //               return e.replace(/(alt=)|["']/g,'')
          //             })
          //           }else{
          //             editorContent.video=[]
          //           }
          //           console.log(editorContent)

                    this.setData({
                        content,
                        goods: d.goods,
                        'imgs.src': d.goods.goods_images,
                        goods_spec: d.goods.goods_spec.length == 0 ? d.goods.goods_images : d.goods.goods_spec,
                        // hw_data: d.hw_data,
                        countdownTime: new Date(d.goods.end_time * 1000).getTime()
                    })

                    // this.wuxCountDown(formatDateTime(d.goods.end_time))


                    this.data.seller = d.goods.user

                }else if (res.data.code == -2000){

                     Dialog.alert({
                      title: '您没权限访问此商品',
                      message: '请先免费创建一个团长主页'
                    }).then(() => {
                        app.globalData.backUrl = '/business/pages/goods-user/goods?id='+this.data.goods_id 
                        wx.redirectTo({
                            url:'/pages/create-home/index'
                        })
                    })

                }

                else if(res.data.code == -113 || res.data.code == -114 || res.data.code == -115)
// 如果-99(没登陆)，-2000(没店铺、审核中、未通过审核)，-113(无权访问，先申请代理), -114(无权访问，代理审核中)，-115(无权访问，代理申请被拒绝)
                      {

                    Dialog.alert({
                      title: '您没权限访问此商品',
                      message: '请先联系供货商 申请代理权限',
                      theme: 'round-button'

                    }).then(() => {
                        wx.redirectTo({
                            url:'/business/pages/acting-apply/index?supplier_id='+res.data.data.supplier_id
                        })
                    })

                }
            }).catch(res=>{
                console.log('catch',res)


               


            })
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

  onFriendsImgOK(e) {
    this.data.shareFriendsImgs.push(e.detail.path)
    this.data.shareFriendsImg = this.data.shareFriendsImgs[0]
    this.setData({
      shareFriendsImgs: this.data.shareFriendsImgs,
      shareFriendsImg: this.data.shareFriendsImg
    })
    console.log('imgOk', this.data.shareFriendsImgs)
  },
  // onFriendsImgOK(e) {
  //     this.setData({
  //         shareFriendsImg2: e.detail.path
  //     })
  //     console.log('imgOk', e);
  // },
  friendsImgChange(e) {
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
        urls: urls,
      },
      previewImgHidden: false,
    })

    return

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

    urls = urls.map((item) => {
      return item + '?imageMogr2/thumbnail/700x/size-limit/35k!'
    })

    console.log(urls)

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

  goods_up() {
    console.log('go')

    wx.navigateTo({
      url: '/pages/goods-up/index?goods_id=' + this.data.goods_id
    })
  },



  // add_access() {
  //   // if (!app.globalData.userInfo) {
  //   //     return
  //   // }
  //   //提交访问记录
  //   util.wx
  //     .get('/api/index/add_access', {
  //       type: 'goods_detail',
  //       obj_id: this.data.goods_id,
  //       user_id: app.globalData.userInfo ? app.globalData.userInfo.user_id : '',
  //       user_scene: app.globalData.userScene,
  //       user_phone: app.globalData.userPhone
  //     })
  //     .then((res) => {
  //       this.access_id = res.data.data.access_id
  //     })
  //     .catch((e) => {
  //       console.log(e)
  //     })
  // },


  onHide: function () {
    // 用户查看图片不触发
    if (this.data.imgPreviewFlag) {
      return
    }

    console.log('用户离开了 onHide')

    this.setStayTime()
  },

  onLoad: function (option) {
    console.log('用户进入了', option)

    if (option.scene) {
      option = decodeURIComponent(option.scene)

      option = option.split('?')[1] || option

      option = util.url2json(option)
    }

    app.that = this

    this.enterDate = new Date()

    this.data.goods_id =  option.id || option.goods_id || option
    this.data.from_id = option.from_id || ''

    console.log(this.data.goods_id)

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

    let key = 'goods_spec[' + id + '].item_num'

    this.data.goods_spec[id].item_num = parseInt(e.detail.value)

    let amountMoney = 0

    let totalNum = 0

    this.data.goods_spec.forEach((value) => {
      console.log(
        'value.spec_price * 100 * parseInt(value.item_num)',
        value.spec_price * 100 * parseInt(value.item_num)
      )
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
        amountMoney: (value.agent_price * 100 * currentNum) / 100,
        totalNum: 1
      })

      this.setData({
        cartPanel: true
      })
    } else {
      this.data.goods_spec.forEach((item) => {
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
      url: '../userLocation/index?id=' + goodId
    })
  },
  homepage() {
    var pages = getCurrentPages()
    var prevPage = pages[pages.length - 2] //上一个页面
    if (prevPage && prevPage.route == 'pages/home/index') {
      wx.navigateBack()
    } else {
      wx.redirectTo({
        url: '../home/index'
      })
    }
  },
  getUserInfoEvt: function (e) {
    console.log(e)
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return wx.showToast({ title: '允许一下又不会怀孕', icon: 'none' })
    }

    app.globalData.userInfo = e.detail.userInfo
    wx.showLoading()
    app.getOpenId().then((openid) => {
      app.globalData.openid = openid
      app
        .login_third(e.detail)
        .then((res) => {
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
        .catch((e) => console.log(e))
    })
  },
  //购物车抛物线
  startAnimation() {
    console.log('开始动画')
    this.setData({
      showRoll: 1
    })
    this.busPos = {}
    this.busPos['x'] = 80 //购物车的位置
    this.busPos['y'] = app.globalData.winHeight

    this.linePos = util.bezier(
      [this.busPos, { x: 82, y: 100 }, this.starPos],
      20
    ).bezier_points

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
  onUnload: function () {
    console.log('用户离开了onUnload')
    this.setStayTime()
  },

  //预览图片
  imgPreview: function (event) {
    var src = event.currentTarget.dataset.src //获取data-src
    var imgList = event.currentTarget.dataset.list //获取data-list
    var _this = this
    // 打开查看图片预览标识
    this.data.imgPreviewFlag = true

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
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

    let shopcar = this.data.goods_spec.filter((value) => value.item_num > 0)

    wx.setStorage({
      key: 'cart',
      data: shopcar,
      success: () => {
        wx.navigateTo({
          url:
            '../order-confirm/index?goods_id=' +
            this.data.goods.goods_id +
            '&delivery_method=1'
        })
      }
    })
  },
  formSubmit: function (e) {
    util.formSubmitCollectFormId.call(this, e)
  },
  calluser(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.mobile
    })
  }
})
