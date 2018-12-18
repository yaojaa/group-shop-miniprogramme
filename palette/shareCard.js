import util from '../utils/util';
export default class LastMayday {
  palette(config) {
    console.log('ddd',config)
    const width = config.width || 750; //宽度
    const imgHeight = config.goodsImg.height || 400; //商品图片高度
    const headImgSize = config.headImg.size || 140; //头像尺寸
    const desLeft = config.content.margin || 30; //文章两侧边距
    const qrcodeSize = config.qrcode.size || 300; //二维码尺
    return ({
      width: `${width}rpx`,
      height: '1300rpx',
      background: '#fff',
      views: [
        //商品图片
        {
          type: 'image',
          url: config.goodsImg.src,
          css: {
            width: `${width}rpx`,
            height: `${imgHeight}rpx`,
            // mode: 'scaleToFill'
          },
        },
        //头像
        {
          type: 'image',
          url: config.headImg.src,
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
          text: config.userName,
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
        __content(config.content, imgHeight, headImgSize, width, desLeft),
        //二维码
        {
          type: 'image',
          url: config.qrcode.src,
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
          text: config.userName,
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


function __content(content, imgHeight, headImgSize, width, desLeft){
  var obj = null;

  content.des.forEach(e => {
    obj = {
      type: 'text',
        text: e.txt,
          css: {
          top: `${imgHeight + headImgSize / 2 + 80}rpx`,
          left: `${desLeft}rpx`,
          color: '#000',
          fontSize: "34rpx",
          width: `${width - desLeft * 2}rpx`,
          maxLines: 6,
          lineHeight: '56rpx'
      }
    }
  });

  return obj;

}


