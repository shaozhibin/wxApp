//index.js
var util = require('../../utils/util.js');
const GOODSDETAILURL = '../goods/goods'

Page({
  data: {
    brandName: '',
    brandId: '',
    goodsList: '',
    brandHeader: '',
    searchFilter: '',
    page: 1
  },
  lower: function (e) {
    var that = this;
    var page = that.data.page;

    this.setData({
      page: ++page
    });
    util.search(this.data.brandId, page, function (data) {
      that.setData({
        goodsList: that.data.goodsList.concat(data.list)
      });
    });
  },
  openGoods: function (e) {
    let goods_id = e.currentTarget.dataset['id']
    wx.redirectTo({
      url: GOODSDETAILURL
    })
  },
  onLoad: function (options) {
    var that = this;
    var brandId = options.brandId;
    that.setData({
      brandId: options.brandId
    });
    //调用应用实例的方法获取全局数据

    // 获取品牌搜索结果
    util.search(brandId, 1, function (data) {
      that.setData({
        brandHeader: data.brand.banner_image.image_middle || 'http://static.lehe.com/higo/bdpseTT/images/brand_default.jpg',
        brandName: data.brand.name,
        goodsList: data.list
      })

      wx.setNavigationBarTitle({
        title: data.brand.name
      })
    });
  }
});
