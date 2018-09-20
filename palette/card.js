export default class LastMayday {
  palette() {
    return ({
      width: '720rpx',
      height: '576rpx',
      background: '#f7efe3',
      borderRadius: "10px",
      views: [
        {
          type: 'text',
          text: "订购/支付成功",
          css: [{
            top: '10rpx',
            color:'#333',
          }, common],
        },
        { //第一个左侧圆点
          type: 'rect',
          css: {
            left: '-10rpx',
            top: '80rpx',
            color: '#fff',
            borderRadius: '20rpx',
            width: '24rpx',
            height: '24rpx',
          },
        },
        { //第一条分割线
          type: 'rect',
          css: {
            left: '0rpx',
            top: '90rpx',
            color: '#fff',
            width: '720rpx',
            height: '2rpx',
          },
        },
        {// 第一个右侧圆点
          type: 'rect',
          css: {
            right: '-10rpx',
            top: '80rpx',
            color: '#fff',
            borderRadius: '20rpx',
            width: '24rpx',
            height: '24rpx',
          },
        },
        {
          type: 'text',
          text: '草莓味冰淇淋',
          css: [{
            top: '100rpx',
            width: '400rpx',
          }, common, {
            fontSize: "32rpx",
          }],
        },
        {
          type: 'text',
          text: '我设置了maxLines为1，看看会产生什么效果',
          css: [{
            top: `${startTop + 7 * gapSize}rpx`,
            width: '500rpx',
            maxLines: 1,
          }, common],
        },
        _image(0),
        _des(0, '普通'),
        _image(1, 30),
        _des(1, 'rotate: 30'),
        _image(2, 30, '20rpx'),
        _des(2, 'borderRadius: 30rpx'),
        _image(3, 0, '60rpx'),
        _des(3, '圆形'),
        {
          type: 'image',
          url: '/palette/avatar.jpg',
          css: {
            bottom: '40rpx',
            left: '40rpx',
            borderRadius: '50rpx',
            borderWidth: '10rpx',
            borderColor: 'yellow',
            width: '100rpx',
            height: '100rpx',
          },
        },
        {
          type: 'qrcode',
          content: 'https://github.com/Kujiale-Mobile/Painter',
          css: {
            bottom: '40rpx',
            left: '180rpx',
            color: 'red',
            borderWidth: '10rpx',
            borderColor: 'blue',
            width: '120rpx',
            height: '120rpx',
          },
        },
        {
          type: 'rect',
          css: {
            bottom: '40rpx',
            right: '40rpx',
            color: 'green',
            borderRadius: '20rpx',
            borderWidth: '10rpx',
            width: '120rpx',
            height: '120rpx',
          },
        },
        {
          type: 'text',
          text: 'borderWidth',
          css: {
            bottom: '40rpx',
            right: '200rpx',
            color: 'green',
            borderWidth: '2rpx',
          },
        },
      ],
    });
  }
}

const startTop = 50;
const startLeft = 20;
const gapSize = 70;
const common = {
  left: `${startLeft}rpx`,
  fontSize: '40rpx',
};

function _textDecoration(decoration, index, color) {
  return ({
    type: 'text',
    text: decoration,
    css: [{
      top: `${startTop + index * gapSize}rpx`,
      color: color,
      textDecoration: decoration,
    }, common],
  });
}

function _image(index, rotate, borderRadius) {
  return (
    {
      type: 'image',
      url: '/palette/avatar.jpg',
      css: {
        top: `${startTop + 8.5 * gapSize}rpx`,
        left: `${startLeft + 160 * index}rpx`,
        width: '120rpx',
        height: '120rpx',
        rotate: rotate,
        borderRadius: borderRadius,
      },
    }
  );
}

function _des(index, content) {
  const des = {
    type: 'text',
    text: content,
    css: {
      fontSize: '22rpx',
      top: `${startTop + 8.5 * gapSize + 140}rpx`,
    },
  };
  if (index === 3) {
    des.css.right = '60rpx';
  } else {
    des.css.left = `${startLeft + 120 * index + 30}rpx`;
  }
  return des;
}
