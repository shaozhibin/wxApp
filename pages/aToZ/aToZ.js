const BRANDLISTURL = 'https://v.lehe.com/weapp/brand/a_to_z'
const SEARCHRESULTURL = '../searchResult/searchResult'

var config = {
  data: {
    searchBrand: '',
    searchMsg: '',

    brandIndex: '',
    scrollToItem: '',
    currentIndex: 0,
    brandData: ''
  },

  bindSearchConfirm: function (e) {
    if (e.detail.value && this.listLength == 1) {
      this.navigateToBrand(this.first.id, this.first.name)
    }
  },
  bindSearchInput: function (e) {
    this.setData({
      searchBrand: e.detail.value
    })
    this.brandFilter()

    if (e.detail.value) {
      this.setData({
        searchMsg: this.listLength ? '点击列表进入相关品牌页' : '没有匹配到相关品牌'
      })
    } else {
      this.setData({
        searchMsg: ''
      })
    }
  },

  navigateToBrand: function (brand_id, keyword) {
    wx.navigateTo({
      url: SEARCHRESULTURL + '?keyword=' + keyword + '&brandId=' + brand_id
    })
  },
  search: function (e) {
    let keyword = e.currentTarget.dataset['name']
    let brand_id = e.currentTarget.dataset['id']

    this.navigateToBrand(brand_id, keyword)
  },

  getListFromServer: function () {
    wx.request({
      url: BRANDLISTURL,
      data: {},
      success: (res) => {
        this.setData({
          brandData: res.data.data.list
        })
        this.brandFilter()
      }
    })
  },
  getBrandList: function () {
    this.getListFromServer()
  },
  brandFilter: function () {
    let data = this.data.brandData
    let sort = {}
    let sortIndex = []
    let searchBrand = this.data.searchBrand

    if (searchBrand != '') {
      searchBrand = new RegExp(searchBrand.split('').join('.*?'), 'i')
    }

    this.listLength = 0
    data.forEach((item) => {
      if (searchBrand != '' && !searchBrand.test(item.name)) {
        return;
      }
      this.listLength += 1
      var s = this.firstLetterFormat(item.name)

      if (!sort[s]) {
        sortIndex.push(s.toLocaleUpperCase())
        sort[s] = []
      }

      sort[s].push(item)
    })

    this.first = this.listLength == 1 && sort[sortIndex[0]][0]

    sortIndex.sort()
    if (sortIndex[0] == '#') {
      var sss = sortIndex.shift()
      sortIndex.push(sss)
    }

    this.setData({
      brandSort: sort,
      brandIndex: sortIndex
    })
  },
  firstLetterFormat: function (data) {
    if (!data) return;

    let stringReg = /[A-Za-z]/
    let S = data[0].match(stringReg)

    if (S === null) {
      return '#'
    }

    return S[0]
  },

  setBrandItem: function (index) {
    this.setData({
      scrollToItem: 'brand_' + index
    })
  },
  showBrand: function (e) {
    this.data.currentIndex = e.target.id.replace('picker-', '')
    this.setBrandItem(this.data.currentIndex)
  },
  touchStart: function (e) {
    console.log(e)
    this.data.currentIndex = e.target.id.replace('picker-', '')
    this.setBrandItem(this.data.currentIndex)

    this.setData({
      start: e.touches[0].pageY
    })
  },
  touchMove: function (e) {
    var indexDiff = Math.floor((e.touches[0].pageY - this.data.start) / 14)

    this.setBrandItem(+this.data.currentIndex + indexDiff)
  },

  onLoad: function () {
    this.getBrandList()
  }
};

Page(config);
