const app = getApp()
const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog'

Page({
  data: {
    showAuth: false,
    suppList: [],
    helpSaleList: [],
    groupUserList: [],
    isCheck: false,
    showSetting: false,
    fansCount: 0
  },
  onLoad: function (e) {
    //未登录 弹出授权弹窗
    if (!app.globalData.userInfo) {
      this.setData({
        showAuth: true
      })
    }

    this.getMySupp()
    this.getMyHelpSale()
    this.getMyHelpSaleUser()
  },
  //把粉丝设置为管理
  setAdmin(e) {
    const { user_id, user_name, is_admin } = e.target.dataset

    const state_txt = is_admin == 0 ? '设为你的' : '取消'
    const state_txt1 = is_admin == 0 ? '有' : '无'
    let that = this
    wx.showModal({
      title: '确定要将' + user_name + state_txt + '管理员吗？',
      content: '他将' + state_txt1 + '权限帮你操作订单',
      showCancel: true, //是否显示取消按钮
      cancelText: '取消', //默认是“取消”
      confirmText: '确定', //默认是“确定”
      confirmColor: 'green', //确定文字的颜色
      success: function (res) {
        if (!res.cancel) {
          //点击取消,默认隐藏弹框
          util.wx
            .post('/api/store/set_admin', {
              status: is_admin == 0 ? 1 : 0, //1;0
              user_id
            })
            .then((res) => {
              wx.showToast({
                title: '设置成功',
                icon: 'none'
              })
              that.getMyHelpSaleUser()
            })
        }
      },
      fail: function (res) {}, //接口调用失败的回调函数
      complete: function (res) {} //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },

  openSetting() {
    this.setData({
      showSetting: true
    })
  },

  toSupphome(e) {
    const { id, type } = e.currentTarget.dataset
    if (type == 'supplier') {
      wx.navigateTo({
        url: '../supplier-home/index?id=' + id
      })
    } else {
      wx.navigateTo({
        url: '../userhome/index?id=' + id
      })
    }
  },

  /****移除帮卖成员***/
  removeHelper(e) {
    const { agent_status, agent_user, h_store_id } = e.currentTarget.dataset

    const txt = '确认要移除' + agent_user + '吗？'
    let that = this
    Dialog.confirm({
      title: txt,
      context: this,
      confirmButtonText: '确定'
    })
      .then(() => {
        util.wx
          .post('/api/helper/set_helper_status', {
            status: -1, //1通过;2拒绝;(-1删除，暂时不考虑）
            h_store_id
          })
          .then((res) => {
            wx.showToast({
              title: '移除成功！',
              icon: 'none'
            })

            that.getMyHelpSaleUser()
          })
      })
      .catch(() => {
        // on cancel
      })
  },

  audit(e) {
    const {
      agent_status,
      agent_user,
      supplier_agent_id
    } = e.currentTarget.dataset

    const txt = agent_status == 2 ? '确认要通过Ta吗？' : '确认要移除Ta吗？'
    let that = this
    Dialog.confirm({
      title: txt,
      message: agent_user,
      context: this,
      confirmButtonText: '确定'
    })
      .then(() => {
        util.wx
          .post('/api/helper/set_helper_status', {
            status: 2, //1通过;2拒绝;(-1删除，暂时不考虑）
            h_store_id: app.globalData.userInfo.store.store_id
          })
          .then((res) => {
            const txt = agent_status == 2 ? '已通过' : '已拒绝'

            wx.showToast({
              title: txt + agent_user,
              icon: 'none'
            })

            that.getMyHelpSaleUser()
          })
      })
      .catch(() => {
        // on cancel
      })
  },

  //获取我的帮卖成员
  //
  getMyHelpSaleUser() {
    wx.showLoading()
    util.wx
      .get('/api/helper/store_helper_list')
      .then((res) => {
        wx.hideLoading()

        if (res.data.code == 200) {
          this.setData({
            groupUserList: res.data.data.list,
            fansCount: res.data.data.count
          })
        } else {
        }
      })
      .catch((e) => {
        wx.showToast({
          title: '服务器休息一下 请稍后'
        })
      })
  },

  //获取我加入的帮卖店铺
  getMyHelpSale() {
    wx.showLoading()
    util.wx
      .get('/api/helper/joined_store_list')
      .then((res) => {
        wx.hideLoading()

        if (res.data.code == 200) {
          this.data.suppList = this.data.suppList.concat(res.data.data)
          this.setData({
            suppList: this.data.suppList
          })
        } else {
        }
      })
      .catch((e) => {
        wx.showToast({
          title: '服务器休息一下 请稍后'
        })
      })
  },

  getMySupp() {
    wx.showLoading()
    util.wx
      .get('/api/seller/my_supplier_list')
      .then((res) => {
        wx.hideLoading()

        if (res.data.code == 200) {
          this.data.suppList = this.data.suppList.concat(res.data.data.list)
          this.setData({
            suppList: this.data.suppList
          })
        } else {
        }
      })
      .catch((e) => {
        wx.showToast({
          title: '服务器休息一下 请稍后'
        })
      })
  },
  rejectAuth() {
    this.setData({
      showAuth: false
    })
  },
  onShow: function () {
    wx.hideHomeButton()
    wx.hideShareMenu()
  },
  onChange({ detail }) {
    // 需要手动对 show_buyerlist 状态进行更新
    this.setData({ isCheck: detail })
  },
  onShareAppMessage: function (e) {
    const { supplier_id, supplier_name, type, store_id } = e.target.dataset
    const { nickname, user_id } = app.globalData.userInfo

    console.log(type)

    if (type == 'store') {
      var title = nickname + '邀请您加入Ta的帮卖团队'
      var path =
        'pages/acting-apply/index' +
        '?store_id=' +
        app.globalData.userInfo.store.store_id
    } else {
      var title = nickname + '邀请您加入' + supplier_name
      var path =
        'business/pages/acting-apply/index' + '?supplier_id=' + supplier_id
    }

    console.log(path)

    return {
      title: title,
      imageUrl: 'https://static.kaixinmatuan.cn/staticinvitation2.jpg',
      path: path
    }
  }
})
