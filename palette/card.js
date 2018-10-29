export default class LastMayday {
  palette({ headImg, userName,  date, content, headsImgArr }) {
    return ({
      width: `${ wid }rpx`,
      height: `${ hei }rpx`,
      background: '#fff',
      views: topArr({ headImg, userName, date, content}).concat(headArr(headsImgArr)),
    });
  }
}

const wid = 750;
const hei = 600;
const startTop = 2;
const startLeft = 2;
const headSize = 26;
function topArr({ headImg, userName, date, content }){
  return [
    //绘制背景边框
    // {
    //   type: 'rect',
    //   css: {
    //     top: `${startTop}rpx`,
    //     left: `${startLeft}rpx`,
    //     color: '#fff',
    //     borderRadius: '6rpx',
    //     width: `${wid - 2 * startTop}rpx`,
    //     height: `${hei - 2 * startLeft}rpx`,
    //   },
    // },
    //头像
    {
      type: 'image',
      url: headImg,
      css: {
        top: `${startTop + 10}rpx`,
        left: `${20 + startLeft}rpx`,
        width: '50rpx',
        height: '50rpx',
      },
    },
    //用户名
    {
      type: 'text',
      text: userName,
      css: {
        top: `${startTop + 12}rpx`,
        left: `${84 + startLeft}rpx`,
        color: '#333',
        fontSize: "34rpx",
        width: '300rpx',
        lineHeight: "50rpx",
        maxLines: 1,
      },
    },
    //地址
    // {
    //   type: 'text',
    //   text: address,
    //   css: {
    //     top: `${startTop + 40}rpx`,
    //     left: `${260 + startLeft}rpx`,
    //     color: '#333',
    //     fontSize: "30rpx",
    //     width: '100rpx',
    //     maxLines: 1,
    //   },
    // },
    //截团时间
    {
      type: 'text',
      text: ` 截团时间：${ date }`,
      css: {
        top: `${startTop + 16}rpx`,
        right: `${20 + startLeft}rpx`,
        color: '#666',
        fontSize: "28rpx"
      },
    },
    //商品描述
    {
      type: 'text',
      text: content,
      css: {
        top: `${startTop + 86}rpx`,
        left: `${20 + startLeft}rpx`,
        color: '#000',
        fontSize: "34rpx",
        width: `${wid - 40 - 2 * startLeft}rpx`,
        maxLines: 8,
        lineHeight: '48rpx'
      },
    },
  ];
}

function headArr(urlsArr) {
  let heads = [];
  let maxNum = Math.floor((wid - 2 * startLeft - 200) / 30 - 1);
  let flag = "";
  urlsArr.forEach((e, index) => {
    if(index < maxNum){
      heads.push({
        type: 'image',
        url: e,
        css: {
          bottom: `${ startTop }rpx`,
          left: `${ startLeft + 20 + 30 * index }rpx`,
          width: `${ headSize }rpx`,
          height: `${ headSize }rpx`,
        },
      })
    } else if (index == maxNum && urlsArr.length > maxNum) {
      if (maxNum < urlsArr.length) {
        flag = "... ";
      }
    }
  })

  let txt = `${flag}已接${urlsArr.length}人`;
  let tWid = "200rpx";
  if(urlsArr.length == 0){
    txt = "一大波人正在赶来...";
    tWid = "400rpx";
  }

  heads.push({
    type: 'text',
    text: txt,
    css: {
      bottom: `${ startTop + 3 }rpx`,
      left: `${startLeft + 20 + 30 * heads.length}rpx`,
      fontSize: '24rpx',
      color: "#333",
      width: tWid,
      lineHeight: `${headSize}rpx`,
      maxLines: 1,
    },
  }, )

  return heads;
}

