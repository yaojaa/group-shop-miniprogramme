const app = getApp()
const util = require('../../utils/util.js')
import Dialog from '../../vant/dialog/dialog';

Page({
  data: {
    showAuth: false,
    suppList: [],
    helpSaleList:[],
    groupUserList:[],
    isCheck:false,
    showSetting:false
  },
  onLoad: function(e) {
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

  openSetting(){
    this.setData({
      showSetting:true
    })
  },

  toSupphome(e) {
    const {id,type} = e.currentTarget.dataset
    if(type=='supplier'){

          wx.navigateTo({
      url: '../supplier-home/index?id=' + id
    })

    }else{

    wx.navigateTo({
      url: '../userhome/index?id=' + id
    })
    }



  },

  //拒绝
  

   audit(e) {

        const {
            agent_status,
            agent_user,
            supplier_agent_id
        } = e.currentTarget.dataset

        const txt = agent_status == 2 ? '确认要通过Ta吗？' : '确认要移除Ta吗？'

        Dialog.confirm({
            title: txt  ,
            message: agent_user,
            context: this,
            confirmButtonText: '确定'
        }).then(() => {

            util.wx.post('/api/helper/set_helper_status', {
                    status: 2, //1通过;2拒绝;(-1删除，暂时不考虑）
                    h_store_id: app.globalData.userInfo.store.store_id
                })
                .then(res => {

        const txt = agent_status == 2 ? '已通过' : '已拒绝'

                    wx.showToast({
                        title: txt+agent_user,
                        icon: 'none'
                    })

                    this.getDetail()

                })

        }).catch(() => {
            // on cancel
        });







    },

  //获取我的帮卖成员
  //
  getMyHelpSaleUser(){

     wx.showLoading()
    util.wx.get('/api/helper/store_helper_list').then(res => {
        wx.hideLoading()

      if(res.data.code == 200){
      this.setData({
        groupUserList: res.data.data
      })
    }else{

    }
    }).catch(e=>{
      wx.showToast({
        title:'服务器休息一下 请稍后'
      })
    })



   

  },


  //获取我加入的帮卖店铺
  getMyHelpSale(){

  
    wx.showLoading()
    util.wx.get('/api/helper/joined_store_list').then(res => {
        wx.hideLoading()

      if(res.data.code == 200){
        this.data.suppList = this.data.suppList.concat(res.data.data)
      this.setData({
        suppList: this.data.suppList
      })
    }else{

    }
    }).catch(e=>{
      wx.showToast({
        title:'服务器休息一下 请稍后'
      })
    })



  },

  getMySupp() {
    wx.showLoading()
    util.wx.get('/api/seller/my_supplier_list').then(res => {
        wx.hideLoading()

      if(res.data.code == 200){

       this.data.suppList = this.data.suppList.concat(res.data.data.list)
      this.setData({
        suppList: this.data.suppList
      })
    }else{

    }
    }).catch(e=>{
      wx.showToast({
        title:'服务器休息一下 请稍后'
      })
    })
  },
  rejectAuth() {
    this.setData({
      showAuth: false
    })
  },
  onShow: function() {
    wx.hideHomeButton()
    wx.hideShareMenu();

},
onChange({ detail }) {
    // 需要手动对 show_buyerlist 状态进行更新
    this.setData({ isCheck: detail });
  },
onShareAppMessage: function(e) {
    const { supplier_id, supplier_name,type ,store_id} = e.target.dataset
    const {nickname,user_id} = app.globalData.userInfo

    console.log(type)

    if(type=='store'){

            var title=nickname + '邀请您加入Ta的帮卖团队' 
            var path = '../acting-apply/index' + '?store_id=' + store_id


    }else{

            var title=nickname + '邀请您加入'+supplier_name 
            var path = 'business/pages/acting-apply/index' + '?supplier_id=' + supplier_id

    }

    console.log(path)


    return {
      title: title ,
      imageUrl: 'https://static.kaixinmatuan.cn/staticinvitation2.jpg',
      path: path
    }
  }
})
