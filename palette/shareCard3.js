export default class LastMayday {
  palette(config) {
    const width = config.width || 750; //宽度
    const imgHeight = 600; //商品图片高度
    const headImgSize = 160; //二维码尺寸
    const desLeft = config.content.margin || 30; //文章两侧边距
    const qrcodeSize = 60; //规格高度
    const dpr = config.content.des[0].width ? (width - desLeft * 2) / config.content.des[0].width : 1;
    const headSize = 66;
    const hB = 20; // 头像下边界

    console.log(config)

    const qrcodeArr = [
      //二维码
      {
        type: 'image',
        // url: config.qrcode.src,
        url: "https://static.kaixinmatuan.cn/cfcd208495d565ef66e7dff9f98764da201908041106007991.png",
        css: {
          top: `${desLeft}rpx`,
          left: `${desLeft}rpx`,
          width: `${headImgSize}rpx`,
          height: `${headImgSize}rpx`,
          align: 'left',
          mode: 'scaleToFill'
        },
      },
      //头像覆盖二维码图标
      // {
      //   type: 'image',
      //   url: config.headImg.src,
      //   css: {
      //     top: `${desLeft + headImgSize/2 - headImgSize*4/9/2}rpx`,
      //     left: `${desLeft + headImgSize/2}rpx`,
      //     width: `${headImgSize*4/9}rpx`,
      //     height: `${headImgSize*4/9}rpx`,
      //     align: 'center',
      //     borderRadius:`${ headImgSize*4/9 }rpx`,
      //     mode: 'scaleToFill'
      //   },
      // },
    ];
    
    const topArr = [
      //头像
      // {
      //   type: 'image',
      //   url: config.headImg.src,
      //   css: {
      //     top: `${desLeft}rpx`,
      //     left: `${desLeft}rpx`,
      //     width: `${headImgSize}rpx`,
      //     height: `${headImgSize}rpx`,
      //     borderRadius: `${headImgSize / 2}rpx`,
      //     borderWidth: '2rpx',
      //     borderColor: '#fff',
      //   },
      // },
      //user name
      {
        type: 'text',
        text: config.userName,
        css: {
          top: `${desLeft + (headImgSize/2-30)/2}rpx`,
          left: `${desLeft + headImgSize + 20}rpx`,
          color: '#000',
          fontSize: "38rpx",
          lineHeight: '60rpx',
          fontWeight: 'bold'
        }
      },
      //发布了一个活动 快来识别二维码参与
      {
        type: 'text',
        text: '邀请您上架转发',
        css: {
          top: `${desLeft + headImgSize/2 + 10}rpx`,
          left: `${desLeft + headImgSize + 20}rpx`,
          color: '#000',
          fontSize: "40rpx",
          lineHeight: '60rpx',
        }
      },
      // 商品标题
      {
        type: 'text',
          text: config.content.des[0].txt,
          css: {
          top: `${ desLeft + headImgSize + hB }rpx`,
          left: `${desLeft}rpx`,
          color: config.content.title.color || '#000',
          fontSize: `${config.content.title.fontSize}rpx`,
          width: `${width - desLeft * 2}rpx`,
          maxLines: config.content.des[0].lines,
          lineHeight: `${config.content.title.lineHeight}rpx`,
          fontWeight: 'bold'
        }
      },
      //商品图片
      {
        type: 'image',
        url: config.goodsImg.src,
        css: {
          top: `${desLeft + headImgSize + 2*hB + config.content.des[0].height}rpx`,
          left: `${desLeft}rpx`,
          width: `${width - 2*desLeft}rpx`,
          height: `${imgHeight}rpx`,
          mode: 'widthFix'
        },
      },
      {
        type: 'text',
        text: '长按识别二维码查看',
        css: {
          top: `${2*desLeft + headImgSize + imgHeight + 2*hB + config.content.des[0].height}rpx`,
          left: `${width/2}rpx`,
          width: `${width - desLeft * 2}rpx`,
          align: 'center',
          color: '#000',
          fontSize: "48rpx",
          lineHeight: '60rpx',
        }
      },

    ];

    return ({
      width: `${width}rpx`,
      height: `${3*desLeft + headImgSize + imgHeight + 2*hB + config.content.des[0].height + qrcodeSize}rpx`,
      background: '#fff',
      views: qrcodeArr.concat(topArr)
    });
  }
}
