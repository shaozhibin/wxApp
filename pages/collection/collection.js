const GOODSURL = 'https://v.lehe.com/v7/collection/get_goods'
const COLLECTIONURL = 'https://v.lehe.com/v7/collection/detail'
const COLLECTION = '../collection/collection'
const GOODS = '../goods/goods'

Page({
  data: {
    goodsList: [],
    collectionData: {},
    relatedList: [],
    goodsTotal: 0,
    num: 0,
    p: 1,
    size: 10,
    hidden: true,
    goodsListComplete: false,
    collection_id: ''
  },
  getCollection: function() {
    var self = this
    wx.request({
      url: COLLECTIONURL,
      data: {
        collection_id: self.data.collection_id,
      },
      success: function (res) {
        if (res.data.code == 0) {
          self.setData({
            collectionData: res.data.data,
            relatedList: res.data.data.related
          })
        }
      }
    })
  },
  getGoodsList: function() {
    var self = this
    self.setData({
      hidden: false
    }); 
    wx.request({
      url: GOODSURL, 
      data: {
        collection_id: self.data.collection_id,
        p: self.data.p,
        size: self.data.size
      },
      success: function(res) {
        if(res.data.code == 0){
          self.setData({
            hidden: true,
            goodsList: self.data.goodsList.concat(res.data.data.list),
            num: self.data.num + self.data.size,
            goodsTotal: res.data.data.total
          })
        }
      }
    })
  },
  openGoods: function(e) {
    console.log(e)
    wx.redirectTo({
      url: GOODS
    })
  },
  openCollection: function(e) {
    var collection_id = e.currentTarget.dataset['id']
    wx.redirectTo({
      url: COLLECTION + '?collection_id=' + collection_id
    })
  },
  scroll: function() {
    this.setData({
      p: ++ this.data.p
    })
    if(this.data.num >= this.data.goodsTotal){
      this.setData({
        goodsListComplete: true
      })
      return;
    }
    this.getGoodsList()
  },
  onLoad: function (options) {
    var self = this
    if (options.collection_id){
      this.setData({
        collection_id: options.collection_id
      })
    }
    this.getCollection()
    this.getGoodsList()
  },
  onReady: function () {
  
  },
  onPullDownRefresh: function () {
    console.log(this.data.goodsList.length > 0 && this.data.relatedList.length > 0)
    if (this.data.goodsList.length > 0 && this.data.relatedList.length > 0){
      return;
    }
    //下拉加载需初始化data
    this.setData({
      goodsList: [],
      collectionData: {},
      relatedList: [],
      goodsTotal: 0,
      num: 0,
      p: 1,
      size: 10,
      hidden: true,
      goodsListComplete: false,
      collection_id: ''
    })
    this.getGoodsList()
    this.getCollection()
    wx.stopPullDownRefresh()
  },
  onReachBottom: function () {
    this.scroll()
  },
  onShareAppMessage: function () {
    var self = this
    return {
      title: '专辑',
      desc: '专辑desc!',
      path: '/page/collection/collection?collection_id=' + self.data.collection_id
    }
  }
})