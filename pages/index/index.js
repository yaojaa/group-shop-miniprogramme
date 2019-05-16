//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userloaction:{

    }
  },
  handleTabBarChange ({ detail }) {
        this.setData({
            current: detail.key
        })

        if(detail.key =='publish'){
           wx.navigateTo({
              url:'../publish-select/index'
            })
        }

        if(detail.key =='home'){
           wx.navigateTo({
              url:'../home/index'
            })
        }
       
  },
  onLoad: function () {

    this.pageNum = 1;
    this.getProList()

    console.log(app.globalData.userInfo);

    util.getUserloaction().then(res=>{
      console.log(res)
      this.setData({
        userloaction:res
      })
    })
      },
  getProList(){


    util.wx.get('/api/user/discover').then(res=>{


      if(res.data.code == 200){
        console.log('getProList')
        this.setData({
          proList:res.data.data.browse_goods
        })
      }
    })
   
  },
  toDetail(e){
    let postId = e.currentTarget.dataset.postId || 58
    wx.navigateTo({
      url: '../goods/goods?goods_id='+postId})
    },
  addGoods() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  },
   /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {
        return util.shareConfig({
            title: '来看看你附近有什么好东西'
          })()
    },
  // onReachBottom(){

  //    ++ this.pageNum

  //    if(this.pageNum <= this.maxPage){
  //     this.getProList();//重新调用请求获取下一页数据 
  //    }

     
  // }

})
