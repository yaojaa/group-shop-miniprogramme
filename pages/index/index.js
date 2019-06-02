//index.js
const util = require('../../utils/util.js')
const app = getApp()
Page({
  data: {
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    userloaction:{

    },
    proList:[]
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

    this.getProList()
    util.getUserloaction((res)=>{
      console.log('经纬度：',res)
        this.data.latitude = res.latitude,
        this.data.longitude = res.longitude
              this.getProListBylocation()
    }).then(res=>{
      this.setData({
        userloaction:res,
        latitude:res.latitude,
        longitude:res.longitude
      })

      this.getProListBylocation()


    })
      },

  getProList(){


    util.wx.get('/api/user/get_browsed_goods').then(res=>{


      if(res.data.code == 200){
        console.log('getProList')
        this.setData({
          proList:res.data.data.goods
        })
      }
    })
   
  },
  getProListBylocation(){

        util.wx.get('/api/user/discover',{
          latitude:this.data.latitude,
          longitude:this.data.longitude
        }).then(res=>{

      if(res.data.code == 200){


        var alldata = this.data.proList.concat(res.data.data.nearby_goods)
                console.log(alldata)

        this.setData({
          proList:alldata
        })
      }
    })


    
  },
  toDetail(e){
    console.log(e)
    let postId = e.currentTarget.dataset.id || e.target.dataset.id
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
