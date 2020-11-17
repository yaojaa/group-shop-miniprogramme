const app = getApp();
const util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    goodslist: [],
    goods_id: '',
    order_id: '',
    link_url: '',
    is_loading: true,
    scrollTop: 0,
    store_money: '',
    pending_money: '***',
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    show_tips: false,
    orderList: [],
    fansNum: '...',
    reportData: {},
    showDialog: false, // 订阅提示弹窗
    searchGoodslist: [],
    searchWords: '',
    search_is_loading: true,
  },
    // 搜索
    onSearch(e){
        var sv = e.detail.replace(/(^\s*)|(\s*$)/g,'');
        console.log(sv)
        if(sv){
            this.data.s_cpage = 1;
            this.setData({
                searchWords: sv,
                searchGoodslist: []
            })
            this.getGoodsList();
        }
    },
    onCancel(){
        this.setData({
            searchWords: ''
        })

    },
  isShowPopTips() {
    console.log('获取本地日期');

    wx.getStorage({
      key: 'today',
      success: (res) => {
        //成功的话 说明之前执行过，再判断时间是否是当天
        if (res.data && res.data != new Date().toLocaleDateString()) {
          this.getDayReport();

          this.setData({
            showDialog: true
          });
        } else {
          this.setData({
            showDialog: false
          });
        }
      },
      fail: (res) => {
        //没有执行过的话 先存一下当前的执行时间
        this.setData({
          showDialog: true
        });
        this.getDayReport();

        wx.setStorageSync('today', new Date().toLocaleDateString());
      }
    });
  },

  setHasTips() {
    this.setData({
      showDialog: false
    });

    wx.setStorageSync('today', new Date().toLocaleDateString());
    this.addListen();
  },

  closleTips() {
    this.setData({
      show_tips: false
    });
    wx.setStorage({
      key: 'show_tips',
      data: 'x'
    });
  },

  toDetail(e) {
    let postId = e.currentTarget.dataset.id || e.target.dataset.id;
    wx.navigateTo({
      url: '../goods/goods?goods_id=' + postId
    });
  },

  getProList() {
    util.wx.get('/api/user/get_bought_store_goods').then((res) => {
      if (res.data.code == 200) {
        this.setData({
          proList: res.data.data.goods
        });
      }
      this.setData({
        isloading: false
      });
    });
  },

  handleTabBarChange({ detail }) {
    this.setData({
      current: detail.key
    });

    if (detail.key == 'publish') {
      wx.navigateTo({
        url: '../publish-select/index'
      });
    }

    if (detail.key == 'nearby') {
      wx.redirectTo({
        url: '../index/index'
      });
    }
  },

  //重新获取用户信息 矫正旧数据 如果没有店铺的跳转到个人 并覆盖本地
  //
  reGetUserInfo() {
    util.wx.get('/api/user/get_user_info').then((res) => {
      if (res.data.code == 200) {
        const d = res.data.data;
        if (d.store == null && d.supplier == null) {
          wx.redirectTo({
            url: '../user-home/index'
          });
        } else {
          this.setData({
            pending_money: res.data.data.store.pending_money
          });
        }
      }
    });
  },

  //切换显示隐藏状态事件
  recommendHandle(e) {
    //  console.log(e.detail)
    // this.data.goodslist.forEach((item,index)=>{
    //      if(item.goods_id == e.detail){
    //          const key = 'goodslist['+index+'].is_recommend'
    //          this.setData({
    //              [key]: e.detail.is_recommend
    //          })
    //      }
    // })
    // this.getGoodsList()
  },
  removeHandle(e) {
    console.log(e, '删除成功事件');

    var id = e.detail;

    var c = null;

    this.data.goodslist.forEach((item, index) => {
      console.log(item.goods_id, id);

      if (item.goods_id == id) {
        c = index;
      }
    });

    if (c !== null) {
      this.data.goodslist.splice(c, 1);

      this.setData({
        goodslist: this.data.goodslist
      });
    }
  },
  onShow() {
    wx.hideHomeButton();

    this.reGetUserInfo();

    this.getTabBar().init();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('app.globalData.userInfo', app.globalData.userInfo);

    if (
      typeof app.globalData.userInfo == 'undefined' ||
      app.globalData.userInfo == null
    ) {
      app.redirectToLogin();

      return;
    }

    this.setData({
      userInfo: app.globalData.userInfo
    });
    wx.getStorage({
      key: 'show_tips',
      fail: (res) => {
        this.setData({
          show_tips: true
        });
      }
    });

    this.isShowPopTips();

    //设置最后访问身份
    wx.setStorage({
      key: 'lastVisit',
      data: 'seller'
    });

    this.data.cpage = 1;
    this.data.goodslist = [];
    this.getGoodsList();
    this.getOrderList();
  },
  goCreate() {
    wx.redirectTo({
      url: '../create_shop/index'
    });
  },

  goOrders() {
    wx.redirectTo({
      url: '../new-order-list/index'
    });
  },

  goMySupplier() {
    wx.redirectTo({
      url: '../supplier-list/index'
    });
  },
  goMy() {
    wx.redirectTo({
      url: '../my/index'
    });
  },

  goHome() {
    wx.redirectTo({
      url: '../userhome/index'
    });
  },

  // get_store_info() {
  //     util.wx.get('/api/seller/get_store_money').then(res => {
  //         this.setData({
  //             pending_money: res.data.data.pending_money,
  //             fansNum :res.data.data.fans_count
  //              })

  //     })

  // },

  ///////////
  //获取最新订单 //
  ///////////
  ///
  getOrderList() {
    util.wx
      .get('/api/seller/get_order_list', {
        // orderdate: 1,
        order_status: 1,
        pagesize: 20
      })
      .then((res) => {
        if (res.data.code == 200) {

          let data = res.data.data.order_list
                data.forEach(item =>{
              if (item.store.user_id == app.globalData.userInfo.user_id) {

                  item.isFromSlef = true
              }


                })


          this.setData({
            orderList: data
          });
        }
      })
      .catch((e) => {});
  },

  todetail(e) {
    let id = e.currentTarget.dataset.id;

    wx.navigateTo({
      url: '../order-detail-seller/index?id=' + id
    });
  },
  addListen: util.sellerListner,

    getGoodsList: function() {
        let ajaxData = {
                cpage: this.data.cpage,
                pagesize: 15
            }
        if(this.data.searchWords){ // 搜索模式
            ajaxData = {
                cpage: this.data.s_cpage,
                pagesize: 15,
                keyword: this.data.searchWords
            }
            this.setData({
                search_is_loading: true
            })
        }else{
            this.setData({
                is_loading: true
            })
        }

        

        util.wx.get('/api/seller/get_goods_list', ajaxData)
            .then(res => {

                if(this.data.searchWords){ //搜索
                    this.searchLoadData(res);
                    return;
                }

                if (res.data.code == 200) {
                    this.setData({
                        goodslist: this.data.goodslist.concat(res.data.data.goodslist),
                        is_loading: false
                    })

                    this.data.goodslist.forEach(item => {

                        if (item._order_status1_count > 0) {
                            this.setData({
                                hasNewOrder: true
                            })
                        }



                    })




                    this.totalpage = res.data.data.page.totalpage


                } else {
                    this.setData({
                        is_loading: false
                    })
                }
            }).catch(e=>{


                wx.showToast({
                    title:'读取超时 请稍后重试'
                })
                if(this.data.searchWords){
                    this.setData({
                        search_is_loading: false
                    })
                }else{
                    this.setData({
                        is_loading: false
                    })
                }



            })

    },

    searchLoadData(res){
        if (res.data.code == 200) {
            this.setData({
                searchGoodslist: this.data.searchGoodslist.concat(res.data.data.goodslist),
            })
            this.s_totalpage = res.data.data.page.totalpage


        }
        this.setData({
            search_is_loading: false
        })
    },
  updateList(e) {
    this.setData({
      goodslist: [],
      cpage: 1,
    });
    console.log(this.data.goodslist, '夺夺夺');
    console.log(e)
    this.getGoodsList();
    try{
      if(e.detail.id == 5){
        wx.pageScrollTo({
          scrollTop: 50,
          duration: 300
        })
      }
    }
    catch(err){}
    
  },
  new_btn: function () {
    const uInfo = app.globalData.userInfo;

    console.log(app.globalData.userInfo);
    console.log(uInfo.store_id, uInfo.store);

    if (uInfo.hasOwnProperty('store') || uInfo.hasOwnProperty('store_id')) {
      wx.navigateTo({
        url: '../publish/publish'
      });
    } else {
      wx.navigateTo({
        url: '../apply_shop/index'
      });
    }
  },
  fansPage() {
    wx.navigateTo({
      url: '../fans/index'
    });
  },
  goSite() {
    const store_id =
      app.globalData.userInfo.store_id ||
      app.globalData.userInfo.store.store_id;

    wx.navigateTo({
      url: '../userhome/index?id=' + store_id
    });
  },
  editPage(e) {
    let url = e.currentTarget.dataset.url;
    wx.navigateTo({
      url: '../publish/publish?goods_id=' + url
    });
  },
  detailPage(e) {
    let url = e.currentTarget.dataset.url;
    let name = e.currentTarget.dataset.name;
    let delivery_method = e.currentTarget.dataset.delivery_method;
    let store_id = app.globalData.userInfo.store.store_id;

    wx.navigateTo({
      url:
        '../ordermanage/list?goods_id=' +
        url +
        '&goods_name=' +
        name +
        '&delivery_method=' +
        delivery_method +
        '&store_id=' +
        store_id
    });
  },

  /**
   * 获取每日数据
   */
  getDayReport() {
    util.wx.get('/api/seller/today_sale_reports').then((res) => {
      if (res.data.code == 200) {
        this.setData({
          reportData: res.data.data
        });
      } else if (res.data.code == 2000) {
        app.redirectToLogin();
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    if(!this.data.searchWords){
        this.data.cpage = 1
        this.data.goodslist = []
        this.getGoodsList()
    }
    this.getOrderList();
    wx.stopPullDownRefresh();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if(this.data.searchWords){  // 搜索状态
        ++this.data.s_cpage

        if (this.data.s_cpage <= this.s_totalpage) {
            this.getGoodsList(); //重新调用请求获取下一页数据 
        } else {
            this.data.s_cpage = this.s_totalpage
        }
        return;
    }
    ++this.data.cpage;

    if (this.data.cpage <= this.totalpage) {
      this.getGoodsList(); //重新调用请求获取下一页数据
    } else {
      this.data.cpage = this.totalpage;
    }
  },
  formSubmit: function (e) {
    util.formSubmitCollectFormId.call(this, e);
  },
  onShareAppMessage: function (e) {
    console.log(e);
    if (app.globalData.userInfo) {
      var _uid = app.globalData.userInfo.user_id;
    }

    if (e.target.dataset.type == 'goods') {
      const { cover, goods_name, goods_id } = e.target.dataset;

      return {
        title: goods_name,
        imageUrl: cover + '?imageView2/1/w/500/h/400',
        path: 'pages/goods/goods?goods_id=' + goods_id
      };
    }

    return {
      title: app.globalData.userInfo.nickname + '推荐您一个好助手',
      imageUrl: this.shareImg,
      path: 'pages/login/login' + '?from_id=' + _uid
    };
  }
});
