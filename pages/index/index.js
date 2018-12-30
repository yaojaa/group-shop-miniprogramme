//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    name: '甘露园南里二区',
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userloaction:{

    }
  },
  onLoad: function () {
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
    this.setData({
      proList:[

        {
          img:'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4102099873,109096683&fm=27&gp=0.jpg',
          title:'新鲜草莓摄影',
          info:'雾霾严重的如今每天给我的肺部洗洗澡每天吃一个这个建议大家一定要吃',
          km:'0.33KM',
          price:'22',
          user_name:'红叶舞秋山',
          user_avatar:'https://file.iviewui.com/weapp/dist/e5da9fdc97a0b3fb16c115d379820583.jpg',
          img_list:["http://img.daohangwa.com/tmp_08358de6ea6509151b4e2d94ce70d9b43ffecd03b8147578.jpg",
"http://img.daohangwa.com/tmp_10b9e0720386fbc79bee1ad9720bb366bda93d9e31d7b715.jpg"
]

        }

      ]
    })
    // wx.request({
    //   url: 'https://www.easy-mock.com/mock/5b344e59f512b5707142bfaa/groupShop/list',
    //   method:'GET',
    //   success:res => {
    //     this.setData({
    //       proList:res.data.data
    //     })
    //   },
    //   fail:err => {
    //     console.log(err)
    //   }
    // })
  },
  toDetail(e){
    let postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: '../goods/goods?id='+postId,
    })
  },
  addGoods() {
    wx.navigateTo({
      url: '../publish/publish'
    })
  }
})
