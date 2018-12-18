export default class LastMayday {
  palette(config) {
    // console.log('ddd',config)
    const width = config.width || 750; //宽度
    const imgHeight = config.goodsImg.height || 400; //商品图片高度
    const headImgSize = config.headImg.size || 140; //头像尺寸
    const desLeft = config.content.margin || 30; //文章两侧边距
    const qrcodeSize = config.qrcode.size || 300; //二维码尺
    const dpr = config.content.des[0].width ? width / (config.content.des[0].width + desLeft * 2) : 1;
    const topArr = [
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
          top: `${imgHeight - headImgSize / 2}rpx`,
          left: `${width / 2}rpx`,
          width: `${headImgSize}rpx`,
          height: `${headImgSize}rpx`,
          borderRadius: `${headImgSize / 2}rpx`,
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
          top: `${imgHeight + headImgSize / 2 + 10}rpx`,
          left: `${width / 2}rpx`,
          align: 'center',
          color: '#000',
          fontSize: "34rpx",
          lineHeight: '60rpx',
          fontWeight: 'bold'
        }
      },
    ];
    const bottomArr = [
      //二维码
      {
        type: 'image',
        url: config.qrcode.src,
        css: {
          top: `${imgHeight + headImgSize / 2 + 90 + config.height * dpr}rpx`,
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
          top: `${imgHeight + headImgSize / 2 + qrcodeSize + 100 + config.height * dpr}rpx`,
          left: `${width / 2}rpx`,
          align: 'center',
          color: '#999',
          fontSize: "24rpx",
          lineHeight: '30rpx'
        }
      },
    ];
    return ({
      width: `${width}rpx`,
      height: `${imgHeight + headImgSize + config.height * dpr + qrcodeSize + 80}rpx`,
      background: '#fff',
      views: topArr.concat(__content(config.content, imgHeight, headImgSize, width, desLeft, dpr), bottomArr)
    });
  }
}

//商品描述
function __content(content, imgHeight, headImgSize, width, desLeft, dpr){
  let arr = [];

  content.des.forEach((e,i) => {
    let h = 0;
    for( let j = 1; j<= i; j++){
      h+=content.des[j-1].height;
    };
    arr.push({
      type: 'text',
        text: e.txt,
          css: {
          top: `${imgHeight + headImgSize / 2 + 80 + h*dpr}rpx`,
          left: `${desLeft}rpx`,
          color: '#000',
          fontSize: "34rpx",
          width: `${width - desLeft * 2}rpx`,
          maxLines: 6,
          lineHeight: '56rpx'
      }
    })
  });

  return arr;

}


