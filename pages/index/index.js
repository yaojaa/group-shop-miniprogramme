//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    name: '甘露园南里二区',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    goods_list:[
      { goods_id:88888,
        original_img:'./banner.jpg',
        goods_name: '【抖友同款】车载手机支架 重力感应智能全自动创意财神爷装饰空调出风口卡扣式汽车用多功能导航支架 财神支架-中国红',
        shop_price:998,
        click_count:77
      },
      {
        goods_id: 88888,
        original_img: './banner.jpg',
        goods_name: '小猪佩奇手表带奶片糖佩琪装糖潮流乔治网红社会人手表糖果玩具 粉色佩奇',
        shop_price: 998,
        click_count: 77
      },
      {
        goods_id: 88888,
        original_img: './banner.jpg',
        goods_name: '锐舞 吃鸡神器 手机绝地求生刺激战场游戏手柄辅助外设键盘四指射击 【两个装】合金款★金属按键',
        shop_price: 998,
        click_count: 77
      }
    ]
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
    imgUrls: [
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640',
      'https://j-image.missfresh.cn/img_20180625145444571.jpg?iopcmd=thumbnail&type=4&width=640'
    ]
  },
  onLoad: function () {
    this.getProList()
  },
  getProList(){
    wx.request({
      url: 'https://www.easy-mock.com/mock/5b344e59f512b5707142bfaa/groupShop/list',
      method:'GET',
      success:res => {
        this.setData({
          proList:res.data.data
        })
      },
      fail:err => {
        console.log(err)
      }
    })
  },
  toDetail(e){
    let postId = e.currentTarget.dataset.postId
    wx.navigateTo({
      url: '../goods/goods?id='+postId,
    })
  }
})
