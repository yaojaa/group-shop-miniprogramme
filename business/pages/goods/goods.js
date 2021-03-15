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
    template: {},
    imgOkPath:'',
    imagePath: '',
    collection_methods: '',
    copy: false,
    msgvisible: false,
    showShareFriendsCard: false,
    currentIndex: 0,
    shareFriendsImg: '',
    shareFriendsImgStart: false,
    shareFriendsImgs: [],
    isEmptyEditor: true,
    editorContent: null,
    specPopup: false,
    specItem: {}
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

  onImgOK(e){
    console.log('imgOK',e)
    this.setData({
      imgOkPath: e.detail.path
    })
  },
    onShareAppMessage: function() {


     

        var returnData = {
            title: '【绑定上架】'+this.data.goods.goods_name,
            path: 'business/pages/goods-user/goods?id=' + this.data.goods.goods_id,
            
        }

        if(this.data.imgOkPath){
          returnData.imageUrl = this.data.imgOkPath
        }
      
        return returnData
    },
    openShareFriends() {
        if (!this.data.shareFriendsImgStart) {
            this.data.shareFriendsImgStart = true;
            util.wx.get('/api/seller/get_goods_card', {
                goods_id: this.data.goods_id
            })
            .then(res => {
                if(res.data.code == 200 && res.data.data.path){
                    this.onFriendsImgOK(res.data.data.path);
                }
           })
        }

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
            success: function(res) {
                wx.showToast({
                    title: '已复制',
                    icon: 'none'
                });
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

  copyWx(event) {
    // wx.setClipboardData({
    //   data: this.data.weChat,
    //   success: function (res) {
    //     wx.getClipboardData({
    //       success: function (res) {
    //         wx.showToast({
    //           title: '复制成功'
    //         })
    //       }
    //     })
    //   }
    // })
  },
  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    })
  },


  closeShareFriends() {
    this.setData({
      showShareFriendsCard: false
    })
  },
  handlePoster() {
    this.openShareFriends()
    this.setData({
      showShareFriendsCard: false,
      poster: !this.data.poster
    })
  },
  savaSelfImages() {
    var _this = this
    console.log('savaSelfImages', this.data.shareFriendsImg)
    if (this.data.shareFriendsImg) {
      // 用户授权
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                _this.getSaveImg(_this.data.shareFriendsImg, _this)
              }
            })
          } else {
            _this.getSaveImg(_this.data.shareFriendsImg, _this)
          }
        }
      })

      this.handlePoster()
    }
  },

  getSaveImg(path, _this){
    console.log('path', path)
    wx.getImageInfo({
      src: path,
      success(res){
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(result) {
            wx.showToast({
              title: '已保存到手机相册',
              icon: 'none',
            })
          },
        })
      },
      fail(){
        console.log(`flag${_this}`)
        _this && _this.getSaveImg(path);
      }
    })
  },

  onFriendsImgOK(path) {
    this.data.shareFriendsImgs.push(path)
    this.data.shareFriendsImg = this.data.shareFriendsImgs[0]
    this.setData({
      shareFriendsImgs: this.data.shareFriendsImgs,
      shareFriendsImg: this.data.shareFriendsImg
    })
    console.log('imgOk', this.data.shareFriendsImgs)
  },
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
        urls: urls
      },
      previewImgHidden: false
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
      }
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
      }
    })
  },

  toOrder() {
    wx.redirectTo({
      url: '../userhome/index?id=' + this.data.store_id
    })
  },

  goHomePage() {
    wx.redirectTo({
      url: '../userhome/index?id=' + this.data.store_id
    })
  },

  goOrders() {
    wx.navigateTo({
      url:
        '../ordermanage/list?id=' +
        this.data.goods_id +
        '&goods_name=' +
        this.data.goods.goods_name +
        '&delivery_method=' +
        this.data.goods.delivery_method
    })
  },

  goSendMsg() {
    wx.navigateTo({
      url:
        '../send-msg/index?id=' +
        this.data.goods_id +
        '&name=' +
        this.data.goods.goods_name
    })
  },

  goVisitor() {
    wx.navigateTo({
      url:
        '../fans/index?id=' +
        this.data.goods_id +
        '&name=' +
        this.data.goods.goods_name
    })
  },

  goModify() {
    wx.navigateTo({
      url: '../publish/publish?goods_id=' + this.data.goods_id
    })
  },
  toHome() {
    wx.redirectTo({
      url: '/business/pages/home/index'
    })
  },  
  getGoodsInfo() {
    util.wx
    // api/seller/get_supplier_goods_detail
      .get('/api/goods/get_goods_detail', {
        goods_id: this.data.goods_id
      })
      .then((res) => {


        if(res.data.code == -113 || res.data.code == -114 || res.data.code == -115)
// 如果-99(没登陆)，-2000(没店铺、审核中、未通过审核)，-113(无权访问，先申请代理), -114(无权访问，代理审核中)，-115(无权访问，代理申请被拒绝)
                      {

                    Dialog.alert({
                      title: '您没权限访问此商品',
                      message: '请先联系供货商 申请代理权限',
                      theme: 'round-button'

                    }).then(() => {
                      return  wx.redirectTo({
                            url:'/business/pages/acting-apply/index?id='+res.data.data.supplier_id
                        })
                    })

                }



        if (res.data.code == 200) {
          const d = res.data.data

          d.goods.goods_spec.forEach((item) => {
            item.item_num = 0
          })

          // console.log('goods_spec bingen',d.goods.goods_spec)

          // 没有规格图片使用第一张头图
          d.goods.goods_spec.forEach((e) => {
            if (e.spec_pic.length == 0) {
              e.spec_pic.push(d.goods.goods_images[0].img_url)
            }
          })

          console.log(d)

          util.drawShareFriends(this, d.goods)

         


          let content = JSON.parse(d.goods.content)

          console.log(typeof content)

          // try {
          // }
          // catch(err) {
          // let editorContent = [{
          //     // 模块类型
          //     "type": "text",
          //     // 文本内容
          //     "desc": d.goods.goods_content
          //   }]
          // }

          // editorContent = editorContent ? editorContent : { html: '', text: '' }

          // if(/^<p( wx:nodeid="\d+")?><br( wx:nodeid="\d+")?><\/p><p( wx:nodeid="\d+")?><img[ 0-9a-zA-Z'"\.=_\-\/\\%:]+editorCONTENTVIDEO[ 0-9a-zA-Z'"\.=_\-\/\\%:]+>/.test(editorContent.html)){
          //   editorContent.html = editorContent.html.replace(/^<p( wx:nodeid="\d+")?><br( wx:nodeid="\d+")?><\/p>/,'<p>');
          // }

          // let isEmptyEditor = editorContent.text.replace(/\n/g, '').length == 0 &&
          //   !/img/g.test(editorContent.html)

          // editorContent.video = editorContent.html.match(/alt=["'][a-zA-Z0-9\/\\\.:=_\-]+['"]/g);
          // editorContent.htmlArr = editorContent.html.split(/<img[ 0-9a-zA-Z'"\.=_\-\/\\%:]+editorCONTENTVIDEO[ 0-9a-zA-Z'"\.=_\-\/\\%:]+>/);

          // if(editorContent.video){
          //   editorContent.video = editorContent.video.map(e => {
          //     return e.replace(/(alt=)|["']/g,'')
          //   })
          // }else{
          //   editorContent.video=[]
          // }



          this.setData({
            goods_content:d.goods.goods_content,
            content,
            goods: d.goods,
            'imgs.src': d.goods.goods_images,
            goods_spec:
              d.goods.goods_spec.length == 0
                ? d.goods.goods_images
                : d.goods.goods_spec,
            // hw_data: d.hw_data,
            countdownTime: new Date(d.goods.end_time * 1000).getTime()
          })

          this.wuxCountDown(formatDateTime(d.goods.end_time))
          ;(this.data.seller = d.goods.user),
            (this.data.store_id = d.goods.store.store_id)

          //显示管理面板

          if (this.data.seller.user_id == app.globalData.userInfo.user_id) {
            console.log('是管理')

            this.setData({
              showPanel: true
            })
          }
        } 
      })
      .catch((e) => {
        return
      })
  },
  onHide: function () {
    // 用户查看图片不触
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

    this.data.goods_id = option.goods_id || option.id || option
    this.data.from_id = option.from_id || ''

    this.getGoodsInfo()

    // this.getShareImg()

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

    let key = 'goods_spec[' + id + '].item_num'

    this.data.goods_spec[id].item_num = parseInt(e.detail.value)

    let amountMoney = 0

    let totalNum = 0

    this.data.goods_spec.forEach((value) => {
      console.log(
        'value.spec_price * 100 * parseInt(value.item_num)',
        value.spec_price * 100 * parseInt(value.item_num)
      )
      amountMoney += value.spec_price * 1000 * parseInt(value.item_num)
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
        amountMoney: (value.spec_price * 100 * currentNum) / 100,
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

          this.getGoodsInfo()

        })
        .catch((e) => console.log(e))
    })
  },

  userpage() {
    wx.navigateTo({
      url: '../orderList/orderList'
    })
  },


  removeGoods(){

        const goods_id = this.data.goods_id

        Dialog.confirm({
          title: '确定要删除此商品吗？',
          message: '删除后暂时不可恢复'
        }).then(() => {

             util.wx.post('/api/seller/goods_del',{
              goods_id:goods_id
             })
            .then((res) => {
           
            Dialog.close()
            this.toHome()

            },res=>{

             Dialog.close()

              
            })

        }).catch(() => {
          // on cancel
        });

  },
  showMasterMenu(){

    wx.showActionSheet({
      itemList: ['管理订单', '修改商品', '删除商品'],
      success :(res)=> {
        console.log(res.tapIndex)
        switch(res.tapIndex) {
           case 0:
            wx.navigateTo({
                url:'/business/pages/order-manage/index?goods_id='+this.data.goods_id+'&goods_name='+this.data.goods.goods_name
            })
              break;
           case 1:
            wx.navigateTo({
              url:'/pages/publish/publish?goods_id='+this.data.goods_id
            })

              break;

          case 2:
              this.removeGoods()
                
              break;
      } 


      },
      fail (res) {
        console.log(res.errMsg)
      }
    })

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
  }

})

