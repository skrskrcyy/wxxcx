//index.js
//获取应用实例
const app = getApp()
const util = require('../../utils/util.js')
var contactAndGet = require("../../utils/require.js")
const { $Message } = require('../../component/base/index');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 模板数据
    ni:'https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTlpF5euTNx3GEovTlNicmw6XGOj5h8gURN9h5RMicHwdhTTuPPUsTT4zYxAtazSn5rXJD1sQhvOKA7w/132',
    spinShow:true,
    font_name:'信息与活动',
    src:'/static/images/2.jpeg',
    kscreenH:0,
    title: '参加的活动',
    


    error_content: '',
    success_content: '',
    warning_content: '',
 
    
    
    
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    
    user_act: [],
    infoList: [],
    have_infoList: false,
    loadingButton: false,
    showReply: false,
    showCommentDialog_reply: false,
    comment_content_reply: '',
    showCommentDialog_reply_cover: false,
    
    userJoinAct: [],
    loading: true,
    user_act: [],
    have_user_act: false,
    redDelete: -1,
    died: false,
    start_clientX: 0,
    start_clientY: 0,
    current_clientX: 0,
    current_clientY: 0,
    second_start_clientX: 0,
    second_start_clientY: 0,
    second_current_clientX: 0,
    second_current_clientY: 0,
    redOut: -1,
    deadline: [], //用于计算离现在时间是多少
    dead: [], //用于将过期的活动变暗
    red: false,
    delBtnWidth:110,//滑动距离大于180
    list:[],
    list2:[],
    
    
  },
  
  handleSuccess() {
    var that = this
    $Message({
      content: that.data.success_content,
      type: 'success'
    });
  },
  handleWarning() {
    var that = this
    $Message({
      content: that.data.warning_content,
      type: 'warning',
      duration: 4
    });
  },
  handleError() {
    var that = this
    $Message({
      content: that.data.error_content,
      type: 'error',
      duration: 3
    });
  },
  // 滑动平滑出退出活动按钮
  startDelete: function(event) {
    if (event.touches.length == 1) {
      this.setData({
        start_clientX: event.touches[0].clientX,
        start_clientY: event.touches[0].clientY,
      })
    }
  },

  endDelete: function(event) {
    console.log(event)
    if (event.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = event.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.start_clientX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = event.currentTarget.dataset.index;
      var list = this.data.list;
      list[index]= { 'txtStyle': txtStyle };
      //更新列表的状态
      this.setData({
        list: list
      });
      console.log(this.data.list)
    }
   },

  
  



  //点击删除按钮事件
  delItem: function (e) {
    //获取列表中要删除项的下标
    var index = e.target.dataset.index;
    var list = this.data.list;
    //移除列表中下标为index的项
    list.splice(index, 1);
    //更新列表的状态
    this.setData({
      list: list
    });
  },



  // 滑动平滑出删除回复按钮
  startOut: function(event) {
    if (event.touches.length == 1) {
    this.setData({
      second_start_clientX: event.touches[0].clientX,
      second_start_clientY: event.touches[0].clientY,
    })
    }
  },
  
  endMove:function(event){
    console.log(event)
    if (event.changedTouches.length == 1) {
      //手指移动结束后水平位置
      var endX = event.changedTouches[0].clientX;
      //触摸开始与结束，手指移动的距离
      var disX = this.data.second_start_clientX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var txtStyle = disX > delBtnWidth / 2 ? "left:-" + delBtnWidth + "px" : "left:0px";
      //获取手指触摸的是哪一项
      var index = event.currentTarget.dataset.index;
      var list2 = this.data.list2;
      list2[index] = { 'txtStyle': txtStyle };
      //更新列表的状态
      this.setData({
        list2: list2
      });
      

    }
  },

  // 从地图看活动位置
  getloc: function(options) {
    var latitude = parseFloat(options.currentTarget.dataset.latitude)
    var longitude = parseFloat(options.currentTarget.dataset.longitude)
    console.log(latitude)
    console.log(longitude)
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              wx.openLocation({
                latitude: latitude,
                longitude: longitude,
              })
            },
            fail() {
              wx.showModal({
                title: '用户未授权',
                content: '如需正常使用小程序地图定位功能，请点击【前往】选项前往授权',
                confirmText: '前往',
                success(res) {
                  if (res.confirm) {
                    wx.navigateTo({
                      url: "/pages/article/article",
                    })
                  }
                }
              })
            }
          })
        } else {
          wx.openLocation({
            latitude: latitude,
            longitude: longitude,
          })
        }
      }
    })


  },

  click_to_act: function(event) {
    console.log(event.currentTarget.dataset.id)
    wx.navigateTo({
      url: "/pages/detail/detail?id=" + event.currentTarget.dataset.id +'&people='+event.currentTarget.dataset.people,
    })
  },
  toast: function(event) {
    var partyID = event.currentTarget.dataset.partyid
    console.log(event)

    var that = this
    wx.showModal({

      content: '确定退出活动吗',
      success(res) {
        if (res.confirm) {

          var session_id = wx.getStorageSync('id')
          var se = wx.getStorageSync('se')
          if (se) {
            console.log(se)
            var header = {
              'content-type': 'application/x-www-form-urlencoded',
              'Cookie': 'PHPSESSID=' + session_id
            }
            wx.request({
              url: 'https://www.xzikeji.com/dikanong/register3.php',
              method: 'POST',
              header: header,
              data: {
                'se': se,

                'partyID': partyID
              },
              success: function(res) {
                console.log(partyID)
                console.log(res.data)
                that.setData({
                  success_content: '退出成功'
                })
                that.getAct()

              },
              fail:function(){
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
              }
            })
          } else {
            // 登录
            wx.login({ //将userinfo放入globaldata中，还没放入data中
              success: res => {
                // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
                if (res.code) {
                  var codd = res.code;
                  wx.request({
                    url: 'https://www.xzikeji.com/dikanong/index.php',
                    data: {
                      'code': codd
                    },
                    header: {
                      'Content-Type': 'application/json'
                    },
                    success: function(res) {
                      console.log(res.data)
                      // 将重新得到的信息放在缓存里
                      wx.setStorageSync('se', res.data.se)
                      setTimeout(function() {

                        wx.setStorageSync('se', 0)
                      }, 330000)
                      wx.setStorageSync('id', res.data.id)
                      wx.setStorageSync('openid', res.data.openid)
                      /************************** */
                      // 然后提交评论
                      var session_id = wx.getStorageSync('id')
                      var se = wx.getStorageSync('se')
                      console.log(se)
                      var header = {
                        'content-type': 'application/x-www-form-urlencoded',
                        'Cookie': 'PHPSESSID=' + session_id
                      }
                      wx.request({
                        url: 'https://www.xzikeji.com/dikanong/register3.php',
                        method: 'POST',
                        header: header,
                        data: {
                          'se': se,

                          'partyID': partyID
                        },
                        success: function(res) {
                          console.log(partyID)
                          console.log(res.data)
                          that.setData({
                            success_content: '退出成功'
                          })
                          that.handleSuccess()
                          that.getAct()

                        }
                      })
                    },
                    fail: function() {
                      that.setData({
                        error_content: '请确保网络状态良好',
                      })
                      that.handleError()
                    }
                  })
                }
              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
              }
            })
          }

        }
      }
    })
  },


  // 得到该用户的所有报名了的活动
  getAct() {




    var that = this
    var session_id = wx.getStorageSync('id')

    var se = wx.getStorageSync('se')

    if (se) {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }
      wx.request({
        url: 'https://www.xzikeji.com/dikanong/backparty.php',
        method: 'POST',
        header: header,
        data: {
          'se': se
        },
        success: function(res) {
          console.log(res.data)

          if (res.data.dataInform) {
            that.setData({
              user_act: res.data.dataInform,
              have_user_act: true
            })
          } else {
            that.setData({
              have_user_act: false
            })
          }
          // 一串时间逻辑判断
          console.log(that.data.user_act.length)
          var deadline = []
          var dead = []
          var ingtime = []
          for (let i = 0; i < that.data.user_act.length; i++) {
            var t1 = new Date(that.data.user_act[i].time - 0)
            var t2 = new Date()
            console.log(t1)

            //开始比较
            var year1 = t1.getFullYear()
            var month1 = t1.getMonth() + 1
            var date1 = t1.getDate()
            var hour1 = t1.getHours()
            var minute1 = t1.getMinutes()
            

            if(0<=month1 && month1<=8){
              var y = '0'+month1
            }
            else{
              var y = month1
            }
            if(1<=date1&&date1<=9){
              var d = '0'+date1
            }
            else{
              var d = date1
            }
            if(0<=hour1&&hour1<=9){
              var h = '0'+hour1
            }
            else{
              var h =hour1
            }
            if(0<=minute1&&minute1<=9){
              var m = '0'+minute1
            }
            else{
              var m = minute1
            }

            ingtime.push(year1 + '-' + y + '-' + d + ' ' + h + ':' + m+':00')

            var year2 = t2.getFullYear()
            var month2 = t2.getMonth() + 1
            var date2 = t2.getDate()
            var hour2 = t2.getHours()
            var minute2 = t2.getMinutes()
            console.log(year1 - year2)
            console.log(month1 - month2)
            console.log(date1 - date2)
            console.log(hour1 - hour2)
            console.log(minute1 - minute2)

            if (year1 - year2 > 0) {
              dead.push(false)
              continue
            }
            else if (year1 - year2 < 0) {
              dead.push(true)
              continue
            }
            else if (month1 - month2 > 0) {
              dead.push(false)
              continue
            }
            else if (month1 - month2 < 0) {
              dead.push(true)
              continue
            }
            else if (date1 - date2 > 0) {
              dead.push(false)
              continue
            }
            else if (date1 - date2 < 0) {
              dead.push(true)
              continue
            }
            else if (hour1 - hour2 > 0) {
              dead.push(false)
              continue
            }
            else if (hour1 - hour2 < 0) {
              dead.push(true)
              continue
            }
            else if (minute1 - minute2 > 0) {
              dead.push(false)
              continue
            }
            else if (minute1 - minute2 < 0) {
              dead.push(true)
              continue
            }
            else {
              dead.push(false)
            }
          }
          that.setData({
            
            dead: dead,
            ingtime:ingtime
          })

          console.log(that.data.deadline)
          console.log(that.data.dead)
        },
        fail:function(){
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
        }
      })
    } else {
      // 登录
      wx.login({ //将userinfo放入globaldata中，还没放入data中
        success: res => {
          // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
          if (res.code) {
            var codd = res.code;
            wx.request({
              url: 'https://www.xzikeji.com/dikanong/index.php',
              data: {
                'code': codd
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function(res) {
                console.log(res.data)
                // 将重新得到的信息放在缓存里
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

                  wx.setStorageSync('se', 0)
                }, 330000)
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('openid', res.data.openid)
                /************************** */
                // 然后提交评论
                var se = wx.getStorageSync('se')
                var session_id = wx.getStorageSync('id')
                var header = {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': 'PHPSESSID=' + session_id
                }
                wx.request({
                  url: 'https://www.xzikeji.com/dikanong/backparty.php',
                  method: 'POST',
                  header: header,
                  data: {
                    'se': se
                  },
                  success: function(res) {
                    console.log(res.data)
                    if (res.data.dataInform) {
                      that.setData({
                        user_act: res.data.dataInform,
                        have_user_act: true
                      })
                    } else {
                      that.setData({
                        have_user_act: false
                      })
                    }
                    // 一串时间逻辑判断
                    console.log(that.data.user_act.length)
                    var deadline = []
                    var dead = []
                    var ingtime = []
                    for (let i = 0; i < that.data.user_act.length; i++) {
                      var t1 = new Date(that.data.user_act[i].time - 0)
                      var t2 = new Date()
                      console.log(t1)

                      //开始比较
                      var year1 = t1.getFullYear()
                      var month1 = t1.getMonth() + 1
                      var date1 = t1.getDate()
                      var hour1 = t1.getHours()
                      var minute1 = t1.getMinutes()

                      if (0 <= month1 && month1 <= 8) {
                        var y = '0' + month1
                      }
                      else {
                        var y = month1
                      }
                      if (1 <= date1 && date1 <= 9) {
                        var d = '0' + date1
                      }
                      else {
                        var d = date1
                      }
                      if (0 <= hour1 && hour1 <= 9) {
                        var h = '0' + hour1
                      }
                      else {
                        var h = hour1
                      }
                      if (0 <= minute1 && minute1 <= 9) {
                        var m = '0' + minute1
                      }
                      else {
                        var m = minute1
                      }

                      ingtime.push(year1 + '-' + y + '-' + d + ' ' + h + ':' + m + ':00')

                      var year2 = t2.getFullYear()
                      var month2 = t2.getMonth() + 1
                      var date2 = t2.getDate()
                      var hour2 = t2.getHours()
                      var minute2 = t2.getMinutes()
                      console.log(year1 - year2)
                      console.log(month1 - month2)
                      console.log(date1 - date2)
                      console.log(hour1 - hour2)
                      console.log(minute1 - minute2)

                      if (year1 - year2 > 0) {
                        dead.push(false)
                        continue
                      }
                      else if (year1 - year2 < 0) {
                        dead.push(true)
                        continue
                      }
                      else if (month1 - month2 > 0) {
                        dead.push(false)
                        continue
                      }
                      else if (month1 - month2 < 0) {
                        dead.push(true)
                        continue
                      }
                      else if (date1 - date2 > 0) {
                        dead.push(false)
                        continue
                      }
                      else if (date1 - date2 < 0) {
                        dead.push(true)
                        continue
                      }
                      else if (hour1 - hour2 > 0) {
                        dead.push(false)
                        continue
                      }
                      else if (hour1 - hour2 < 0) {
                        dead.push(true)
                        continue
                      }
                      else if (minute1 - minute2 > 0) {
                        dead.push(false)
                        continue
                      }
                      else if (minute1 - minute2 < 0) {
                        dead.push(true)
                        continue
                      }
                      else {
                        dead.push(false)
                      }
                    }
                    that.setData({
                      
                      dead: dead,
                      ingtime:ingtime
                    })

                    console.log(that.data.deadline)

                  }
                })
              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
              }
            })
          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
        }
      })
    }
  },











  location: function() {
    wx.navigateTo({
      url: '../register/register',
    })
  },
  hideCommentDialog(events) {
    this.setData({
      showCommentDialog_reply_cover: false,
      showCommentDialog_reply: false,
      showReply: false
    })
  },
  openReply: function(event) {
    this.setData({
      ID: event.currentTarget.dataset.id,
      commentid: event.currentTarget.dataset.commentid,
      openid: event.currentTarget.dataset.openid,
      showReply: true,
      showCommentDialog_reply_cover: true
    })
  },
  replyToOne: function(event) {
    this.setData({
      showReply: false,
      showCommentDialog_reply: true
    })

  },

  //3.输入回复
  inputCommentReply(event) {
    this.setData({
      comment_content_reply: event.detail.value
    })
  },
  //提交回复的回复
  publishCommentRelpy: function(event) {
    var that = this
    if (this.data.comment_content_reply.length <= 20) {
    var session_id = wx.getStorageSync('id')
    var se = wx.getStorageSync('se')
    if (se) {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }

      if (that.data.comment_content_reply != '') {
      wx.request({
        url: 'https://www.xzikeji.com/dikanong/backcomment1.php',
        method: 'POST',
        header: header,
        data: {
          'commentid': that.data.commentid,
          'se': se,
          'openid': that.data.openid,

          'content': that.data.comment_content_reply
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            success_content: '回复成功'
          })
          that.handleSuccess()
          that.setData({
            showCommentDialog_reply: false,
            showCommentDialog_reply_cover: false
          })
        },
        fail:function(){
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
        }
      })
      } else {
        that.setData({
          warning_content: '回复不能为空'
        })
        that.handleWarning()
      }
    } else {
      // 登录
      wx.login({ //将userinfo放入globaldata中，还没放入data中
        success: res => {
          // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
          if (res.code) {
            var codd = res.code;
            wx.request({
              url: 'https://www.xzikeji.com/dikanong/index.php',
              data: {
                'code': codd
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function(res) {
                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

                  wx.setStorageSync('se', 0)
                }, 330000)
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('openid', res.data.openid)
                // 然后提交评论
                var session_id = wx.getStorageSync('id')
                var se = wx.getStorageSync('se')
                console.log(se)
                var header = {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': 'PHPSESSID=' + session_id
                }
                if (that.data.comment_content_reply != '') {
                wx.request({
                  url: 'https://www.xzikeji.com/dikanong/backcomment1.php',
                  method: 'POST',
                  header: header,
                  data: {
                    'openid': that.data.openid,
                    'se': se,
                    'commentid': that.data.commentid,
                    'content': that.data.comment_content_reply
                  },
                  success: function(res) {
                    console.log(res.data)
                    that.setData({
                      success_content: '回复成功'
                    })
                    that.handleSuccess()
                    that.setData({
                      showCommentDialog_reply: false,
                      showCommentDialog_reply_cover: false
                    })
                  }
                })
                }
                else {
                  that.setData({
                    warning_content: '回复不能为空'
                  })
                  that.handleWarning()
                }

              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
              }
            })
          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
        }
      })
    }
  }
    else {
      that.setData({
        warning_content: '回复失败，内容字数不得超过二十字'
      })
      that.handleWarning()
    }
  },
  // 删除回复
  deleteOne: function(event) {
    this.setData({
      ID: event.currentTarget.dataset.id,
      commentid: event.currentTarget.dataset.commentid,
      openid: event.currentTarget.dataset.openid,

    })
    var ID = event.currentTarget.dataset.id
    var that = this
    var session_id = wx.getStorageSync('id')
    var se = wx.getStorageSync('se')
    if (se) {
      console.log(se)
      var header = {
        'content-type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=' + session_id
      }
      wx.request({
        url: 'https://www.xzikeji.com/dikanong/backcomment1.php',
        method: 'POST',
        header: header,
        data: {
          'ID': that.data.ID
        },
        success: function(res) {
          console.log(res.data)
          that.setData({
            success_content: '删除成功'
          })
          that.handleSuccess()
          that.getCommentToMe()


        },
        fail:function(){
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
        }
      })
    } else {
      // 登录
      wx.login({ //将userinfo放入globaldata中，还没放入data中
        success: res => {
          // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
          if (res.code) {
            var codd = res.code;
            wx.request({
              url: 'https://www.xzikeji.com/dikanong/index.php',
              data: {
                'code': codd
              },
              header: {
                'Content-Type': 'application/json'
              },
              success: function(res) {
                console.log(res.data)
                wx.setStorageSync('se', res.data.se)
                setTimeout(function() {

                  wx.setStorageSync('se', 0)
                }, 330000)
                wx.setStorageSync('id', res.data.id)
                wx.setStorageSync('openid', res.data.openid)
                // 然后提交评论
                var session_id = wx.getStorageSync('id')
                var se = wx.getStorageSync('se')
                console.log(se)
                var header = {
                  'content-type': 'application/x-www-form-urlencoded',
                  'Cookie': 'PHPSESSID=' + session_id
                }
                wx.request({
                  url: 'https://www.xzikeji.com/dikanong/backcomment1.php',
                  method: 'POST',
                  header: header,
                  data: {
                    'ID': that.data.ID
                  },
                  success: function(res) {
                    console.log(res.data)
                    that.setData({
                      success_content: '删除成功'
                    })
                    that.handleSuccess()
                    that.getCommentToMe()

                  }
                })
              },
              fail: function() {
                that.setData({
                  error_content: '请确保网络状态良好',
                })
                that.handleError()
              }
            })
          }
        },
        fail: function() {
          that.setData({
            error_content: '请确保网络状态良好',
          })
          that.handleError()
        }
      })
    }
  },




  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    if(wx.getStorageSync('userInfo')){
      wx.getUserInfo({
        success: function (res) {

          console.log(res.userInfo);
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })

          
        }
      })

    }

    
    var kscreenH = app.globalData.kscreenH
    this.setData({
      kscreenH: kscreenH
    })
    
    
  },
  
  // 登录按钮，并发头像和网名给后台****************************
  GetUserInfo: function(e) {
    var that = this
    
    if (e.detail.userInfo) {
      console.log(e.detail.userInfo)
      
      wx.setStorageSync('userInfo', e.detail.userInfo)
      var userInform = wx.getStorageSync('userInfo')
      this.setData({
        userInfo: userInform,
        hasUserInfo: true
      })

      wx.setStorageSync('nickName', e.detail.userInfo.nickName)
      wx.setStorageSync('avatarUrl', e.detail.userInfo.avatarUrl)
      wx.setStorageSync('gender', e.detail.userInfo.gender)
      
      // 提交用户的头像和网名
      var session_id = wx.getStorageSync('id')
      var se = wx.getStorageSync('se')
      var head = e.detail.userInfo.avatarUrl
      var name = e.detail.userInfo.nickName
      console.log(head)
      console.log(name)


      if (se) {
        console.log(se)
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + session_id
        }
        wx.request({
          url: 'https://www.xzikeji.com/dikanong/login.php',
          method: 'POST',
          header: header,
          data: {
            'head': head,
            'se': se,
            'name': name
          },
          success: function(res) {
            console.log(res.data)
            that.getAct()
            that.getCommentToMe()
          },
          fail:function(){
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
          }
        })
      } else {
        // 登录
        wx.login({ //将userinfo放入globaldata中，还没放入data中
          success: res => {
            // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
            if (res.code) {
              var codd = res.code;
              wx.request({
                url: 'https://www.xzikeji.com/dikanong/index.php',
                data: {
                  'code': codd
                },
                header: {
                  'Content-Type': 'application/json'
                },
                success: function(res) {
                  console.log(res.data)
                  wx.setStorageSync('se', res.data.se)
                  setTimeout(function() {

                    wx.setStorageSync('se', 0)
                  }, 330000)
                  wx.setStorageSync('id', res.data.id)
                  wx.setStorageSync('openid', res.data.openid)
                  // 然后提交评论
                  var session_id = wx.getStorageSync('id')
                  var se = wx.getStorageSync('se')
                  console.log(se)
                  var header = {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': 'PHPSESSID=' + session_id
                  }
                  wx.request({
                    url: 'https://www.xzikeji.com/dikanong/login.php',
                    method: 'POST',
                    header: header,
                    data: {
                      'head': head,
                      'se': se,
                      'name': name
                    },
                    success: function(res) {
                      console.log(res.data)
                      that.getAct()
                      that.getCommentToMe()
                    }
                  })
                },
                fail: function() {
                  that.setData({
                    error_content: '请确保网络状态良好',
                  })
                  that.handleError()
                }
              })
            }
          },
          fail: function() {
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
          }
        })
      }


    }
    this.setData({
      loadingButton: false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this
    setTimeout(function () {
      that.setData({
        spinShow: false
      })
    }, 3000)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  // 得到别人给我们的回复
  getCommentToMe() {
    var that = this
    var userInfo = wx.getStorageSync('userInfo')
    var nickName = wx.getStorageSync('nickName')
    var avatarUrl = wx.getStorageSync('avatarUrl')
    var gender = wx.getStorageSync('gender')
    if (true) {
      // 获得别人给你的回复
      var session_id = wx.getStorageSync('id')
      var se = wx.getStorageSync('se')
      if (se) {
        console.log(se)
        var header = {
          'content-type': 'application/x-www-form-urlencoded',
          'Cookie': 'PHPSESSID=' + session_id
        }
        wx.request({
          url: 'https://www.xzikeji.com/dikanong/contact.php',
          method: 'POST',
          header: header,
          data: {
            'se': se,
          },
          success: function(res) {
            that.setData({
              spinShow: false
            })
            console.log(res.data)
            if (res.data.dataInform) {
              that.setData({
                infoList: res.data.dataInform,
                have_infoList: true
              })
            } else {
              that.setData({
                have_infoList: false
              })
            }

            console.log(that.data.infoList)

          },
          fail:function(){
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
          }
        })
      } else {
        // 登录
        wx.login({ //将userinfo放入globaldata中，还没放入data中
          success: res => {
            // 发送 res.code 到后台rang hou tai 换取 openId, sessionKey, unionId
            if (res.code) {
              var codd = res.code;
              wx.request({
                url: 'https://www.xzikeji.com/dikanong/index.php',
                data: {
                  'code': codd
                },
                header: {
                  'Content-Type': 'application/json'
                },
                success: function(res) {
                  console.log(res.data)
                  wx.setStorageSync('se', res.data.se)
                  setTimeout(function() {

                    wx.setStorageSync('se', 0)
                  }, 330000)
                  wx.setStorageSync('id', res.data.id)
                  wx.setStorageSync('openid', res.data.openid)

                  // 然后提交评论
                  var session_id = wx.getStorageSync('id')
                  var se = wx.getStorageSync('se')
                  console.log(se)
                  var header = {
                    'content-type': 'application/x-www-form-urlencoded',
                    'Cookie': 'PHPSESSID=' + session_id
                  }
                  wx.request({
                    url: 'https://www.xzikeji.com/dikanong/contact.php',
                    method: 'POST',
                    header: header,
                    data: {
                      'se': se,
                    },
                    success: function(res) {
                      that.setData({
                        spinShow: false
                      })
                      console.log(res.data)
                      if (res.data.dataInform) {
                        that.setData({
                          infoList: res.data.dataInform,
                          have_infoList: true
                        })
                      } else {
                        that.setData({
                          have_infoList: false
                        })
                      }
                      console.log(that.data.infoList)

                    }
                  })
                },
                fail: function() {
                  that.setData({
                    error_content: '请确保网络状态良好',
                  })
                  that.handleError()
                }
              })
            }
          },
          fail: function() {
            that.setData({
              error_content: '请确保网络状态良好',
            })
            that.handleError()
          }
        })
      }
    }
  },
  //将存在缓存中的用户信息读出来
  onShow: function() {
    wx.showNavigationBarLoading()
    var that = this
    var userInform = wx.getStorageSync('userInfo')
    console.log(userInform)
    if (userInform) {
      wx.setStorageSync('nickName', userInform.nickName)
      wx.setStorageSync('avatarUrl', userInform.avatarUrl)
      wx.setStorageSync('gender', userInform.gender)
      that.setData({
        userInfo: userInform,
        hasUserInfo: true
      })
      that.getAct()
      that.getCommentToMe()
    } else {
      that.setData({
        have_infoList: false,
        have_user_act: false
      })
    }
    var that = this

    wx.hideNavigationBarLoading()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})