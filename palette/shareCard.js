import util from '../utils/util';
export default class LastMayday {
  palette() {
    return ({
      width: `${width}rpx`,
      height: '1300rpx',
      background: '#eee',
      views: [
        //商品图片
        {
          type: 'image',
          url: '../../img/banner.jpg',
          css: {
            width: `${width}rpx`,
            height: `${imgHeight}rpx`,
            // mode: 'scaleToFill'
          },
        },
        //头像
        {
          type: 'image',
          url: '/palette/avatar.jpg',
          css: {
            top: `${imgHeight - headImgSize/2}rpx`,
            left: `${width/2}rpx`,
            width: `${headImgSize}rpx`,
            height: `${headImgSize}rpx`,
            borderRadius: `${ headImgSize/2}rpx`,
            borderWidth: '2rpx',
            borderColor: '#fff',
            align: 'center',
          },
        },
        //user name
        {
          type: 'text',
          text: '开心麻麻团',
          css: {
            top: `${imgHeight + headImgSize/2 + 10}rpx`,
            left: `${width/2}rpx`,
            align: 'center',
            color: '#000',
            fontSize: "34rpx",
            lineHeight: '60rpx',
            fontWeight: 'bold'
          }
        },
        //商品描述
        {
          type: 'text',
          text: '商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品商品',
          css: {
            top: `${imgHeight + headImgSize/2 + 80}rpx`,
            left: `${desLeft}rpx`,
            color: '#000',
            fontSize: "34rpx",
            width: `${width - desLeft*2}rpx`,
            maxLines: 6,
            lineHeight: '56rpx'
          }
        },
        //二维码
        {
          type: 'image',
          url: '/palette/avatar.jpg',
          css: {
            top: `${imgHeight + headImgSize / 2 + 90 + 220}rpx`,
            left: `${width / 2}rpx`,
            width: `${qrcodeSize}rpx`,
            height: `${qrcodeSize}rpx`,
            align: 'center',
            mode: 'scaleToFill'
          },
        },
        //长按识别二维码
        {
          type: 'text',
          text: '开心麻麻团',
          css: {
            top: `${imgHeight + headImgSize / 2 + qrcodeSize + 100 + 220}rpx`,
            left: `${width / 2}rpx`,
            align: 'center',
            color: '#999',
            fontSize: "28rpx",
          }
        },

      ],
    });
  }
}

const width = 750; //宽度
const imgHeight = 400; //商品图片高度
const headImgSize = 140; //头像尺寸
const desLeft = 30; //文章两侧边距
const qrcodeSize = 300; //二维码尺寸

// getQrcode()
function getQrcode(){
  util.getQrcode({
    page: 'pages/goods/goods',
    scene: '85'
  })
  .then(res => {
    console.log(res)
  })
  .catch(e => {
    console.log(e)
  })
}

