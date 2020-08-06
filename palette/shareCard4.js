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
        top: `55px`,
        left: `${wid/2}px`,
        width: '130px',
        height: '120px',
        align: 'center',
        borderRadius: '8px',
        borderWidth: '4px',
        borderColor: '#999',
      },
    },

    {
      type: 'text',
      text: '#绑定商品#',
      css: {
        top: `205px`,
        left: `${wid/2}px`,
        color: '#666666',
        fontSize: "24px",
        lineHeight: '60px',
        fontWeight: 'bold',
        align: 'center'
      }
    },
  ];
}


