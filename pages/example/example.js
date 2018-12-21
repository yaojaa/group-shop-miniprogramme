import util from '../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgPath:'',
    template: {},
    shareCardConfig: {
      width: 750,
      goodsImg: {
        src: '../../img/banner.jpg',
        height: 380 //默认400
      },
      headImg: {
        // src: '/palette/avatar.jpg',
        size: 140, //默认140
      },
      userName: '开心麻团儿',
      content: {
        des: [],  //一个元素一个段落
        margin: 30, //左右边界默认30
        lineHeight: 56,
        fontSize: 30,
      },
      qrcode: {
        src: '',
        url: 'pages/goods/goods',
        id: '124',
        size: 300 //二维码显示尺寸默认300
      }

    },
  },

  onImgOK(e) {
    this.setData({
      imgPath: e.detail.path
    })
    console.log('imgOk', e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    util.drawShareFriends(this);
  },
});
