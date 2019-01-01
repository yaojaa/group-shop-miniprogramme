export default class LastMayday {
  palette(config) {
    const width = config.width || 750; //宽度
    const imgHeight = config.goodsImg.height || 400; //商品图片高度
    const headImgSize = config.headImg.size || 140; //头像尺寸
    const desLeft = config.content.margin || 30; //文章两侧边距
    const qrcodeSize = config.qrcode.size || 300; //二维码尺
    const dpr = config.content.des[0].width ? (width - desLeft * 2) / config.content.des[0].width : 1;

    // console.log(config.goodsImg.src)
    
    const topArr = [
      //商品图片
      {
        type: 'image',
        url: config.goodsImg.src,
        css: {
          width: `${width}rpx`,
          height: `${imgHeight}rpx`,
          mode: 'widthFix'
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
          top: `${imgHeight + headImgSize / 2 + 90 + config.height}rpx`,
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
        text: '长按识别二维码',
        css: {
          top: `${imgHeight + headImgSize / 2 + qrcodeSize + 100 + config.height}rpx`,
          left: `${width / 2 - 26}rpx`,
          align: 'center',
          color: '#999',
          fontSize: "24rpx",
          lineHeight: '30rpx'
        }
      },
      {
        type: 'text',
        text: '参与',
        css: {
          top: `${imgHeight + headImgSize / 2 + qrcodeSize + 100 + config.height}rpx`,
          left: `${width / 2 + 64}rpx`,
          color: "#a6e4f7",
          fontSize: "24rpx",
          lineHeight: '30rpx'
        }
      },
    ];
    return ({
      width: `${width}rpx`,
      height: `${imgHeight + headImgSize + config.height + qrcodeSize + 80}rpx`,
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
    let titleStyle = {};
    for( let j = 1; j<= i; j++){
      h += content.des[j-1].height;
    };
    if(i == 0){
      // titleStyle.color = "#a6e4f7";
      titleStyle.fontSize = content.title.fontSize;
      titleStyle.lineHeight = content.title.lineHeight;
      titleStyle.fontWeight = "bold";
    }
    arr.push({
      type: 'text',
        text: e.txt,
        css: {
        top: `${imgHeight + headImgSize / 2 + 80 + h}rpx`,
        left: `${desLeft}rpx`,
        color: titleStyle.color || '#000',
        fontSize: `${titleStyle.fontSize || content.fontSize}rpx`,
        width: `${width - desLeft * 2}rpx`,
        // maxLines: Math.ceil(e.height / content.lineHeight * dpr),
        maxLines: e.lines,
        lineHeight: `${content.lineHeight}rpx`,
        fontWeight: titleStyle.fontWeight || ''
      }
    })
  });

  return arr;

}


