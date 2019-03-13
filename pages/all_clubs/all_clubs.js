var app = getApp()
const { $Message } = require('../../component/base/index');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    height:1,
    spinShow: [true, true, true, true, true, true, true, true, true, true, true, true],
    kscreenH: 0, 
    activities: [{ src: 'https://www.xzikeji.com/dikanong/frame/climb.jpeg  ', name: "登山", id: '登山' }, { src: 'https://www.xzikeji.com/dikanong/frame/bike.jpeg  ', name: "自行车", id: '自行车' }, { src: 'https://www.xzikeji.com/dikanong/frame/jianzou.jpg  ', name: "健走", id: '健走' }, { src: 'https://www.xzikeji.com/dikanong/frame/fit.jpeg  ', name: "健身", id: '健身' }, { src: 'https://www.xzikeji.com/dikanong/frame/run.jpeg ', name: "跑步", id: '跑步' }, { src: 'https://www.xzikeji.com/dikanong/frame/basketball.jpg ', name: "篮球", id: '篮球' }, { src: 'https://www.xzikeji.com/dikanong/frame/skidding.jpeg ', name: "轮滑", id: '轮滑' }, { src: 'https://www.xzikeji.com/dikanong/frame/badminton.jpeg ', name: "羽毛球", id: '羽毛球' }, { src: 'https://www.xzikeji.com/dikanong/frame/wangqiu.jpeg ', name: "网球", id: '网球' },{ src: 'https://www.xzikeji.com/dikanong/frame/football.jpeg ', name: "足球", id: '足球' },{ src: 'https://www.xzikeji.com/dikanong/frame/swim.jpeg ', name: "游泳", id: '游泳' }, { src: 'https://www.xzikeji.com/dikanong/frame/huaxue.jpeg ', name: "滑雪", id: '滑雪' }, { src: 'https://www.xzikeji.com/dikanong/frame/pingpong.jpeg ', name: "乒乓球", id: '乒乓球' }],
    src: '/static/images/4.jpg',
    font_name: '运动类别',
    error_content:''
  },
  test(){

  },
  loadSpin(res){
    var index = res.currentTarget.dataset.index
    var spinShow = this.data.spinShow
    spinShow[index] = false
    this.setData({
      spinShow: spinShow
    })
  },
  handleError() {
    var that = this
    $Message({
      content: that.data.error_content,
      type: 'error',
      duration: 3
    })
  },
  error_show(){
    var that = this
    that.setData({
      error_content: '请确保网络状态良好',
    })
    that.handleError()
    var spinShow = [false, false, false, false, false, false, false, false, false, false, false, false]
    this.setData({
      spinShow: spinShow
    })
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
 
    console.log(this)
    var kscreenH = app.globalData.kscreenH
    this.setData({
      kscreenH: kscreenH
    })
    
  },
  
  tap_activities: function (events) {
    console.log(events)
    wx.navigateTo({
      url: '../club/club?club_name=' + events.currentTarget.dataset.clubName,
    })
    console.log(events)
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    var spinShow = [false, false, false, false, false, false, false, false, false, false, false, false]
    setTimeout(function () {
      that.setData({
        spinShow: spinShow
      })
    }, 3000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})