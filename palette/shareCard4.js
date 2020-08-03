export default class LastMayday {
  palette(goods) {
    return ({
      width: `${ wid }px`,
      height: `${ hei }px`,
      background: '#fff',
      views: arr(goods),
    });
  }
}

const wid = 350;
const hei = 280;
function arr(goods){
console.log(goods.goods_cover)
  return [
    // 相片
    {
      type: 'image',
      url: goods.goods_cover,
      css: {
        top: `50px`,
        left: `120px`,
        width: '110px',
        height: '100px',
      },
    },
    //绘制背景边框
    {
      type: 'image',
      url: '/palette/share_side.png',
      css: {
        top: `0px`,
        left: `0px`,
        width: `${wid}px`,
        height: `${hei}px`,
      },
    },
  ];
}


