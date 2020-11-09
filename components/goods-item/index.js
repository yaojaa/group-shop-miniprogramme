import { $wuxGallery } from '../../wux/index';
const util = require('../../utils/util.js');
import Dialog from '../../vant/dialog/dialog';
const app = getApp();

Component({
  externalClasses: ['custom-class'],
  properties: {
    item: {
      type: Object,
      //wait、process、finish、error
      value: ''
    }
  },
  options: {},
  relations: {},
  data: {
    expires: '',
    urls: [],
    show: false,
    itemList: []
  },
  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      this.setData({
        expires: this.properties.item.goods_expires,
        itemList: [
          {
            id: 1,
            name:
              this.properties.item.is_recommend == 1
                ? '在主页隐藏'
                : '在主页显示'
          },
          {
            id: 2,
            name: this.properties.item.is_on_sale == 1 ? '下架' : '上架'
          },
          {
            id: 3,
            name: '删除'
          },
          {
            id: 4,
            name: '复制'
          },
          {
            id: 5,
            name: '置顶'
          },
          {
            id: 6,
            name: '取消'
          }
        ]
      });
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    }
  },

  observers: {},
  methods: {
    addListen(e) {
      util.sellerListner();
    },
    handleAction() {
      this.setData({ show: !this.data.show });
    },
    onClose() {
      this.setData({ show: false });
    },

    onSelect(event) {
      const item = event.detail;
      console.log(item);
      if (item.id == 1) {
        this.switchInSite(this.properties.item.is_recommend == 1 ? 0 : 1);
      } else if (item.id == 2) {
        if (this.properties.item.is_on_sale == 1) {
          this.goodsDown(1);
        } else {
          this.goodsUp(1);
        }
      } else if (item.id == 3) {
        this.delGoods();
      } else if (item.id == 4) {
        this.copyGoods();
      } else if(item.id == 5) {
        this.upTop(item);
      } else if(item.id == 6) {
        this.onClose()
      }
    },
    /*下拉菜单*/
    moreAction(e) {
      this.goods_id = e.currentTarget.dataset.id;

      wx.showActionSheet({
        itemList: ['在主页隐藏', '在主页显示', '上架', '下架', '删除', '复制'],
        success: (res) => {
          console.log(res);

          if (res.tapIndex == 0) {
            this.switchInSite(0);
          } else if (res.tapIndex == 1) {
            this.switchInSite(1);
          } else if (res.tapIndex == 2) {
            this.goodsUp(1);
          } else if (res.tapIndex == 3) {
            this.goodsDown(1);
          } else if (res.tapIndex == 4) {
            // 立即结束
            this.delGoods();
          } else if (res.tapIndex == 5) {
            this.copyGoods();
          }
        },
        fail(res) {
          console.log(res.errMsg);
        }
      });
    },

    goodsUp() {
      Dialog.confirm({
        title: '确定要上架此商品吗？',
        asyncClose: true,
        context: this
      })
        .then(() => {
          this.goodsUpDown(1);
          Dialog.close();
        })
        .catch(() => {
          Dialog.close();
        });
    },

    goodsDown() {
      Dialog.confirm({
        title: '确定要下架此商品吗？',
        asyncClose: true,
        context: this
      })
        .then(() => {
          console.log('结束');
          this.goodsUpDown(2);
          Dialog.close();
        })
        .catch(() => {
          console.log('取消');
          Dialog.close();
        });
    },

    //切换个人主页显示
    switchInSite(status) {
      wx.showLoading();
      util.wx
        .post('/api/seller/goods_change_recommend', {
          goods_id: this.data.item.goods_id,
          is_recommend: status
        })
        .then(
          (res) => {
            wx.hideLoading();

            if (res.data.code == 200) {
              const tips = status == 0 ? '主页已隐藏' : '主页已显示';

              wx.showToast({
                title: tips,
                icon: 'none'
              });

              this.setData({
                is_recommend: status
              });

              //父组件接收
              // this.triggerEvent('recommend',{goods_id: this.data.item.goods_id,status})
              this.triggerEvent('updateList');
            } else {
            }
          },
          (res) => {
            wx.hideLoading();

            wx.showToast({
              title: '设置失败请稍后重试',
              icon: 'none'
            });
          }
        );
    },

    goodsOver() {
      Dialog.confirm({
        title: '确定要立即结束吗？',
        asyncClose: true,
        context: this
      })
        .then(() => {
          console.log('结束');
          this.goodsOverGet();
          Dialog.close();
        })
        .catch(() => {
          console.log('取消');
          Dialog.close();
        });
    },

    //置顶
    upTop(s) {
      util.wx
        .post('/api/seller/set_goods_sort', {
          goods_id: this.data.item.goods_id,
        })
        .then((res) => {
          wx.showToast({
            title: '已置顶',
            icon: 'none'
          });
          this.triggerEvent('updateList', s);
        });
    },

    //上下架
    goodsUpDown(s) {
      util.wx
        .post('/api/seller/goods_change_on_sale', {
          goods_id: this.data.item.goods_id,
          is_on_sale: s
        })
        .then((res) => {
          this.triggerEvent('updateList');
        });
    },

    goodsOverGet() {
      wx.showLoading();

      util.wx
        .post('/api/seller/goods_change_endtime', {
          goods_id: this.data.item.goods_id,
          is_time_limit: 1,
          end_time: util.formatTime(new Date())
        })
        .then((res) => {
          console.log(res);

          wx.hideLoading();

          if (res.data.code == 200) {
            wx.showToast({
              title: '修改成功',
              icon: 'none'
            });

            this.setData({
              expires: 3
            });
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none'
            });
          }
        });
    },

    editPrice(e) {
      //供应商 产品ID和商家产品id

      let link_goods = e.currentTarget.dataset.link_goods;
      let goods_id = e.currentTarget.dataset.goods_id;

      if (
        link_goods[1] &&
        link_goods[1].store_id !== app.globalData.userInfo.store_id
      ) {
        wx.navigateTo({
          url: '../help-sale-up/index?is_modify=true&goods_id=' + goods_id
        });
      }

      if (link_goods[0] !== null) {
        wx.navigateTo({
          url:
            '../goods-up/index?is_modify=true&supid=' +
            link_goods[0].goods_id +
            '&sellid=' +
            goods_id
        });
      }
    },

    /**跳转到编辑页面**/

    editPage(e) {
      const { id } = e.currentTarget.dataset;

      wx.redirectTo({
        url: '../publish/publish?goods_id=' + id
      });
    },

    gofans(e) {
      let id = e.currentTarget.dataset.id;
      let name = e.currentTarget.dataset.name;

      wx.navigateTo({
        url: '../fans/index?id=' + id + '&name=' + name
      });
    },

    managePage(e) {
      let id = e.currentTarget.dataset.id;
      let delivery_method = e.currentTarget.dataset.delivery_method;
      let goods_name = e.currentTarget.dataset.name;
      let store_id = app.globalData.userInfo.store.store_id;

      wx.navigateTo({
        url:
          '../ordermanage/list?goods_id=' +
          id +
          '&goods_name=' +
          goods_name +
          '&delivery_method=' +
          delivery_method +
          '&store_id=' +
          store_id
      });
    },
    //复制商品
    copyGoods() {
      wx.redirectTo({
        url:
          '../publish/publish?goods_id=' +
          this.data.item.goods_id +
          '&copy=true'
      });
    },
    //删除商品
    delGoods(e) {
      //api/seller/goods_del

      wx.showModal({
        title: '确定要删除该商品吗？',
        content: '删除后不可恢复',
        success: (res) => {
          if (res.confirm) {
            util.wx
              .post('/api/seller/goods_del', {
                goods_id: this.data.item.goods_id
              })
              .then((res) => {
                if (res.data.code == 200) {
                  wx.showToast({
                    title: '删除成功',
                    icon: 'none'
                  });

                  this.triggerEvent('remove', this.data.item.goods_id);
                } else {
                  wx.showToast({
                    title: res.data.msg,
                    icon: 'none'
                  });
                }
              });
          }
        }
      });
    }
  },
  ready() {}
});
