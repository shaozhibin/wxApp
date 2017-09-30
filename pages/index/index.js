const FEEDS = 'https://v.lehe.com/v7/home/feeds?client_id=1&cver=7.0.5'

const COLLECTION = '../collection/collection'
const GOODS = '../goods/goods'

Page({
  data: {
    dataList: [],
    goodsTotal: 0,
    num: 0,
    p: 1,
    size: 10,
    hidden: true
  },
  getDataList: function () {
    var self = this
    self.setData({
      hidden: false
    });
    wx.request({
      url: FEEDS,
      data: {
        p: self.data.p,
        size: self.data.size,
      },
      success: function (res) {
        if (res.data.code == 0) {
          self.setData({
            hidden: true,
            dataList: self.data.dataList.concat(res.data.data.list),
            num: self.data.num + self.data.size,
            goodsTotal: res.data.data.total
          })
        }
      }
    })
  },
  openCollection: function(e) {
    var collection_id = e.currentTarget.dataset['id']
    wx.navigateTo({
      url: COLLECTION + '?collection_id=' + collection_id
    })
  },
  openGoods: function(e) {
    wx.navigateTo({
      url: GOODS
    })
  },
  scroll: function () {
    this.setData({
      p: ++this.data.p
    })
    if (this.data.num >= this.data.goodsTotal) return;
    this.getDataList()
  },
  onLoad: function () {
    this.getDataList()
  },
  onReachBottom: function () {
    this.scroll()
  },
  onPullDownRefresh: function () {
    if (this.data.dataList.length > 0) {
      return;
    }
    // 下拉加载需初始化data
    this.setData({
      dataList: [],
      goodsTotal: 0,
      num: 0,
      p: 1,
      size: 10,
      hidden: true
    })
    this.getDataList()
    wx.stopPullDownRefresh()
  }
})