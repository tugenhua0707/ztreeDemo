
// 弹窗实例化
var modalInst2;
var timer;
var globalStatus;
var globalId;
// 时间格式化 根据毫秒数 格式化
var dateFormat = function(date) {
  if (!date) {
    return '';
  }
  var ct = new Date(date),
      cyear = ct.getFullYear(),
      cmonth = ct.getMonth() + 1,
      cdate = ct.getDate(),
      cHour = ct.getHours(),
      ctMinute = ct.getMinutes() < 10 ? ('0' + ct.getMinutes()) : ct.getMinutes(),
      ctSecond = ct.getSeconds() < 10 ? ('0' + ct.getSeconds()) : ct.getSeconds(),
      ctYMD = [cyear, cmonth, cdate].join('-'),
      cHTS = [cHour,ctMinute,ctSecond].join(':');
  var ctYear = ctYMD + ' ' + cHTS;
  return ctYear;
};
var clickRenderCallback = function(allNodesName, treeNode) {
  var arrNames = [];
  if (allNodesName && allNodesName.length) {
    for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
       arrNames.push(allNodesName[i].name);
    }
  }
  // 动态获取元素的内容
  var dynamicGetName = function() {
    var tempNames = [];
    var tempHtml;
    var $parent = $('#' + treeNode.tId + '_span').parents('li');
    $parent.each(function(index, item) {
      var currentId = $(item).attr('id').replace(/[^0-9]+/g, '') - 0;
      if ($('#ztreeId_' + currentId + '_span').find('em').length > 0) {
        tempHtml = $('#ztreeId_' + currentId + '_span').find('em').html();
      } else {
        tempHtml = $('#ztreeId_' + currentId + '_span').html();
      }
      tempNames.push(tempHtml);
    });
    return tempNames.reverse();
  };
  var tempNames = dynamicGetName();
  tempNames[tempNames.length - 1] = "<strong>"+tempNames[tempNames.length - 1]+"</strong>";

  if (allNodesName && allNodesName.length) {
    var emHtml = '<em>' +allNodesName[allNodesName.length - 1].name+ '</em>';
    $(".ztop .title").html(emHtml);

    // 先清空二级标题，然后再赋值
    $('.ztop .stitle').html('');
    if (tempNames.length > 1) {
      $('.ztop .stitle').html(tempNames.join('&nbsp;/&nbsp;'));
    }
  } else {
    $(".ztop .title").html('暂无标题');
  }
  if ($(".ztop .title").find('.update-btn').length < 1 && (treeNode.status != -1)) {
    $(".ztop .title").append('<span class="update-btn" data-tid="'+treeNode.tId+'">修改</span>');
  }
  var iconPlus = $('#' +treeNode.tId + '_span').find('.icon_plus');
  if (iconPlus.attr('data-icon') == 1) {
    iconPlus.attr('data-icon', 0);
    iconPlus.html('-');
  } else {
    iconPlus.attr('data-icon', 1);
    iconPlus.html('+');
  }
  // ajax请求 渲染右边的内容
  var id = (treeNode && treeNode.id) ? treeNode.id : '';
  globalId = id;
  var strHtml = '';
  var status;
  var accType;
  var modifier = '';
  var modifyTime = '';
  // 模拟数据 
  var d = {
    "data": {
        "code": "00030001",
        "createTime": "2017-12-15 19:30:58",
        "creator": "SYSTEM",
        "currIndex": 0,
        "id": 15,
        "leaf": 0,
        "level": 2,
        "modifyTime": "2017-12-15 19:31:02",
        "name": "11",
        "parentId": 7,
        "sonMaxIndex": 2,
        "source": 1,
        "status": 1,
        "subList": []
    },
    "status": 1
  };
  if (d && d.status) {
    if(d.status === 1) {
      var data = d.data;
      if (data) {
        if (data.status === 1) {
          status = '正常';
          globalStatus = 1;
        } else if(data.status === -1) {
          status = '删除';
          globalStatus = -1;
        }
        if (data.modifyTime) {
          modifyTime = data.modifyTime;
        }
        globalName = data.name;
        var ctYear = dateFormat(data.createTime);
        var modifyTime = dateFormat(modifyTime);
        strHtml +=  '<li><div class="title">分类code</div><div class="value">'+data.code+'</div></li>' +
                    '<li><div class="title">分类名称</div><div class="value" id="name">'+data.name+'</div></li>' +
                    '<li><div class="title">状态</div><div class="value" id="status">'+ status +'</div></li>' +
                    '<li><div class="title">创建时间</div><div class="value">'+ctYear+'</div></li>' + 
                    '<li><div class="title">更新时间</div><div class="value">'+modifyTime+'</div></li>';

        $(".zcontent ul").removeClass("no-border");
        $('#ztreeContent').removeClass('hidden').html(strHtml);
        $('.ztree-content .update-btn').attr('data-name', data.name).attr('data-status', status);
      } else {
        strHtml += '<li>暂无内容</li>';
        $('#ztreeContent').removeClass('hidden').html(strHtml);
        $(".zcontent ul").addClass("no-border");
        $('.ztree-content .update-btn').attr('data-name', '').attr('data-status', '');
      }
    } else if(data.status === 0) {
      // 失败
      $('#ztreeContent').removeClass('hidden').html('<li>暂无内容</li>');
      $(".zcontent ul").addClass("no-border");
      $('.ztree-content .update-btn').attr('data-name', '').attr('data-status', '');
    }
  } else {
    // 失败
    $('#ztreeContent').removeClass('hidden').html('<li>暂无内容</li>');
    $(".zcontent ul").addClass("no-border");
    $('.ztree-content .update-btn').attr('data-name', '').attr('data-status', '');
  }
  /*
  $.ajax({
    url: '/bizConf/detail',
    type: 'POST',
    data: {
      id: id
    },
    dataType: 'json',
    success: function(d) {
      if (d && d.status) {
        if(d.status === 1) {
          var data = d.data;
          if (data) {
            if (data.status === 1) {
              status = '正常';
              globalStatus = 1;
            } else if(data.status === -1) {
              status = '删除';
              globalStatus = -1;
            }
            if (data.modifyTime) {
              modifyTime = data.modifyTime;
            }
            globalName = data.name;
            var ctYear = dateFormat(data.createTime);
            var modifyTime = dateFormat(modifyTime);
            strHtml +=  '<li><div class="title">分类code</div><div class="value">'+data.code+'</div></li>' +
                        '<li><div class="title">分类名称</div><div class="value" id="name">'+data.name+'</div></li>' +
                        '<li><div class="title">状态</div><div class="value" id="status">'+ status +'</div></li>' +
                        '<li><div class="title">创建时间</div><div class="value">'+ctYear+'</div></li>' + 
                        '<li><div class="title">更新时间</div><div class="value">'+modifyTime+'</div></li>';

            $(".zcontent ul").removeClass("no-border");
            $('#ztreeContent').removeClass('hidden').html(strHtml);
            $('.ztree-content .update-btn').attr('data-name', data.name).attr('data-status', status);
          } else {
            strHtml += '<li>暂无内容</li>';
            $('#ztreeContent').removeClass('hidden').html(strHtml);
            $(".zcontent ul").addClass("no-border");
            $('.ztree-content .update-btn').attr('data-name', '').attr('data-status', '');
          }
        } else if(data.status === 0) {
          // 失败
          $('#ztreeContent').removeClass('hidden').html('<li>暂无内容</li>');
          $(".zcontent ul").addClass("no-border");
          $('.ztree-content .update-btn').attr('data-name', '').attr('data-status', '');
        }
      } else {
        // 失败
        $('#ztreeContent').removeClass('hidden').html('<li>暂无内容</li>');
        $(".zcontent ul").addClass("no-border");
        $('.ztree-content .update-btn').attr('data-name', '').attr('data-status', '');
      }
    }
  });
  */
};
var newAddCallback = function(zTree, treeId, treeNode, allNodesName) {
  modalInst2.open();
  if (treeNode) {
    $(modalInst2.$modal).find('#sourceId').attr('disabled', true).addClass('disabledCls');
  } else {
    $(modalInst2.$modal).find('#sourceId').attr('disabled', false).removeClass('disabledCls');
  }
  $('.remodal-cancel').removeClass('hidden');
  $(".account-name input").val('');
  $('.modal-tips').addClass('hidden').html('');

  var arrNames = [];
  if (allNodesName && allNodesName.length) {
    for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
       arrNames.push(allNodesName[i].name);
    }
  }
  if (arrNames && arrNames.length) {
    $('.directory span').html(arrNames.join('&nbsp;/&nbsp;'));
  } else {
    $('.directory span').html('');
  }
  $('.m-btn .remodal-cancel').unbind('click').bind('click', function() {
    // 取消操作
    $(".account-name input").val('');
    $('.modal-tips').addClass('hidden').html('');
    if ( treeNode && $("#" + treeNode.tId).length) {
      $("#" + treeNode.tId).removeClass('li_open');
    }
    modalInst2.close();
  });
  function ajaxRequest($this) {
    /*
      parentId: 父级目录ID
      accType ：账户类型：默认为:负债1，3-资产;
      name ：账户名称-简写;
     */
    var parentId = (treeNode && treeNode.id) ? treeNode.id : -1;
    var level = treeNode ? (treeNode.level === 0 ? 1 : (treeNode.level+1)) : 0;
    
    var name = $.trim($('.account-name input').val());
    var source = $('#sourceId').val();

    if (name === '') {
       $('.modal-tips').removeClass('hidden').html('请填写业务名称');
       $this.removeClass('checkSubmitFlag');
       return;
    } else {
      $('.modal-tips').addClass('hidden').html('');
    }
    var nodes = window.zTree.getNodesByFilter(function(node) {
      return node.level === 0
    });
    var isRepeatName;
    var smsg;
    if (treeNode) {
      isRepeatName = window.zSingle.isRepeatName(treeNode, name);
      smsg = '子菜单不能有相同的名称，请重新输入';
    } else {
      isRepeatName = window.zSingle.isRepeatName(treeNode, name, nodes);
      smsg = '菜单不能有相同的名称，请重新输入';
    }
    if(isRepeatName) {
       $('.modal-tips').removeClass('hidden').html(smsg);
       $this.removeClass('checkSubmitFlag');
       return;
    } else {
      $('.modal-tips').addClass('hidden').html('');
    }
    var sonMaxIndex = 0;
    if (treeNode) {
      if ($('#' + treeNode.tId).attr('data-index')) {
        sonMaxIndex = $('#' + treeNode.tId).attr('data-index');
      } else {
        sonMaxIndex = treeNode.sonMaxIndex;
      }
    }
    /*
    var data;
      if (parentId === -1) {
          // 说明是新增一级菜单
          data = [
            {'name': name, 'source': source, 'level': level}
          ];
      } else {
          data = [
              {
                'code': treeNode.code,
                'id': treeNode.id,
                'level': level,
                'source': source,
                'sonMaxIndex': sonMaxIndex
              },
              {
                'name': name,
                'source': source
              }]
      }
    */
    var data = {
      "data": {
          "code": "00020002",
          "createTime": "2017-12-18 10:45:58",
          "creator": "SYSTEM",
          "currIndex": 2,
          "id": 33,
          "level": 2,
          "name": "11",
          "parentId": 6,
          "source": 1,
          "subList": []
      },
      "status": 1
    };
    /*
    $.ajax({
       url: '/bizConf/add',
       type: 'POST',
        contentType : 'application/json',
       dataType: 'json',
       data: JSON.stringify(data),
       timeout: 8000,
       success: function(data) {
         if(data.status === 1) {
           // 成功
           $this.removeClass('checkSubmitFlag');
           modalInst2.close();
           var data = data.data;
          if (treeNode && treeNode.id) { 
            // treeNode.sonMaxIndex = data.currIndex;
            zTree.addNodes(treeNode, {id:data.id, parentId: treeNode.id, name: data.name,code: data.code, sonMaxIndex: data.currIndex});
            var nodes = zTree.getNodesByFilter(function(node) {
              return node.level === 0
            });
            $("#" + treeNode.tId).attr('data-index', data.currIndex);
            $(nodes).each(function(index, item){
              $("#" + item.tId).addClass('margintop14');
              $("#" + item.tId).find('a').addClass('aParent');
              if(!item.subList) {
                $("#" + item.tId).find('span:first-child').addClass('hidden');
              }
            });
            $("#" + treeNode.tId).find('span').eq(0).removeClass('span-add').removeClass('hidden').addClass('span-jian');
          } else {
            zTree.addNodes(null, {id:data.id, parentId: data.parentId, name: data.name,code: data.code, sonMaxIndex: data.currIndex});
            var nodes = zTree.getNodesByFilter(function(node) {
              return node.level === 0
            });
            $("#" + nodes[nodes.length - 1].tId).attr('data-index', data.currIndex);
            $("#" + nodes[nodes.length - 1].tId).find('span:first-child').eq(0).addClass('span-add');
            $(nodes).each(function(index, item){
              $("#" + item.tId).addClass('margintop14');
              $("#" + item.tId).find('a').addClass('aParent');
              $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
            });
          }
         } else {
           // 失败
           $this.removeClass('checkSubmitFlag');
           var errmsg = data.errmsg || '新增失败~';
           $('.modal-tips').removeClass('hidden').html(errmsg);
         }
       },
       error: function(data) {
         // 失败
         $this.removeClass('checkSubmitFlag');
         var errmsg = data.errmsg || '请求超时，请重试~';
         $('.modal-tips').removeClass('hidden').html(errmsg);
       }
    });
    */
    if(data.status === 1) {
       // 成功
       $this.removeClass('checkSubmitFlag');
       modalInst2.close();
       var data = data.data;
      if (treeNode && treeNode.id) { 
        // treeNode.sonMaxIndex = data.currIndex;
        zTree.addNodes(treeNode, {id:data.id, parentId: treeNode.id, name: data.name,code: data.code, sonMaxIndex: data.currIndex});
        var nodes = zTree.getNodesByFilter(function(node) {
          return node.level === 0
        });
        $("#" + treeNode.tId).attr('data-index', data.currIndex);
        $(nodes).each(function(index, item){
          $("#" + item.tId).addClass('margintop14');
          $("#" + item.tId).find('a').addClass('aParent');
          if(!item.subList) {
            $("#" + item.tId).find('span:first-child').addClass('hidden');
          }
        });
        $("#" + treeNode.tId).find('span').eq(0).removeClass('span-add').removeClass('hidden').addClass('span-jian');
      } else {
        zTree.addNodes(null, {id:data.id, parentId: data.parentId, name: data.name,code: data.code, sonMaxIndex: data.currIndex});
        var nodes = zTree.getNodesByFilter(function(node) {
          return node.level === 0
        });
        $("#" + nodes[nodes.length - 1].tId).attr('data-index', data.currIndex);
        $("#" + nodes[nodes.length - 1].tId).find('span:first-child').eq(0).addClass('span-add');
        $(nodes).each(function(index, item){
          $("#" + item.tId).addClass('margintop14');
          $("#" + item.tId).find('a').addClass('aParent');
          $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
        });
      }
     } else {
       // 失败
       $this.removeClass('checkSubmitFlag');
       var errmsg = data.errmsg || '新增失败~';
       $('.modal-tips').removeClass('hidden').html(errmsg);
     }
  }
  $('#data-modal2 .remodal-confirm').unbind('click').bind('click', function() {
     var $this = $(this);
     if ($(this).hasClass('checkSubmitFlag')) {
       return false;
     }
     $this.addClass('checkSubmitFlag');
     timer && clearTimeout(timer);
     timer = setTimeout(function(){
        ajaxRequest($this);
     },200);
  });
};
var cfg = {
  clickRenderCallback: clickRenderCallback,
  newAddCallback: newAddCallback
};
window.onload = function() {
  window.zSingle = new ZTreeSingle(cfg);
  window.setting = {
    view: {
      addHoverDom: window.zSingle.addHoverDom,
      removeHoverDom: window.zSingle.removeHoverDom,
      selectedMulti: false
    },
    edit: {
      enable: true,
      showRemoveBtn: true,
      showRenameBtn: false
    },
    data: {
      simpleData: {
        enable: true,
        idKey: 'id', 
        pIdKey: 'parentId'
      },
      key: {
        name: 'name',
        children: 'subList'
      }
    },
    callback: {
      beforeRemove: window.zSingle.beforeRemove,
      onClick: window.zSingle.zTreeOnClick,
      onExpand: window.zSingle.zTreeOnExpand,
      onCollapse: window.zSingle.zTreeOnCollapse
    }
  };

  // 模拟数据 如下：
  var data = {
    "data": [
      {
        "code": "0001",
        "createTime": "2017-12-15 14:56:53",
        "creator": "SYSTEM",
        "currIndex": 0,
        "id": 1,
        "leaf": 0,
        "level": 1,
        "modifier": "SYSTEM",
        "modifyTime": "2017-12-15 14:57:38",
        "name": "11",
        "parentId": -1,
        "sonMaxIndex": 3,
        "source": 1,
        "status": -1,
        "subList": [
          {
            "code": "00010001",
            "createTime": "2017-12-15 14:56:58",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 2,
            "leaf": 0,
            "level": 2,
            "modifier": "SYSTEM",
            "modifyTime": "2017-12-15 14:57:38",
            "name": "tt",
            "parentId": 1,
            "sonMaxIndex": 3,
            "source": 1,
            "status": -1,
            "subList": [
              {
                "code": "000100010002",
                "createTime": "2017-12-15 14:57:03",
                "creator": "SYSTEM",
                "currIndex": 0,
                "id": 3,
                "leaf": 0,
                "level": 3,
                "modifier": "SYSTEM",
                "modifyTime": "2017-12-15 14:57:35",
                "name": "66",
                "parentId": 2,
                "sonMaxIndex": 0,
                "source": 1,
                "status": -1,
                "subList": []
              },
              {
                "code": "000100010003",
                "createTime": "2017-12-15 14:57:06",
                "creator": "SYSTEM",
                "currIndex": 0,
                "id": 4,
                "leaf": 0,
                "level": 3,
                "modifier": "SYSTEM",
                "modifyTime": "2017-12-15 14:57:38",
                "name": "yqy7",
                "parentId": 2,
                "sonMaxIndex": 0,
                "source": 1,
                "status": -1,
                "subList": []
              }
            ]
          },
          {
            "code": "00010002",
            "createTime": "2017-12-15 14:57:13",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 5,
            "leaf": 0,
            "level": 2,
            "modifier": "SYSTEM",
            "modifyTime": "2017-12-15 14:57:38",
            "name": "uq8u5u",
            "parentId": 1,
            "sonMaxIndex": 0,
            "source": 1,
            "status": -1,
            "subList": []
          },
          {
            "code": "00010003",
            "createTime": "2017-12-15 14:57:29",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 8,
            "leaf": 0,
            "level": 2,
            "modifier": "SYSTEM",
            "modifyTime": "2017-12-15 14:57:38",
            "name": "tquu",
            "parentId": 1,
            "sonMaxIndex": 0,
            "source": 1,
            "status": -1,
            "subList": []
          }
        ]
      },
      {
        "code": "0002",
        "createTime": "2017-12-15 14:57:18",
        "creator": "SYSTEM",
        "currIndex": 0,
        "id": 6,
        "leaf": 0,
        "level": 1,
        "modifier": "SYSTEM",
        "modifyTime": "2017-12-15 14:59:46",
        "name": "et752475427",
        "parentId": -1,
        "sonMaxIndex": 1,
        "source": 1,
        "status": 1,
        "subList": [
          {
            "code": "00020001",
            "createTime": "2017-12-15 14:59:22",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 14,
            "leaf": 0,
            "level": 2,
            "modifier": "SYSTEM",
            "modifyTime": "2017-12-15 15:00:23",
            "name": "ur7u17",
            "parentId": 6,
            "sonMaxIndex": 0,
            "source": 1,
            "status": -1,
            "subList": []
          }
        ]
      },
      {
        "code": "0003",
        "createTime": "2017-12-15 14:57:23",
        "creator": "SYSTEM",
        "currIndex": 0,
        "id": 7,
        "leaf": 0,
        "level": 1,
        "modifyTime": "2017-12-15 19:30:58",
        "name": "qqu8",
        "parentId": -1,
        "sonMaxIndex": 1,
        "source": 1,
        "status": 1,
        "subList": [
          {
            "code": "00030001",
            "createTime": "2017-12-15 19:30:58",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 15,
            "leaf": 0,
            "level": 2,
            "modifyTime": "2017-12-15 19:31:02",
            "name": "11",
            "parentId": 7,
            "sonMaxIndex": 2,
            "source": 1,
            "status": 1,
            "subList": [
              {
                "code": "000300010002",
                "createTime": "2017-12-15 19:31:02",
                "creator": "SYSTEM",
                "currIndex": 0,
                "id": 16,
                "leaf": 0,
                "level": 3,
                "modifyTime": "2017-12-15 19:31:07",
                "name": "22",
                "parentId": 15,
                "sonMaxIndex": 3,
                "source": 1,
                "status": 1,
                "subList": [
                  {
                    "code": "0003000100020003",
                    "createTime": "2017-12-15 19:31:07",
                    "creator": "SYSTEM",
                    "currIndex": 0,
                    "id": 17,
                    "leaf": 0,
                    "level": 4,
                    "name": "33",
                    "parentId": 16,
                    "sonMaxIndex": 0,
                    "source": 1,
                    "status": 1,
                    "subList": []
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "code": "0004",
        "createTime": "2017-12-15 14:58:34",
        "creator": "SYSTEM",
        "currIndex": 0,
        "id": 9,
        "leaf": 0,
        "level": 1,
        "modifyTime": "2017-12-15 14:58:51",
        "name": "ry",
        "parentId": -1,
        "sonMaxIndex": 2,
        "source": 1,
        "status": 1,
        "subList": [
          {
            "code": "00040001",
            "createTime": "2017-12-15 14:58:42",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 11,
            "leaf": 0,
            "level": 2,
            "modifyTime": "2017-12-18 09:52:52",
            "name": "dyqy",
            "parentId": 9,
            "sonMaxIndex": 4,
            "source": 1,
            "status": 1,
            "subList": [
              {
                "code": "000400010002",
                "createTime": "2017-12-15 14:58:46",
                "creator": "SYSTEM",
                "currIndex": 0,
                "id": 12,
                "leaf": 0,
                "level": 3,
                "modifyTime": "2017-12-18 09:53:00",
                "name": "eqyy",
                "parentId": 11,
                "sonMaxIndex": 4,
                "source": 1,
                "status": 1,
                "subList": [
                  {
                    "code": "0004000100020001",
                    "createTime": "2017-12-15 19:40:23",
                    "creator": "SYSTEM",
                    "currIndex": 0,
                    "id": 18,
                    "leaf": 0,
                    "level": 4,
                    "modifyTime": "2017-12-15 19:57:17",
                    "name": "11",
                    "parentId": 12,
                    "sonMaxIndex": 3,
                    "source": 1,
                    "status": 1,
                    "subList": [
                      {
                        "code": "00040001000200010002",
                        "createTime": "2017-12-15 19:40:28",
                        "creator": "SYSTEM",
                        "currIndex": 0,
                        "id": 19,
                        "leaf": 0,
                        "level": 5,
                        "modifyTime": "2017-12-15 20:00:02",
                        "name": "22",
                        "parentId": 18,
                        "sonMaxIndex": 5,
                        "source": 1,
                        "status": 1,
                        "subList": [
                          {
                            "code": "000400010002000100020003",
                            "createTime": "2017-12-15 19:41:16",
                            "creator": "SYSTEM",
                            "currIndex": 0,
                            "id": 20,
                            "leaf": 0,
                            "level": 6,
                            "modifyTime": "2017-12-15 20:01:16",
                            "name": "33",
                            "parentId": 19,
                            "sonMaxIndex": 5,
                            "source": 1,
                            "status": 1,
                            "subList": [
                              {
                                "code": "0004000100020001000200030004",
                                "createTime": "2017-12-15 19:41:22",
                                "creator": "SYSTEM",
                                "currIndex": 0,
                                "id": 21,
                                "leaf": 0,
                                "level": 7,
                                "modifyTime": "2017-12-15 19:58:35",
                                "name": "44",
                                "parentId": 20,
                                "sonMaxIndex": 6,
                                "source": 1,
                                "status": 1,
                                "subList": [
                                    {
                                      "code": "00040001000200010002000300040005",
                                      "createTime": "2017-12-15 19:41:26",
                                      "creator": "SYSTEM",
                                      "currIndex": 0,
                                      "id": 22,
                                      "leaf": 0,
                                      "level": 8,
                                      "name": "55",
                                      "parentId": 21,
                                      "sonMaxIndex": 0,
                                      "source": 1,
                                      "status": 1,
                                      "subList": []
                                    },
                                    {
                                      "code": "00040001000200010002000300040006",
                                      "createTime": "2017-12-15 19:58:35",
                                      "creator": "SYSTEM",
                                      "currIndex": 0,
                                      "id": 27,
                                      "leaf": 0,
                                      "level": 8,
                                      "name": "66",
                                      "parentId": 21,
                                      "sonMaxIndex": 0,
                                      "source": 1,
                                      "status": 1,
                                      "subList": []
                                    }
                                  ]
                                },
                                {
                                  "code": "0004000100020001000200030005",
                                  "createTime": "2017-12-15 20:01:16",
                                  "creator": "SYSTEM",
                                  "currIndex": 0,
                                  "id": 30,
                                  "leaf": 0,
                                  "level": 7,
                                  "name": "551",
                                  "parentId": 20,
                                  "sonMaxIndex": 0,
                                  "source": 1,
                                  "status": 1,
                                  "subList": []
                                }
                            ]
                          },
                          {
                            "code": "000400010002000100020004",
                            "createTime": "2017-12-15 19:58:19",
                            "creator": "SYSTEM",
                            "currIndex": 0,
                            "id": 25,
                            "leaf": 0,
                            "level": 6,
                            "name": "331",
                            "parentId": 19,
                            "sonMaxIndex": 0,
                            "source": 1,
                            "status": 1,
                            "subList": []
                          },
                          {
                            "code": "000400010002000100020005",
                            "createTime": "2017-12-15 20:00:02",
                            "creator": "SYSTEM",
                            "currIndex": 0,
                            "id": 29,
                            "leaf": 0,
                            "level": 6,
                            "name": "3312",
                            "parentId": 19,
                            "sonMaxIndex": 0,
                            "source": 1,
                            "status": 1,
                            "subList": []
                          }
                        ]
                      },
                      {
                        "code": "00040001000200010003",
                        "createTime": "2017-12-15 19:57:17",
                        "creator": "SYSTEM",
                        "currIndex": 0,
                        "id": 24,
                        "leaf": 0,
                        "level": 5,
                        "name": "222",
                        "parentId": 18,
                        "sonMaxIndex": 0,
                        "source": 1,
                        "status": 1,
                        "subList": []
                      }
                    ]
                  },
                  {
                    "code": "0004000100020002",
                    "createTime": "2017-12-15 19:58:29",
                    "creator": "SYSTEM",
                    "currIndex": 0,
                    "id": 26,
                    "leaf": 0,
                    "level": 4,
                    "name": "22",
                    "parentId": 12,
                    "sonMaxIndex": 0,
                    "source": 1,
                    "status": 1,
                    "subList": []
                  },
                  {
                    "code": "0004000100020003",
                    "createTime": "2017-12-15 19:59:51",
                    "creator": "SYSTEM",
                    "currIndex": 0,
                    "id": 28,
                    "leaf": 0,
                    "level": 4,
                    "name": "331",
                    "parentId": 12,
                    "sonMaxIndex": 0,
                    "source": 1,
                    "status": 1,
                    "subList": []
                  },
                  {
                    "code": "0004000100020004",
                    "createTime": "2017-12-18 09:53:00",
                    "creator": "SYSTEM",
                    "currIndex": 0,
                    "id": 32,
                    "leaf": 0,
                    "level": 4,
                    "name": "2212",
                    "parentId": 12,
                    "sonMaxIndex": 0,
                    "source": 1,
                    "status": 1,
                    "subList": []
                  }
                ]
              },
              {
                "code": "000400010003",
                "createTime": "2017-12-15 19:57:04",
                "creator": "SYSTEM",
                "currIndex": 0,
                "id": 23,
                "leaf": 0,
                "level": 3,
                "name": "11",
                "parentId": 11,
                "sonMaxIndex": 0,
                "source": 1,
                "status": 1,
                "subList": []
              },
              {
                "code": "000400010004",
                "createTime": "2017-12-18 09:52:52",
                "creator": "SYSTEM",
                "currIndex": 0,
                "id": 31,
                "leaf": 0,
                "level": 3,
                "name": "111",
                "parentId": 11,
                "sonMaxIndex": 0,
                "source": 1,
                "status": 1,
                "subList": []
              }
            ]
          },
          {
            "code": "00040002",
            "createTime": "2017-12-15 14:58:51",
            "creator": "SYSTEM",
            "currIndex": 0,
            "id": 13,
            "leaf": 0,
            "level": 2,
            "name": "4171",
            "parentId": 9,
            "sonMaxIndex": 0,
            "source": 1,
            "status": 1,
            "subList": []
          }
        ]
      },
      {
        "code": "0005",
        "createTime": "2017-12-15 14:58:38",
        "creator": "SYSTEM",
        "currIndex": 0,
        "id": 10,
        "leaf": 0,
        "level": 1,
        "name": "yrqy71",
        "parentId": -1,
        "sonMaxIndex": 0,
        "source": 1,
        "status": 1,
        "subList": []
      }
    ],
    "status": 1
  };
  /*
  $.ajax({
   url: '/bizConf/list',
   type: 'POST',
   dataType: 'json',
   success: function(data) {
     if(data.status === 1) {
       // 成功
       var zNodes = data.data;
       if (zNodes && zNodes.length) {
          $.fn.zTree.init($("#ztreeId"), setting, zNodes);
          window.zTree = $.fn.zTree.getZTreeObj("ztreeId");
          var nodes = window.zTree.getNodesByFilter(function(node) {
            return node.level === 0
          });
          $(nodes).each(function(index, item){
            $("#" + item.tId).addClass('margintop14');
            $("#" + item.tId).find('span:first-child').addClass('span-add');
            $("#" + item.tId).find('a').addClass('aParent');
            $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
            $("#" + item.tId).attr('data-index', zNodes[index].sonMaxIndex);
            if(!item.subList) {
              // $("#" + item.tId).find('span:first-child').addClass('hidden');
            }
          });
          // 默认选中指定节点并执行事件
          var node = zTree.getNodeByParam("id", nodes[0].id);
          zTree.setting.callback.onClick(null, 'ztreeId', node);
          // 获取所有的节点数据, 是否显示 废弃 文案
          var allNodes = zTree.getNodes();
          window.zSingle.isUseless(allNodes);
       } else {
        $.fn.zTree.init($("#ztreeId"), setting, []);
        window.zTree = $.fn.zTree.getZTreeObj("ztreeId");
       }
     }else {
       // 失败
     }
   },
   error: function(e) {}
  });
  */
  if(data.status === 1) {
     // 成功
     var zNodes = data.data;
     if (zNodes && zNodes.length) {
        $.fn.zTree.init($("#ztreeId"), setting, zNodes);
        window.zTree = $.fn.zTree.getZTreeObj("ztreeId");
        var nodes = window.zTree.getNodesByFilter(function(node) {
          return node.level === 0
        });
        $(nodes).each(function(index, item){
          $("#" + item.tId).addClass('margintop14');
          $("#" + item.tId).find('span:first-child').addClass('span-add');
          $("#" + item.tId).find('a').addClass('aParent');
          $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
          $("#" + item.tId).attr('data-index', zNodes[index].sonMaxIndex);
          if(!item.subList) {
            // $("#" + item.tId).find('span:first-child').addClass('hidden');
          }
        });
        // 默认选中指定节点并执行事件
        var node = zTree.getNodeByParam("id", nodes[0].id);
        zTree.setting.callback.onClick(null, 'ztreeId', node);
        // 获取所有的节点数据, 是否显示 废弃 文案
        var allNodes = zTree.getNodes();
        window.zSingle.isUseless(allNodes);
     } else {
      $.fn.zTree.init($("#ztreeId"), setting, []);
      window.zTree = $.fn.zTree.getZTreeObj("ztreeId");
     }
   }else {
     // 失败
   }
}
$(function(){
  modalInst2 = $('[data-remodal-id=modal2]').remodal();
  var zNodes = [];
  $.fn.zTree.init($("#ztreeId"), window.setting, zNodes);
  window.zTree = $.fn.zTree.getZTreeObj("ztreeId"); 
  $(".tbj-nav-list li").eq(0).addClass('current');
  // 新增父节点
  $(document).delegate("#add-btn", 'click', function() {
    window.zSingle.newAddCallback(window.zTree, "ztreeId");
  });
  $('.m-btn .remodal-cancel').bind('click', function() {
    modalInst2.close();
  });
  $("#j-modal .remodal-confirm").bind('click', function(){
    modalInst.close();
  });
  // 动态的给ztree设置高度
  $("#ztreeId").css({"height": $(window).height() - 122 + 'px'});
  
  // 设置高度
  // var ch = $('.sidebar').height();
  // $("#container").css({'height': ch - 12 + 'px'});
 // $("#ztreeId").css({'height': ch - 104 + 'px'});
  $('.ztree-content').css({'height': $(document).height()});
  $(window).resize(function(){
    $('.ztree-content').css({'height': $(document).height()});
    // var ch = $('.sidebar').height();
   // $("#container").css({'height': ch - 12 + 'px'});
   //  $("#ztreeId").css({'height': ch - 104 + 'px'});
  });
  // 菜单的展开与收缩效果
  var containerWrap = $('.account_page')[0],
    leftWrap = $('.ztree-container')[0],
    rightWrap = $('.ztree-content')[0],
    oLine = $('.catalog-line')[0];
  if (oLine) {
    oLine.onmousedown = function(e) {
      var disX = e.clientX;
      oLine.left = oLine.offsetLeft;
      document.onmousemove = function(e) {
        var foldWidth = oLine.left + (e.clientX - disX);
        var targetName = e.target || e.srcElement;
        var maxT = containerWrap.clientWidth - oLine.offsetWidth;
        oLine.style.margin = 0;
        foldWidth < 220 && (foldWidth = 220);
        foldWidth > maxT && (foldWidth = maxT);
        oLine.style.left = leftWrap.style.width = foldWidth + 'px';
        rightWrap.style.width = containerWrap.clientWidth - foldWidth + 'px';
        $(rightWrap).css({'margin-left': foldWidth});
        return false;
      };
      document.onmouseup = function() {
        document.onmousemove = null;
        document.onmouseup = null;
        oLine.releaseCapture && oLine.releaseCapture();
      }
      oLine.setCapture && oLine.setCapture();
      return false;
    }
  }
  $(document).on('click', '.j-save', function() {
    var delUrl = $('#ztreeId').attr('data-del-url');
    var name = $('.tb-right-content .tb-input').val();
    // var status = $('#selectId').val();
    var data = {"data":true,"status":1};
    /*
    $.ajax({
      url: delUrl,
      type: 'POST',
      dataType: 'json',
      timeout: 8000,
      data: {
        "id": globalId,
        "name": name
        // "source": status
      },
      success: function(data) {
        if (data.status === 1) {
          // 成功
          // modalInstDel.open();
          var msg = '操作成功';
          // $("#j-modal_del p").html(msg);
          $('.tb-right-menu').removeClass('right-menu-open');

            layer.msg(msg, {
                icon: 6,
                time: 2000
            },function () {
              $("#ztreeContent #name").html(name);
              $('.ztop .title em').html(name);
              $('.ztop .stitle strong').html(name);
              var tid = $('.update-btn').attr('data-tid');
              if ($("#"+tid+"_span").find('em').length > 0) {
                $("#"+tid+"_span").find('em').html(name);
              } else {
                $("#"+tid+"_span").html(name);
                $("#"+tid+"_a").attr('title', name);
              }
            });
        } else if(data.status === 0) {
          // 失败
          var errmsg = '操作失败';
          // modalInstDel.open();
          // $("#j-modal_del p").html(errmsg);

            layer.msg(msg, {
                icon: 5,
                time: 2000
            },function () {
               console.log(errmsg);
            });
        }
      },
      error: function(d) {
        // 失败
        var errmsg = d.msg || '请求失败,请重试';
        modalInstDel.open();
        $("#j-modal_del p").html(errmsg);
        $('#j-modal .remodal-confirm').removeClass('none');
        $('#j-modal .remodal-confirm2').addClass('none');
      }
    });
    */
    if (data.status === 1) {
      // 成功
      // modalInstDel.open();
      var msg = '操作成功';
      // $("#j-modal_del p").html(msg);
      $('.tb-right-menu').removeClass('right-menu-open');
        layer.msg(msg, {
            icon: 6,
            time: 2000
        },function () {
          $("#ztreeContent #name").html(name);
          $('.ztop .title em').html(name);
          $('.ztop .stitle strong').html(name);
          var tid = $('.update-btn').attr('data-tid');
          if ($("#"+tid+"_span").find('em').length > 0) {
            $("#"+tid+"_span").find('em').html(name);
          } else {
            $("#"+tid+"_span").html(name);
            $("#"+tid+"_a").attr('title', name);
          }
        });
    } else if(data.status === 0) {
      // 失败
      var errmsg = '操作失败';
      // modalInstDel.open();
      // $("#j-modal_del p").html(errmsg);

        layer.msg(msg, {
            icon: 5,
            time: 2000
        },function () {
           console.log(errmsg);
        });
    }
  });
  $(document).on('click', '.j-cancel', function() {
    $('.tb-right-menu').removeClass('right-menu-open');
  });
  $(document).on('click', '.update-btn', function() {
    $('.tb-right-menu').addClass('right-menu-open');
    var name = $(this).attr('data-name');
    rightMenu(name);
  });
  // 初始化
  rightMenu();
  // $("#ztreeId").css({ "height": $(".ztree-container").height() + 'px' });
  $("#add-btn").after('<div class="addbtn-tip">树型菜单最多支持八级菜单</div>');
});

function rightMenu(name) {
  name = name ? name : '';
  var ihtml = '<div class="tb-right-menu">' + 
                '<h3>名称和状态修改</h3>'+
                '<div class="tb-right-content">' + 
                  '<p><label>分类名称：</label><input type="text" class="tb-input"></p>' + 
                  // '<p>'+
                  //   '<label>状态：</label>' +
                  //   '<select id="selectId"><option value="-1">删除</option><option value="1">正常</option></select>' +
                  // '</p>' +
                '</div>' + 
                '<div class="tb-btn-group"><button class="tb-btn j-save">保存</button><button class="tb-btn j-cancel">取消</button></div>' + 
              '</div>';
  if ($('body').find('.tb-right-menu').length < 1) {
    $('body').append(ihtml);
  }
  $('.tb-right-menu .tb-input').val(name);
  $('#selectId option').each(function(){
    var optionVal = $(this).val();
    if (optionVal == globalStatus) {
      $(this).prop('selected', true);
    }
  });
}