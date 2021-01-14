//index.js
//获取应用实例
//
//
// goods_link
// store_link
// spec_link
// price_link

const util = require('../../utils/util');
const { $Message } = require('../../iView/base/index');
import { $wuxGallery } from '../../wux/index';
import { $wuxCountDown } from '../../wux/index';
import Dialog from '../../vant/dialog/dialog';

const app = getApp();
app.that = null;
let drawGoods = null;
let orderUsersLen = 30; // 购买用户每次加载数量
let orderUsersFlag = false; // 购买用户是否正在加载
let orderUsersPage = 1; // 购买用户是否正在加载页
let timer2 = null;
let timer3 = null;
let uid = '';

function formatDateTime(inputTime) {
  var date = new Date(inputTime * 1000);
  var y = date.getFullYear();
  var m = date.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = date.getDate();
  d = d < 10 ? '0' + d : d;
  var h = date.getHours();
  h = h < 10 ? '0' + h : h;
  var minute = date.getMinutes();
  var second = date.getSeconds();
  minute = minute < 10 ? '0' + minute : minute;
  second = second < 10 ? '0' + second : second;
  return y + '/' + m + '/' + d + ' ' + h + ':' + minute + ':' + second;
}

Page({
  data: {
    menuBarTop: app.globalData.menuBarTop,
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
      duration: 13,
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
    imgOkPath: '',
    template2: {},
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
    menuBarTop: '',
    toShowPic: false,
    poster: false,
    winWidth: app.globalData.winWidth,
    imgPreviewFlag: false, // 是否查看图片预览  true 是  false 否
    phone: '',
    weChat: '',

    isEmptyEditor: true,
    editorContent: null,
    specPopup: false,
    specItem: {},
    showInviteFriend: false,
    is_help_sale: false,
    isCanDraw: false,
    shareData: {},
    reduce_txt:''
  },
  handleSpecPopup(e) {
    let { item } = e.currentTarget.dataset;
    this.setData({
      specItem: item,
      specPopup: !this.data.specPopup
    });
  },

  onImgOK(e) {
    this.setData({
      imgOkPath: e.detail.path
    });
  },

  /**
   *@method  弹出层
   *
   */

  showApplyModal(msg) {
    wx.showModal({
      title: msg,
      content: '是否立即申请',
      confirmText: '立即申请',
      confirmColor: '#4bb000',
      success: (res) => {
        if (res.confirm) {
          wx.redirectTo({
            url:
              '../acting-apply/index?store_id=' +
              this.data.store_id +
              '&goods_id=' +
              this.data.goods_id
          });
        } else if (res.cancel) {
          console.log('用户点击取消');
        }
      }
    });
  },

  /**
   *@method  检测当前用户是不是代理成员
   * @return null
   *
   */

  checkIsHelper() {
    util.wx
      .post('/api/helper/is_store_helper', {
        store_id: this.data.store_id
      })
      .then((res) => {
        console.log(res.data.data == 0);

        //不是帮卖成员
        if (res.data.data == 0) {
          this.showApplyModal('您没有权限帮卖Ta的商品！');
        }

        this.setData({
          is_help_sale_user: res.data.data == 0 ? false : true
        });
      });
  },
  openUrl() {
    wx.setClipboardData({
      data: this.data.goods.goods_content,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '内容已复制'
            });
          }
        });
      }
    });
  },
  wuxCountDown(date) {
    console.log(date, '时间');
    this.c1 = new $wuxCountDown({
      date: date,
      render(date) {
        const years = this.leadingZeros(date.years, 4);
        const days = this.leadingZeros(date.days, 2);
        const hours = this.leadingZeros(date.hours, 2);
        const min = this.leadingZeros(date.min, 2);
        const sec = this.leadingZeros(date.sec, 2);
        this.setData({
          years: years,
          days: days,
          hours: hours,
          min: min,
          sec: sec
        });
      }
    });
  },
  goBack() {
    wx.navigateBack({
      delta: 1
    });
  },
  goContact(e) {
    this.setData({
      phone: this.data.goods.user.mobile,
      weChat: this.data.goods.user.wechatnumber
    });

    console.log(this.data.goods);

    Dialog.confirm({
      confirmButtonText: '逛逛Ta的主页',
      selector: '#contact'
    })
      .then(() => {
        this.goHomePage();
      })
      .catch(() => {
        // on cancel
      });
  },
  copyWx(event) {
    wx.setClipboardData({
      data: this.data.weChat,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            wx.showToast({
              title: '复制成功'
            });
          }
        });
      }
    });
  },
  phoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone
    });
  },

  onShow: function () {
    // 关闭查看图片预览标识
    this.data.imgPreviewFlag = false;

    this.setData({
      cartPanel: false
    });

    if (this.data.goods_id) {
      this.getOrderUserList(this.data.goods_id);
    }

    //获取价格区域的高度，滚动到此位置

    const query = wx.createSelectorQuery();
    query.select('#spec_box').boundingClientRect();
    query.selectViewport().scrollOffset();
    query.exec((res) => {
      console.log(res);

      if (res && res.length) {
        this.data.spec_box_top = res[0].top;
      }
    });
  },
  onReady: function () {},

  createShareImage() {
    this.setData({
      showShareFriendsCard: false,
      isCanDraw: !this.data.isCanDraw
    });
  },
  onShareAppMessage: function (e) {
    var title = '';
    var img_url = '';
    if (e.from == 'menu') {
      title = this.data.goods.goods_name;
      img_url = this.shareImg;
    } else {
      console.log(e.target.dataset, 'e.target.dataset');
      const { type, image, name } = e.target.dataset;
      var pathParam = '';
      if (type == 'invit') {
        title =
          this.data.goods.user.nickname +
          '邀请你帮卖【' +
          this.data.goods.goods_name +
          '】';
        pathParam = '&help_sale=true';
        img_url = this.data.imgOkPath;
      } else {
        title = name || this.data.goods.goods_name;
        img_url = image || this.shareImg;
      }
    }

    if (app.globalData.userInfo) {
      uid = app.globalData.userInfo.user_id;
    }

    console.log({
      title: title,
      imageUrl: img_url,
      path:
        '/pages/goods/goods?goods_id=' +
        this.data.goods.goods_id +
        '&from_id=' +
        uid +
        pathParam
    });

    return {
      title: title,
      imageUrl: img_url,
      path:
        '/pages/goods/goods?goods_id=' +
        this.data.goods.goods_id +
        '&from_id=' +
        uid +
        pathParam
    };
  },
  /**弹出邀请**/
  openInviteFriends() {
    console.log(this.data.goods.agent_opt);

    wx.navigateTo({
      url: '../help-sale-setting/index?goods_id=' + this.data.goods_id
    });

    // this.setData({
    //   showInviteFriend: true,
    // })
  },

  openShareFriends() {
    let params = {
      goods_id: this.data.goods_id
    };
    this.data.goods.goods_spec.length > 3 ? (params.img_num = 4) : '';
    if (!this.data.shareFriendsImgStart) {
      this.data.shareFriendsImgStart = true;
      util.wx.get('/api/goods/get_goods_card', params).then((res) => {
        if (res.data.code == 200 && res.data.data.path) {
          this.setData({
            shareFriendsImg: res.data.data.path
          });
        }
      });
    }

    this.setData({
      showShareFriendsCard: true
    });
  },
  closeShareFriends() {
    this.setData({
      showShareFriendsCard: false
    });
  },
  closeInviteFriend() {
    this.setData({
      showInviteFriend: false
    });
  },

  //生成帮卖海报
  getHelpPost() {
    wx.showLoading();
    util.wx
      .get('/api/goods/get_goods_helper_card', {
        goods_id: this.data.goods_id
      })
      .then((res) => {
        wx.hideLoading();

        console.log(res.data.code);

        if (res.data.code == 200) {
          this.setData({
            shareFriendsImg: res.data.data.path,
            poster: true,
            showInviteFriend: false
          });
        } else {
          this.setData({
            poster: false,
            showInviteFriend: false
          });

          wx.showToast({
            title: '生成海报失败',
            icon: 'none'
          });
        }
      })
      .catch((e) => {
        wx.showToast({
          title: '生成海报失败',
          icon: 'none'
        });
      });
  },

  handlePoster() {
    this.setData({
      showShareFriendsCard: false,
      poster: !this.data.poster
    });
  },
  savaSelfImages() {
    var _this = this;
    console.log('savaSelfImages', this.data.shareFriendsImg);
    if (this.data.shareFriendsImg) {
      // 用户授权
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {
                _this.getSaveImg(_this.data.shareFriendsImg, _this);
              }
            });
          } else {
            _this.getSaveImg(_this.data.shareFriendsImg, _this);
          }
        }
      });

      this.handlePoster();
    }
  },

  getSaveImg(path, _this) {
    console.log('path', path);
    wx.getImageInfo({
      src: path,
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.path,
          success(result) {
            wx.showToast({
              title: '保存成功',
              icon: 'none'
            });
          }
        });
      },
      fail() {
        console.log(`flag${_this}`);
        _this && _this.getSaveImg(path);
      }
    });
  },

  showGallery(e) {
    const { current } = e.currentTarget.dataset;
    const urls = this.data.goods.content_imgs;

    this.setData({
      previewImgs: {
        current: current,
        urls: urls
      },
      previewImgHidden: false
    });

    this.$wuxGallery = $wuxGallery();

    this.$wuxGallery.show({
      current,
      showDelete: false,
      indicatorDots: true,
      indicatorColor: '#fff',
      indicatorActiveColor: '#04BE02',
      urls,
      cancel() {},
      onTap(current, urls) {
        console.log(current, urls);
        return true;
      },
      onChange(e) {
        console.log(e);
      }
    });
  },

  showGallerySpec(e) {
    const { current } = e.currentTarget.dataset;
    var { urls } = e.currentTarget.dataset;

    urls = urls.map((item) => {
      return item + '?imageMogr2/thumbnail/700x/size-limit/35k!';
    });

    console.log(urls);

    this.$wuxGallery = $wuxGallery();

    this.$wuxGallery.show({
      current,
      showDelete: false,
      indicatorDots: true,
      indicatorColor: '#fff',
      indicatorActiveColor: '#04BE02',
      urls,
      cancel() {},
      onTap(current, urls) {
        console.log(current, urls);
        return true;
      },
      onChange(e) {
        console.log(e);
      }
    });
  },
  //卖家和客户对应不同的地址
  goHomePage() {
    wx.redirectTo({
      url: '../userhome/index?id=' + this.data.store_id
    });
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
    });
  },

  goSendMsg() {
    wx.navigateTo({
      url:
        '../send-msg/index?id=' +
        this.data.goods_id +
        '&name=' +
        this.data.goods.goods_name
    });
  },

  goVisitor() {
    wx.navigateTo({
      url:
        '../fans/index?id=' +
        this.data.goods_id +
        '&name=' +
        this.data.goods.goods_name
    });
  },

  goModifyPrice(e) {
    let supid = e.currentTarget.dataset.id;
    let sellid = e.currentTarget.dataset.goods_id;

    //上级是帮卖
    if (this.data.goods.link_goods.length == 2) {
      wx.navigateTo({
        url: '../help-sale-up/index?is_modify=true&goods_id=' + sellid
      });
    } else {
      wx.navigateTo({
        url:
          '../goods-up/index?is_modify=true&supid=' +
          supid +
          '&sellid=' +
          sellid
      });
    }
  },
  goPublish() {
    wx.redirectTo({
      url: '../publish/publish?goods_id=' + this.data.goods_id
    });
  },

  /**修改当前商品的帮卖价格**/
  goModify() {
    //如果商品上级不是供应商
    if (this.data.goods.supplier_id == 0) {
      wx.navigateTo({
        url: '../help-sale-setting/index?goods_id=' + this.data.goods_id
      });
    } else {
      const supid = this.data.goods.supplier_goods_id;
      const sellid = this.data.goods_id;

      wx.navigateTo({
        url:
          '../goods-up/index?is_modify=true&supid=' +
          supid +
          '&sellid=' +
          sellid
      });
    }
  },

  getShareImg() {
    util.wx
      .get('/api/index/goods_card', {
        goods_id: this.data.goods_id
      })
      .then((res) => {
        this.shareImg = res.data.data.path;
      })
      .catch((e) => {
        return;
      });
  },

  add_access() {
    // if (!app.globalData.userInfo) {
    //     return
    // }
    //提交访问记录
    util.wx
      .get('/api/index/add_access', {
        type: 'goods_detail',
        obj_id: this.data.goods_id,
        user_id: app.globalData.userInfo ? app.globalData.userInfo.user_id : '',
        user_scene: app.globalData.userScene,
        user_phone: app.globalData.userPhone
      })
      .then((res) => {
        this.access_id = res.data.data.access_id;
      })
      .catch((e) => {
        console.log(e);
      });
  },

  getGoodsInfo() {
    console.log('getGoodsInfo');

    util.wx
      .get('/api/goods/get_goods_detail', {
        goods_id: this.data.goods_id,
        from_id: this.data.from_id
      })
      .then((res) => {
        console.log('getGoodsInfo res.data.code', res.data.code == 200);
        if (res.data.code == 200) {
          const d = res.data.data;

          console.log(d);

          util.drawShareFriends(this, d.goods);

          //把数量设为0
          //
          d.goods.goods_spec.forEach((item) => {
            item.item_num = 0;
          });

          // console.log('goods_spec bingen',d.goods.goods_spec)

          // 没有规格图片使用第一张头图
          d.goods.goods_spec.forEach((item) => {
            console.log(
              'item.spec_pic',
              item.spec_pic.length == 0,
              d.goods.goods_images[0].img_url
            );
            if (item.spec_pic.length == 0) {
              item.spec_pic.push(d.goods.goods_images[0].img_url);
            }
          });

          //转换内容数据
          if (d.goods.content) {
            var content = JSON.parse(d.goods.content);
          } else {
            var content = [];
          }

          if (content.length == 0 || content.html == '') {
            content = [];

            content.push({
              type: 'text',
              desc: d.goods.goods_content
            });

            d.goods.content_imgs.forEach((src) => {
              content.push({
                type: 'image',
                src: src
              });
            });
          } else {
            console.log('else', content.html);
          }

          /**如果有满减优惠 显示文字提示**/

          if(d.goods.fullreduce_data ){

            let reduce_txt = ''

            d.goods.fullreduce_data.forEach(item=>{


              reduce_txt+='满'+item.full+'减'+item.reduce +' '

            })

            this.setData({
              reduce_txt : reduce_txt
            })

          }

    
          this.setData({
            content: content,
            goods_content: d.goods.goods_content,
            goods: d.goods,
            'imgs.src': d.goods.goods_images,
            goods_spec:
              d.goods.goods_spec.length == 0
                ? d.goods.goods_images
                : d.goods.goods_spec,
            // hw_data: d.hw_data,
            countdownTime: new Date(d.goods.end_time * 1000).getTime()
          });
          this.setData({
            shareData: {
              cover: this.data.goods.goods_cover,
              title: this.data.goods.goods_name,
              code: this.data.goods.xcx_qrcode
            }
          });
          if (d.goods.is_timelimit == 1) {
            this.wuxCountDown(formatDateTime(d.goods.end_time));
          }

          (this.data.seller = d.goods.user),
            (this.data.store_id = d.goods.store.store_id);

          //显示管理面板

          if (this.data.seller.user_id == app.globalData.userInfo.user_id) {
            console.log('是管理');

            this.setData({
              showPanel: true
            });
          }

          //判断是否是帮卖代理浏览

          if (
            this.data.is_help_sale &&
            app.globalData.userInfo.store_id != d.goods.store.store_id
          ) {
            this.checkIsHelper();
          }
        } else if (res.data.code == 0) {
          wx.showModal({
            title: '亲，已经结束了，下次早点来哦',
            showCancel: false,
            success: () => {
              this.homepage();
            }
          });
        } else {
          wx.showToast({
            title: '商品不存在啦',
            icon: 'none'
          });

          this.homepage();
        }
      })
      .catch((e) => {
        return;
      });
  },
  onHide: function () {
    // 用户查看图片不触发
    if (this.data.imgPreviewFlag) {
      return;
    }

    console.log('用户离开了 onHide');
  },
  setStayTime() {
    //提交访问记录
    if (this.access_id) {
      this.leaveDate = new Date();

      //用户停留时间毫秒
      const userStayTime = this.leaveDate.getTime() - this.enterDate.getTime();

      util.wx.get('/api/index/set_user_staytime', {
        access_id: this.access_id,
        user_staytime: userStayTime
      });
    }
  },
  onLoad: async function (option) {
    if (option.scene) {
      option = decodeURIComponent(option.scene);

      option = option.split('?')[1] || option;

      option = util.url2json(option);
    }

    app.that = this;

    this.enterDate = new Date();

    this.data.goods_id = option.goods_id || option.id || option;
    this.data.from_id = option.from_id || '';

    //url里有帮卖参数 表示邀请帮卖页面 这里首页要判断权限 没有权限的不让看
    if (option.help_sale) {
      this.setData({
        is_help_sale: true
      });
    }

    console.log('option', option);

    this.getShareImg();
    await this.getGoodsInfo();

    this.add_access();

    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
      setTimeout(() => {
        this.setData({
          showAuth: true
        });
      }, 1000);
    }

    var pages = getCurrentPages();

    this.setData({
      menuBarTop: app.globalData.menuBarTop,
      showBackIcon: pages.length > 1 ? true : false
    });
  },
  inputNote(e) {
    this.setData({
      note: e.detail.value
    });
  },
  closeTips() {
    this.setData({
      showMsgTips: false
    });
  },
  rejectAuth() {
    this.setData({
      showAuth: false
    });
  },

  codeHide() {
    this.setData({
      code: false
    });
  },
  ok_i_know() {
    this.setData({
      msgvisible: false
    });
  },
  codeShow() {
    this.setData({
      code: true
    });
  },
  handleCountChange(e) {
    let id = e.target.id;

    this.type = e.detail.type;

    let key = 'goods_spec[' + id + '].item_num';

    this.data.goods_spec[id].item_num = parseInt(e.detail.value);

    let amountMoney = 0;

    let totalNum = 0;

    this.data.goods_spec.forEach((value) => {
      console.log(
        'value.spec_price * 100 * parseInt(value.item_num)',
        value.spec_price * 100 * parseInt(value.item_num)
      );
      amountMoney += value.spec_price * 1000 * parseInt(value.item_num);
      totalNum += value.item_num;
    });

    this.setData({
      [key]: e.detail.value,
      amountMoney: amountMoney / 1000,
      totalNum: totalNum
    });

    console.log('totalNum', this.data.totalNum);
  },
  toPublish() {
    wx.navigateTo({
      url: '../publish/publish'
    });
  },
  addAnimate(e) {
    console.log('this.type', this.type);
    if (this.type === 'plus') {
      this.starPos = {};
      this.starPos['x'] = e.detail.x - 20;
      this.starPos['y'] = e.detail.y - this.data.scrollTop;
      console.log('starPos', this.starPos);
      this.startAnimation();
    }
  },
  cartPanelHide() {
    this.setData({
      cartPanel: false
    });
  },
  //点击参与按钮
  cartPanelShow() {
    console.log('cartPanelShow');

    var hasAdd = false;

    console.log(this.data.goods_spec.length);

    //如果只有一个商品规格
    if (this.data.goods_spec.length <= 1) {
      let value = this.data.goods_spec[0];
      let currentNum = value.item_num == 0 ? '1' : value.item_num;
      this.setData({
        'goods_spec[0].item_num': currentNum,
        amountMoney: (value.spec_price * 100 * currentNum) / 100,
        totalNum: 1
      });

      this.setData({
        cartPanel: true
      });
    } else {
      this.data.goods_spec.forEach((item) => {
        if (item.item_num > 0) {
          hasAdd = true;
          this.setData({
            cartPanel: true
          });
        }
      });

      if (!hasAdd) {
        wx.pageScrollTo({
          scrollTop: this.data.spec_box_top - 100
        });

        this.setData({
          notice: 'notice'
        });

        setTimeout(() => {
          this.setData({
            notice: ''
          });
        }, 2000);
      }
    }
  },
  openMap(e) {
    let goodId = e.currentTarget.dataset.goodId;
    wx.navigateTo({
      url: '../userLocation/index?id=' + goodId
    });
  },
  homepage() {
    const uInfo = app.globalData.userInfo;
    //
    if (!uInfo) {
      return this.setData({
        showAuth: true
      });
    } else if (!!uInfo.store && uInfo.store.store_id) {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (prevPage && prevPage.route == 'pages/home/index') {
        wx.navigateBack();
      } else {
        wx.switchTab({
          url: '../home/index'
        });
      }
    } else {
      wx.redirectTo({
        url: '../user-home/index'
      });
    }
  },
  getUserInfoEvt: function (e) {
    console.log(e);
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return wx.showToast({ title: e.detail.errMsg, icon: 'none' });
    }

    app.globalData.userInfo = e.detail.userInfo;
    wx.showLoading();
    app.getOpenId().then((openid) => {
      app.globalData.openid = openid;
      app
        .login_third(e.detail)
        .then((res) => {
          wx.hideLoading();
          wx.showToast({
            title: '登录成功',
            icon: 'none'
          });

          this.setData({
            showAuth: false
          });

          this.getGoodsInfo();
          this.add_access();
        })
        .catch((e) => console.log(e));
    });
  },
  //购物车抛物线
  startAnimation() {
    this.setData({
      showRoll: 1
    });
    this.busPos = {};
    this.busPos['x'] = 80; //购物车的位置
    this.busPos['y'] = app.globalData.winHeight;

    this.linePos = util.bezier(
      [this.busPos, { x: 82, y: 100 }, this.starPos],
      20
    ).bezier_points;

    console.log('this.linePos', this.linePos);
    var len = this.linePos.length;
    this.timer && clearInterval(this.timer);

    this.timer = setInterval(() => {
      len--;
      this.setData({
        bus_x: this.linePos[len].x,
        bus_y: this.linePos[len].y
      });

      if (len == 0) {
        this.setData({
          showRoll: 0
        });
        clearInterval(this.timer);
      }
    }, 25);
  },
  getOrderUserList(goods_id) {
    orderUsersPage = 1;

    util.wx
      .get('/api/goods/get_minorders_by_goods_id', {
        goods_id: goods_id,
        pagesize: orderUsersLen,
        cpage: orderUsersPage
      })
      .then((res) => {
        orderUsersPage++;

        this.data.orderUsers = res.data.data.order_list;

        this.data._orderUsers_ = [];

        this.data._orderUsers_.push(res.data.data.order_list);

        this.setData({
          _orderUsers_: this.data._orderUsers_,
          orderUsers: this.data.orderUsers
        });
      });
  },
  userpage() {
    wx.navigateTo({
      url: '../orderList/orderList'
    });
  },
  //计算距离
  computeDistance() {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        console.log(res);
        var latitude = res.latitude;
        var longitude = res.longitude;
        var speed = res.speed;
        var accuracy = res.accuracy;

        this.data.sell_address.forEach((value) => {
          const la2 = value.latitude;
          const lo2 = value.longitude;

          let dis = util.distance(latitude, longitude, la2, lo2);

          // //大于3公里
          // if (dis > 3 && this.data.delivery_method == 2) {
          //     setTimeout(() => {
          //         this.setData({
          //             msgvisible: true
          //         })
          //     }, 3000)
          // }
        });
      }
    });
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log('用户离开了onUnload');
    this.setStayTime();
  },

  //预览图片
  imgPreview: function (event) {
    var src = event.currentTarget.dataset.src; //获取data-src
    var imgList = event.currentTarget.dataset.list; //获取data-list
    var _this = this;
    // 打开查看图片预览标识
    this.data.imgPreviewFlag = true;

    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    });
  },
  buy() {
    if (!app.globalData.userInfo) {
      this.setData({
        showAuth: true,
        cartPanel: false
      });

      return;
    }

    //默认选一份

    if (this.data.amountMoney == 0) {
      return $Message({
        content: '请选择数量',
        type: 'warning',
        duration: 5
      });
    }

    let shopcar = this.data.goods_spec.filter((value) => value.item_num > 0);

    wx.setStorage({
      key: 'cart',
      data: shopcar,
      success: () => {
        wx.navigateTo({
          url:
            '../order-confirm/index?goods_id=' +
            this.data.goods.goods_id +
            '&payment_method=' +
            this.data.goods.payment_method +
            '&delivery_method=' +
            this.data.goods.delivery_method +
            '&from_id=' +
            this.data.from_id
        });
      }
    });
  },
  formSubmit: function (e) {
    util.formSubmitCollectFormId.call(this, e);
  },
  calluser(e) {
    wx.makePhoneCall({
      phoneNumber: e.target.dataset.mobile
    });
  },

  // wx.redirectTo({
  //       url: '../publish/publish?copy_id=' + this.data.goods.goods_id
  //   })
  copyGoods() {
    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
      this.setData({
        showAuth: true
      });
      return;
    }

    wx.redirectTo({
      url:
        '../publish/publish?goods_id=' + this.data.goods.goods_id + '&copy=true'
    });
  },
  copyDetail() {
    var price = '\n';
    console.log(this.data.goods_spec);
    this.data.goods_spec.forEach((item, index) => {
      price += item.spec_name + ' \b 💰' + item.spec_price + '元\n';
    });

    var content = '【' + this.data.goods.goods_name + '】' + '\n\n';
    if (this.data.goods.goods_content) {
      content += this.data.goods.goods_content + '\n';
    }

    if (this.data.content.length) {
      this.data.content.forEach((item) => {
        if (item.type == 'text') {
          content += item.desc + '\n';
        }
      });
    }

    content += price;

    wx.setClipboardData({
      data: content,
      success: function (res) {
        wx.showToast({
          title: '文字已复制',
          icon: 'none',
          duration: 2000
        });
      }
    });
  },

  helpSaleUp: function () {
    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
      return this.setData({
        showAuth: true
      });
    }

    //如果是自己
    if (this.data.goods.store.user_id == app.globalData.userInfo.user_id) {
      return wx.showToast({
        title: '您不能自己帮卖自己的商品',
        icon: 'none'
      });
    }

    console.log('helper');

    wx.showLoading();

    util.wx
      .post('/api/helper/add_agent_goods', {
        goods_id: this.data.goods.goods_id
      })
      .then((res) => {
        wx.hideLoading();
        if (res.data.code == 200) {
          wx.redirectTo({
            url: '../help-sale-up/index?goods_id=' + res.data.data
          });
        } else if (res.data.code == 0) {
          this.showApplyModal(res.data.msg);
        } else if (res.data.code == -2000) {
          //没有店铺

          wx.showModal({
            title: '你需要先创建团长主页',
            content: '是否立即创建',
            confirmText: '立即创建',
            confirmColor: '#4bb000',
            success: (res) => {
              if (res.confirm) {
                wx.redirectTo({
                  url: '../create-home/index'
                });
              } else if (res.cancel) {
                console.log('用户点击取消');
              }
            }
          });
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none'
          });
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
  onPageScroll: function (e) {
    if (e.scrollTop > 50 && !this.data.toShowPic) {
      this.setData({
        toShowPic: true
      });
    }

    this.data.scrollTop = e.scrollTop;

    if (!this.timer) {
      this.timer = setTimeout(() => {
        this.setData({
          scrollTop: this.data.scrollTop
        });
        clearTimeout(this.timer);
        this.timer = null;
      }, 200);
    }
  }
});
