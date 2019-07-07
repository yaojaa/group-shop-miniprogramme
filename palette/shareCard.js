export default class LastMayday {
  palette(config) {
    const width = config.width || 750; //宽度
    const imgHeight = config.goodsImg.height || 400; //商品图片高度
    const headImgSize = config.headImg.size || 140; //头像尺寸
    const desLeft = config.content.margin || 30; //文章两侧边距
    const qrcodeSize = config.qrcode.size || 300; //二维码尺
    const dpr = config.content.des[0].width ? (width - desLeft * 2) / config.content.des[0].width : 1;
    const headSize = 66;
    const hB = 20; // 头像下边界

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
          left: `${width / 2 + 20}rpx`,
          width: `${qrcodeSize}rpx`,
          height: `${qrcodeSize}rpx`,
          align: 'left',
          mode: 'scaleToFill'
        },
      },
      //头像覆盖二维码图标
      {
        type: 'image',
        url: config.headImg.src,
        css: {
          top: `${imgHeight + headImgSize / 2 + qrcodeSize/2 - qrcodeSize*4/9/2 + 90 + config.height}rpx`,
          left: `${width / 2 + 20 + qrcodeSize/2}rpx`,
          width: `${qrcodeSize*4/9}rpx`,
          height: `${qrcodeSize*4/9}rpx`,
          align: 'center',
          borderRadius:`${ qrcodeSize*4/9 }rpx`,
          mode: 'scaleToFill'
        },
      },
      //规格
      // {
      //   type: 'text',
      //   text: '¥ ' + config.spec[0].spec_price,
      //   css: {
      //     top: `${imgHeight + headImgSize / 2 + qrcodeSize / 2 + 60 + config.height}rpx`,
      //     left: `${desLeft}rpx`,
      //     align: 'left',
      //     color: '#f00',
      //     fontSize: "60rpx",
      //     lineHeight: '60rpx'
      //   },
      // },
      //长按识别二维码
      // {
      //   type: 'text',
      //   text: '长按识别二维码',
      //   css: {
      //     top: `${imgHeight + headImgSize / 2 + qrcodeSize + 100 + config.height}rpx`,
      //     left: `${(width + qrcodeSize) / 2 - 16}rpx`,
      //     align: 'center',
      //     color: '#999',
      //     fontSize: "24rpx",
      //     lineHeight: '30rpx'
      //   }
      // },
      // {
      //   type: 'text',
      //   text: '参与',
      //   css: {
      //     top: `${imgHeight + headImgSize / 2 + qrcodeSize + 100 + config.height}rpx`,
      //     left: `${(width + qrcodeSize) / 2 + 74}rpx`,
      //     color: "#a6e4f7",
      //     fontSize: "24rpx",
      //     lineHeight: '30rpx'
      //   }
      // },
    ];
    // 规格
    let spec = goodsSpec(config, imgHeight, headImgSize, desLeft, width);
    // 头像
    let buyuser = headArr(config, imgHeight, headImgSize, qrcodeSize, desLeft, headSize, width, hB);
    return ({
      width: `${width}rpx`,
      height: `${imgHeight + headImgSize + config.height + qrcodeSize + buyuser[1] + desLeft + 20}rpx`,
      background: '#fff',
      views: topArr.concat(__content(config.content, imgHeight, headImgSize, width, desLeft, dpr), bottomArr, spec, buyuser[0])
    });
  }
}

//商品描述
function __content(content, imgHeight, headImgSize, width, desLeft, dpr){
  let arr = [];

  content.des.forEach((e,i) => {
    let h = 0;
    let titleStyle = {};
    let t = 0;
    for( let j = 1; j<= i; j++){
      h += content.des[j-1].height;
    };
    if(i == 0){
      // titleStyle.color = "#a6e4f7";
      titleStyle.fontSize = content.title.fontSize;
      titleStyle.lineHeight = content.title.lineHeight;
      titleStyle.fontWeight = "bold";
      t = -10;
    }
    arr.push({
      type: 'text',
        text: e.txt,
        css: {
        top: `${imgHeight + headImgSize / 2 + 80 + h + t}rpx`,
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

// 购买头像

function headArr(config, imgHeight, headImgSize, qrcodeSize, desLeft, headSize, width, hB) {
  let heads = [];
  let m = -15; // 头像右边界
  let _w = width - 2*desLeft + m;
  let _wm = headSize + m; // 头像所占宽度
  config.buyuser = config.buyuser.slice(0, 26)
  config.buyuser.forEach((e, index) => {
      let _h = parseInt(_wm*(index+1)/_w); // 几行头像

      if(_h　< 3){
        heads.push({
          type: 'image',
          url: e.headimg,
          css: {
            top: `${imgHeight + headImgSize / 2 + qrcodeSize + 110 + config.height + _h*(headSize+hB)}rpx`,
            // left: `${desLeft + index * _wm}rpx`,
            left:`${ desLeft + index%parseInt(_w/_wm) * _wm }rpx`,
            width: `${ headSize }rpx`,
            height: `${ headSize }rpx`,
            borderRadius:`${ headSize/2}rpx`,
            borderWidth: '2rpx',
            borderColor: '#fff',
          },
        })
      }   
   
  })

  let H = Math.ceil(_wm*config.buyuser.length/_w) >= 3 ? 3 : Math.ceil(_wm*config.buyuser.length/_w);

  return [heads, H*(headSize+hB)];
}


// 规格
function goodsSpec(config, imgHeight, headImgSize, desLeft, width){
  let spec = [];
  config.spec.forEach((e,i) => {
    let lineHeight = 52;
    if(i < 5){
      spec.push({
        type: 'text',
        text: e.spec_name + '  ¥ ' + e.spec_price,
        css: {
          top: `${imgHeight + headImgSize / 2 + 110 + i*lineHeight + config.height}rpx`,
          left: `${desLeft}rpx`,
          align: 'left',
          color: '#222',
          width: `${width/2 - desLeft}rpx`,
          maxLines: 1,
          fontSize: "30rpx",
          lineHeight: lineHeight + 'rpx'
        },
      })
    }
  })

  return spec;

}
