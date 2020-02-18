const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';

console.log(util.addEventLister)
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        indicatorDots: false,
        autoplay: false,
        interval: 5000,
        duration: 1000,
        showIcon: false,
        goodsList: [],
        loading: false,
        store_id: '',
        info: {},
        scrollTop: 0,
        showSetting: false,
        sharebar: false,
        poster: false,
        showAuth: false,
        onLoadOpt: null,
        overlay: true,
        shareIng: false,
        phone: '',
        weChat: '',
        show:false,
        actions: [
      { name: '隐藏', subname: '隐藏不在主页展示',key:'hide'},
      { name: '结束',subname:'结束团购停止接单',key:'end'},
      { name: '开启',subname:'快速开启继续接单' ,key:'start'},
      { name: '置顶',subname:'在第一个位置显示' ,key:'top'},
      { name: '编辑',subname:'重新编辑修改内容' ,key:'edit'}

             ]
    },
  showAction(e){

    this.goods_id = e.currentTarget.dataset.goods_id
    this.index = e.currentTarget.dataset.index

    console.log(this.goods_id)

    this.setData({
        show:true
    })
  },  
  onSelect(e){
    const key = e.detail.key

    switch(key){
        case 'hide':
        this.switchInSite()
        break;

        case 'end':
        this.endIt()
        break;

        case 'edit':
        wx.redirectTo({
            url:'../publish/publish?goods_id='+this.goods_id
        })
        break
    }


    console.log(e)
  },
  onClose() {
    this.setData({ show: false });
  },
  //结束
  endIt(){

    


    util.wx.post("/api/seller/goods_change_endtime",{
            end_time:util.formatTime(new Date()),
            goods_id:this.goods_id
        }).then(res=>{

            this.getDataList()
            this.onClose()

        })



  },
  //隐藏
  switchInSite(){
      wx.showLoading()
        util.wx.post("/api/seller/goods_change_recommend",{
            goods_id:this.goods_id,
            is_recommend:0 
        }).then(res=>{

         wx.hideLoading()


          if(res.data.code == 200){

                wx.showToast({
                    title:'已隐藏',
                    icon:'none'
                })


               this.data.goodsList.splice(this.index,1)

                this.setData({
                  goodsList:this.data.goodsList,
                  show:false
                })
          }

           },res=>{
            wx.hideLoading()

            wx.showToast({
                    title:'设置失败请稍后重试',
                    icon:'none'
                })
           })
    },
  goDetail(e){

    const id = e.currentTarget.dataset.id

    wx.navigateTo({
        url:'../goods/goods?goods_id='+id
    })


  },

 
    goContact(e) {
        const { phone, wx } = e.currentTarget.dataset
        this.setData({
            phone: phone,
            weChat: wx
        })
        Dialog.alert({
            selector: '#contact'
        })
    },
    copyWx(event) {
        wx.setClipboardData({
            data: this.data.weChat,
            success: function (res) {
                wx.getClipboardData({
                    success: function (res) {
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
    toSetting() {
        console.log('toSetting..')
        wx.navigateTo({
            url: '../create_shop/index?store_id=' + this.store_id
        })
    },

    showShare() {
        this.setData({
            overlay: true,
            sharebar: true
        })
    },
    closeShareFriends() {
        this.setData({
            sharebar: false
        })
    },
    handlePoster() {
        this.setData({
            sharebar: false,
            poster: !this.data.poster
        })

        if (this.data.poster) {
            util.wx.get('/api/store/get_store_poster', {
                store_id: this.store_id
            }).then(res => {
                this.setData({
                    shareFriendsImg: res.data.data
                })
            }, res => {

                wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                })
            })
        }
    },
    savaSelfImages() {
        var _this = this;
        console.log('savaSelfImages', this.data.shareFriendsImg)


        wx.downloadFile({
            url: this.data.shareFriendsImg,
            success: (res) => {

                const imgUrl = res.tempFilePath

                // 用户授权
                wx.getSetting({
                    success(res) {
                        if (!res.authSetting['scope.writePhotosAlbum']) {
                            wx.authorize({
                                scope: 'scope.writePhotosAlbum',
                                success() {
                                    console.log(1)
                                    wx.saveImageToPhotosAlbum({
                                        filePath: imgUrl,
                                        success: function (data) {
                                            wx.showToast({
                                                title: '保存成功',
                                                icon: 'success',
                                                duration: 2000
                                            })
                                        }
                                    });
                                }
                            })
                        } else {
                            wx.saveImageToPhotosAlbum({
                                filePath: imgUrl,
                                success: function (data) {
                                    wx.showToast({
                                        title: '保存成功',
                                        icon: 'success',
                                        duration: 2000
                                    })
                                }
                            });
                        }
                    }
                })







            }
        })




        if (this.data.shareFriendsImg) {


            this.handlePoster();
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.loadPage(options);
    },
    onShow() {

        if(this.is_previewImage){
            this.is_previewImage = false
            return
        }


        this.data.goodsList = [];

        this.setData({
            shareIng: false
        })
        
        this.data.onLoadOpt && this.loadPage(this.data.onLoadOpt);
        this.getStoreInfo()
    },
    loadPage(options) {

        if (options.scene) {
            options = decodeURIComponent(options.scene)
            options = options.split('?')[1] || options
            options = util.url2json(options)
        }



        this.store_id = options.id || options.store_id

        // let pages = getCurrentPages(); //当前页面栈

        // if (pages.length > 1) {
        //     this.setData({
        //         showIcon: true
        //     })
        //     console.log(true)
        // } else {
        //     showIcon: false
        //     console.log(false)

        // }


        if (app.globalData.userInfo && !this.data.onLoadOpt) {
            this.add_access()
        }

        this.cpage = 1
        this.getDataList(options)
       
    },

    add_access() {
        //增加访问记录
        util.wx.post('/api/index/add_access', {
            type: 'store_homepage',
            obj_id: this.store_id,
            user_scene: app.globalData.userScene,
            user_phone: app.globalData.userPhone,
            user_id: app.globalData.userInfo.user_id || ''
        })
    },

      // 图片点击放大 
          previewImg: function (e) {
            this.is_previewImage =true //变量开关 不触发onshow
            var src = e.currentTarget.dataset.src;//获取data-src  循环单个图片链接
            var imgList = e.currentTarget.dataset.effect_pic;//获取data-effect_pic   图片列表
            //图片预览
            wx.previewImage({
              current: src, // 当前显示图片的http链接
              urls: imgList // 需要预览的图片http链接列表
            })
          },

    getStoreInfo(options) {

        util.wx.get('/api/store/get_store_homepage', {
            store_id: this.store_id || app.globalData.userInfo.store_id
        })
            .then(res => {

                var store_slide
                if (res.data.data.store_slide.length == 0) {
                    store_slide = ['https://static.kaixinmatuan.cn/c4ca4238a0b923820dcc509a6f75849b201906271717046776.jpg']
                } else {
                    store_slide = res.data.data.store_slide
                }

                this.setData({
                    store_slide: store_slide,
                    info: res.data.data,
                    showSetting: app.globalData.userInfo && app.globalData.userInfo.store_id == this.store_id ? true : false
                })
            }, res => {

            })


    },

    getDataList(options) {

        this.setData({
            loading: true
        })

        util.wx.get('/api/goods/get_store_goods_list', {
            store_id: this.store_id,
            cpage: this.cpage,
            pagesize: 30
        })
            .then(res => {
                // 存储赋值
                this.data.onLoadOpt = options;

                if (res.data.code == 200) {

                    res.data.data.goodslist.forEach(item => {

                        item._buy_users = item._buy_users.slice(0, 16)
                    })


                    this.data.goodsList = this.data.goodsList.concat(res.data.data.goodslist)

                    this.setData({
                        goodsList: this.data.goodsList,
                        loading: false

                    })


                    this.totalpage = res.data.data.page.totalpage
                }
            })



    },

    backMy(){
        wx.redirectTo({
                    url:'../home/index'
                })
    },
    backSetting(){
        wx.redirectTo({
           url:'../create_shop/index'

        })
    },


    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    onPageScroll: function (e) {

        this.scrollTop = e.scrollTop

        if (this.timer) {
            return
        } else {

            this.timer = setTimeout(() => {

                this.setData({
                    scrollTop: this.scrollTop
                })

                clearTimeout(this.timer)
                this.timer = null

            }, 300)



        }





    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },
    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

        ++this.cpage

        if (this.cpage <= this.totalpage) {
            this.getDataList(); //重新调用请求获取下一页数据 
        }


    },

    addEventLister: util.userListner,

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function (res) {

        if (res.from === 'button') {
            // 来自页面内转发按钮
            this.setData({
                overlay: false,
                sharebar: false,
                shareIng: true
            })

        } else {

            this.setData({
                shareIng: true
            })

        }

        return {
            title: this.data.info.store_name+'的主页'
        }
    }
})