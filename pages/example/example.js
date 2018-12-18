import util from '../../utils/util'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    template: {},
    shareCardConfig: {
      width: 750,//默认750
      goodsImg: {
        src: '../../img/banner.jpg',
        height: 400 //默认400
      },
      headImg: {
        src: '/palette/avatar.jpg',
        size: 140, //默认140
      },
      userName: '开心麻团儿',
      content: {
        des: [
          {
            txt: '1111品描述商品描述商商'
          },
          {
            txt: '2222品描述商品描述商品'
          },
        ],  //一个元素一个段落
        margin: 30, //左右边界默认30
      },
      qrcode: {
        src: '',
        url: 'pages/goods/goods',
        id: '85',
        size: 300 //二维码显示尺寸默认300
      }

    },
  },

  onImgOK(e) {
    console.log('imgOk', e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    util.drawShareFriends(this);
  },
});
