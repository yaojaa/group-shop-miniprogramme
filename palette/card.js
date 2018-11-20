export default class LastMayday {
  palette({ headImg, userName,  date, content, cover,buyCount,headsImgArr }) {
    return ({
      width: `${ wid }rpx`,
      height: `${ hei }rpx`,
      background: '#fff',
      views: topArr({ headImg, userName, date, content,cover}).concat(headArr(headsImgArr,buyCount)),
    });
  }
}

const wid = 750;
const hei = 600;
const startTop = 2;
const startLeft = 2;
const headSize = 66;
function topArr({ headImg, userName, date, content,cover,buyCount }){


    // var realLength = 0, len = content.length, charCode = -1;
    //          for (var i = 0; i < len; i++) {
    //             charCode = content.charCodeAt(i);
    //             console.log(charCode)
    //              if (charCode >= 0 && charCode <= 128){
    //               realLength += 1;
    //              }else if(charCode>50000){
    //               realLength += 1
    //              }
    //              else{
    //              realLength += 2;}
    //          }

  return [

          //商品封面
    {
      type: 'image',
      url: cover,
      css: {
        top: `419rpx`,
        left:  '0rpx',
        width: `${wid/4-13}rpx`,
        height:`${wid/4-13}rpx`,
        borderRadius:`${(wid/4-13)/2}rpx`
      }
    },
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
    //剩余时间：
    {
      type: 'text',
      text: ` 剩余时间：${ date }`,
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
        top: `${startTop + 84}rpx`,
        left:  '0rpx',
        color: '#000',
        fontSize: "34rpx",
        width: `${wid}rpx`,
        maxLines: 6,
        lineHeight: '55rpx'
      }
    }

  ];
}

function headArr(urlsArr,buyCount) {
  let heads = [];
  urlsArr.forEach((e, index) => {
      heads.push({
        type: 'image',
        url: e,
        css: {
          top: '500rpx',
          left: `${ 200  + 70 * index }rpx`,
          width: `${ headSize }rpx`,
          height: `${ headSize }rpx`,
          borderRadius:`${ headSize}rpx`
        },
      })
   
  })

  let txt = '已有'+buyCount+'人参与';
  // if(urlsArr.length == 0){
  //   txt = "一大波人正在赶来...";
  //   tWid = "400rpx";
  // }
  //
  heads.push({
    type: 'text',
    text: txt,
    css: {
      bottom: `80rpx`,
      left: `${wid/4+18}rpx`,
      fontSize: '28rpx',
      color: "#333",
      lineHeight: `${headSize}rpx`,
      maxLines: 1,
    },
  }, )

  return heads;
}

