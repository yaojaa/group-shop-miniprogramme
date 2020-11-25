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
    //绘制背景边框
    {
      type: 'image',
      url: '/palette/share_side.jpg',
      css: {
        top: `0px`,
        left: `0px`,
        width: `${wid}px`,
        height: `${hei}px`,
      },
    },
    // 相片
    {
      type: 'image',
      url: goods.goods_cover,
      css: {
        top: `50px`,
        left: `${wid/2}px`,
        width: '200px',
        height: '160px',
        align: 'center',
        borderRadius: '10px',
        borderWidth: '5px',
        borderColor: '#ccc',
        mode: 'aspectFill',
      },
    },

    {
      type: 'text',
      text: '#绑定商品#',
      css: {
        top: `230px`,
        left: `${wid/2}px`,
        color: '#444',
        fontSize: "26px",
        lineHeight: '60px',
        fontWeight: 'bold',
        align: 'center'
      }
    },
  ];
}


