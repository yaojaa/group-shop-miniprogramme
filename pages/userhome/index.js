const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';
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
      {},
      { name: '编辑',subname:'重新编辑修改内容' ,key:'edit'},
      { name: '订单',subname:'进入订单管理页面' ,key:'order'},
      { name: '隐藏', subname: '隐藏不在主页展示',key:'hide'}

             ]
    },
  showAction(e){
    this.goods_id = e.currentTarget.dataset.goods_id
    this.index = e.currentTarget.dataset.index
    this.goods_id=e.currentTarget.dataset.goods_id
    this.goods_name=e.currentTarget.dataset.goods_name
    this.delivery_method=e.currentTarget.dataset.delivery_method 

    this.goods_expires = e.currentTarget.dataset.goods_expires

    if(this.goods_expires ==3 ){
        this.data.actions[0]={ name: '开启',subname:'默认30天自动结束',key:'start'}
    }

    if(this.goods_expires ==1){
        this.data.actions[0]=( { name: '结束',subname:'结束团购停止接单',key:'end'})
    }

    this.setData({
        actions:this.data.actions
    })


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

        case 'order':
        this.onClose()
        this.goOrders()

        break;

        case 'start':
        this.startIt()
        break;


        break;
        case 'edit':

        this.onClose()
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

  goOrders() {


        wx.redirectTo({
            url: '../ordermanage/list?id=' + this.goods_id + '&goods_name=' + this.goods_name + '&delivery_method=' + this.delivery_method
        })


    },


  startIt(){


    const date = new Date()
      date.setHours(0);
      date.setMinutes(0)
      date.setSeconds(0)
date.setDate(date.getDate() + 7);
const default_end_time = util.formatTime(date)


    util.wx.post("/api/seller/goods_change_endtime",{
            end_time:util.formatTime(default_end_time),
            goods_id:this.goods_id
        }).then(res=>{

            wx.showToast({
                title:'已开启，默认7天后结束',
                icon:'none'
            })

            const key = 'goodsList['+this.index+'].goods_expires'

            this.setData({
                [key] : 1
            })

            this.onClose()
        })




  },
  //结束
  endIt(){

    


    util.wx.post("/api/seller/goods_change_endtime",{
            end_time:util.formatTime(new Date()),
            goods_id:this.goods_id
        }).then(res=>{

            wx.showToast({
                title:'已结束',
                icon:'none'
            })

            const key = 'goodsList['+this.index+'].goods_expires'

            this.setData({
                [key] : 3
            })

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

    copyList(){


        var copyTxt = ''

        this.data.goodsList.forEach(item=>{

            copyTxt += '💕'+item.goods_name +'💰¥'
            copyTxt += item._price_range.min +'\n\n'



        })


        console.log(copyTxt)


         wx.setClipboardData({
            data: copyTxt,
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
                if(res.data.code == 200){

                  this.setData({
                    shareFriendsImg: res.data.data
                })

                }else{
                    wx.showToast({
                        title:'生成失败！'+res.data.msg,
                        icon:"none"
                    })

                    this.setData({
                        overlay: false,
                        poster: false
                    })
                }
              
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
            store_id: this.store_id
        })
            .then(res => {


                if(res.data.code ==200){


                this.setData({
                    store_slide: res.data.data.store_slide,
                    info: res.data.data,
                    showSetting: app.globalData.userInfo && app.globalData.userInfo.store.store_id == this.store_id ? true : false
                })
            }



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
            title: this.data.info.store_name
        }
    }
})