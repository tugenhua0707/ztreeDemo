/*
 zTree 依赖 结构  <ul id="ztreeId" class="ztree"></ul> 
 点击弹窗 树形目录  初始化代码如下：
 // clickRenderCallback 是外部回调函数 点击某一项 输出所有需要的值 
 // zNodes 是树形目录的数据结构代码 
  var clickRenderCallback = function(treeNode){
    console.log(treeNode);
  }
  var zSingle = new ZTreeSingle({
    clickRenderCallback: clickRenderCallback
  });
  $('.btn').click(function() {
    zSingle.modalZtree(zNodes);     
  });
  注意：节点名称字段为：accName，子节点字段名为 subList;  idKey字段为 id, pIdKey字段为 parentId 已经和开发约定好了 后续需要
       调用树形菜单 都需要按照这个约定来做。
  data: {
    simpleData: {
      enable: true,
      idKey: 'id', 
      pIdKey: 'parentId'
    },
    key: {
      name: 'accName',
      children: 'subList'
    }
  }
 */
var modalInst;
var modalInstTree2;
var modalInstDel;
var ZTreeSingle = function(cfg) {
  this.init();
  this.clickRenderCallback = cfg.clickRenderCallback || null; // 点击某一项菜单的回调
  this.newAddCallback = cfg.newAddCallback || null;           // 新增一项的回调
  this.self = this;
};
ZTreeSingle.prototype.init = function() {
  var prefix = $('#ztreeId').attr('data-img-url'),
    add = prefix + '/images/add.png',
    del = prefix + '/images/del.png',
    jian = prefix + '/images/jian.png',
    tree1 = prefix + '/images/tree1.png',
    bgline = prefix + '/images/bg-line.png',
    tree2 = prefix + '/images/tree2.png',
    addBtn = prefix + '/images/add-btn.png',
    plus = prefix + '/images/plus.png';

  var stylesheet = '.ztree-container {float: left; width: 220px; padding: 0; padding-top: 22px; background: #fff; border: 1px solid #d1e1ee;}' + 
    '.ztree{overflow:hidden;padding-right:0px;}' + 
    '.add-btn { width: 180px; height: 40px; cursor: pointer; margin-left: 20px; background: url("'+addBtn+'") no-repeat; background-size: 180px 40px;}' +
    '.ztree-container .ztree {background:#fff; height: 480px;}' +
    '.ztree-container .ztree li.level0:first-child{padding-top: 12px;}' +
    '.ztree li.level0:first-child a.level0.curSelectedNode .add-remove,.ztree li.level0:first-child a.level0 .add-remove{top: 13px;}' + 
    '.ztree-container .ztree li a{padding-right:100%;height: 26px; line-height: 26px;}' + 
    '.ztree-container .ztree li.li_open a.level0, #j-modal-nd .ztree li.li_open a.level0{margin-top:0px;}' +
    '.hidden{display:none}'+
    '.zcontent .value {margin-left: 139px;height: 44px;line-height:44px;}'+
    '.remodal p{font-size: 16px}'+
    '#j-modal-nd .ztree li span{color: #333; opacity: 1;}' +
    '.ztree li span.useless{color:#8f8f92;}'+
    '#j-modal-nd .ztree li span.useless{}'+
    '.ztree li ul{padding-left: 0px;}'+
    '.ztree li{position: relative}'+  
    '.ztree li a {padding-left: 4px; padding-right: 100%; }' +
    '#j-modal-nd .ztree li a{width:auto;padding: 0 4px; height: 26px; line-height: 26px;}' +
    '#j-modal-nd .ztree li a.curSelectedNode{border-radius: 4px; -webkit-border-radius: 4px;color:#fff;}' +
    '.ztree li span.button.add {right: 27px;}' +
    '.ztree li span.button.remove {right: 6px;}' +
    '.ztree li.level0 .add-remove .remove, .ztree li.level0 .add-remove .add{position:absolute; top: 3px; z-index:5;background: url("'+del+'") no-repeat 0 0;background-size: 15px 18px;width: 15px; height: 18px; opacity: 1;}' +
    '.ztree li.level1 .add-remove .remove, .ztree li.level1 .add-remove .add,.ztree li.level2 .add-remove .remove, .ztree li.level2 .add-remove .add,.ztree li.level3 .add-remove .remove, .ztree li.level3 .add-remove .add{position:absolute; top: 3px; z-index:10; background: url("'+del+'") no-repeat 0 0;background-size: 15px 18px;width: 15px; height: 18px; opacity: 1;}' + 
    '.ztree li .add-remove span.button.add{background: url("'+add+'") no-repeat 0 0; background-size: 15px 18px;}'+
    '.ztree li .aParent .add, .ztree li .aParent .remove{top: 8px}' +
    '.ztree li span.button.span-jian{opacity:1; background:url("'+jian+'") no-repeat 0 5px; background-size: 10px 2px; width: 10px;height: 10px;}' + 
    '.ztree li span.button.ico_open, .ztree li span.button.ico_close, .ztree li span.button.ico_docu{display: none}'+
    '.ztree li a.curSelectedNode{margin-left:3px;border-top-left-radius:4px; border-bottom-left-radius:4px; border: none;background: none; color: #fff; opacity: 1;width:150px;background:#8E8CE7;}'+
    '.ztree li .white{color: #393857;}'+
    '.ztree li a.curSelectedNode .white{display:inline-block;margin-top: 4px;color:#fff;}'+
    '#j-modal-nd .ztree li a.curSelectedNode .white {color: #fff;}' + 
    '#j-modal-nd .ztree li a.curSelectedNode .white .icon_plus{color: #fff;}'+
    '#j-modal-nd .ztree li .white {font-weight: 700;}' +
    '.ztree li a.curSelectedNode span {opacity: 1}'+
    '.ztree li a.curSelectedNode:hover{text-decoration: none}'+
    '.ztree .level0.li_open{border-left: 2px solid rgba(142, 140, 231, 100);background: #F7F7FB;}'+
    '#j-modal-nd .ztree .level0.li_open{border-left: none;}' + 
    '#j-modal-nd .ztree .level0.li_open {background: none}'+
    '.ztree .fontsize14 {font-size: 14px; opacity: 1}'+
    '.ztree .margintop14{ padding-left: 16px; padding-bottom: 6px; padding-top: 6px;}' + 
    '.ztree .margintop14 .top6{top: 6px;}' +
    '#j-modal-nd .ztree .margintop14{padding-top: 4px; padding-bottom: 4px;}' +
    '#j-modal-nd {width: 400px; height: 300px; overflow-x: auto; overflow-y: scroll;}' + 
    '#j-modal-nd .ztree .margintop14 {padding-left: 0px;}' + 
    '#j-modal-nd .ztree{padding:0;}'+
    '.ztree-search {margin-bottom: 18px; overflow: hidden}' + 
    '.ztree-search input {float: left; padding-left: 5px; width: 200px; font-size: 14px; height: 34px; border: 1px solid #ccc; border-radius: 3px; -webkit-border-radius: 3px;}' + 
    '.ztree-search .open2-btn{float: left; margin-left: 16px; width: 100px; height: 36px; cursor: pointer; line-height: 36px; border-radius: 3px; -webkit-border-radius: 3px; background: #6361be; color: #fff;}' + 
    '.ztree-search .open2-btn:hover {background: #6a69b6}' + 
    '.errorMsg{font-size: 14px; color: red; text-align: left; margin-top: -10px;}' + 
    '.ztree li.level1 span.button{background: url("'+tree1+'") no-repeat;background-size: 8px 15px; width:8px; height: 26px;}' +
    '.ztree li span.mleft17{margin-left: 17px;}'+
    '.ztree li.level1 span.button.bottom_docu{height: 26px;}' +
    '.ztree ul.level0 li, .ztree ul.level1 li{background: url("./images/bg-line.png") repeat-y 0 0; margin-left: 17px;overflow:hidden;}' +
    '.ztree ul.level1 li.level1, .ztree ul.level1 li.level2{margin-left: 17px}'+
    '.ztree ul.level2 li.level3 span{background:none;}' +
    '.ztree ul.level2 li{margin-left: 6px;}' +
    '.ztree li span.bottom_docu{background: url("'+tree2+'") no-repeat;background-size: 8px 13px; height: 26px;}' + 
    '.add-remove{position: absolute; top: 1px; right:0;width:48px;height:24px;border-top-left-radius: 4px; border-bottom-left-radius: 4px;background:#8E8CE7;overflow:hidden;}' + 
    '.ztree li.margintop14 span.span-add{background: url("'+plus+'") no-repeat 0 0;margin-top: -2px;background-size:10px 10px; height:10px;}' + 
    '.ztree .li_open .span-jian{background: url("'+jian+'") no-repeat 0 1px;}' + 
    '.ztree ul.level1 li .level2 li{background: none;}' + 
    '.ztree li a:hover{text-decoration:none;}'+
    '.ztree li a.curSelectedNode .add-remove{top: 1px}' + 
    '.ztree li a.curSelectedNode .top6{top:7px}' +
    '.ztree ul.level0 li:last-child, .ztree ul.level1 li:last-child{background: none}';
    var win_open = '<div class="remodal" data-remodal-id="modal" id="j-modal">' +
                      '<button data-remodal-action="close" class="remodal-close"></button>'+
                      '<p></p>'+
                      '<button data-remodal-action="cancel" class="remodal-cancel hidden">取消</button>'+
                      '<button data-remodal-action="confirm" class="remodal-confirm">确定</button>'+
                      '<button data-remodal-action="confirm" class="remodal-confirm2 none">确定</button>'+
                    '</div>';

    var del_open = '<div class="remodal" data-remodal-id="modal_del" id="j-modal_del">' +
                      '<button data-remodal-action="close" class="remodal-close"></button>'+
                      '<p></p>'+
                      '<button data-remodal-action="confirm" class="remodal-confirm">确定</button>'+
                    '</div>';

    // 动态增加样式
    this.addStyleSheet(stylesheet);
    $(function() {
      // 动态增加弹窗html结构
      $('body').prepend(win_open);
      $('body').prepend(del_open);
      // 弹窗实例化
      if ($('[data-remodal-id=modal]').length > 0) {
        modalInst = $('[data-remodal-id=modal]').remodal();
      }
      if ($('[data-remodal-id=modal_del]').length > 0) {
        modalInstDel = $('[data-remodal-id=modal_del]').remodal();
      }
    });
};
// JS 动态添加css样式
ZTreeSingle.prototype.addStyleSheet = function(refWin, cssText, id) {
  var self = this;
   if(self.isString(refWin)) {
       id = cssText;
       cssText = refWin;
       refWin = window;
   }
   refWin = $(refWin);
   var doc = document;
   var elem; 
   if (id && (id = id.replace('#', ''))) {
       elem = $('#' + id, doc);
   }

   // 仅添加一次，不重复添加
   if (elem) {
       return;
   }
   //elem = $('<style></style>'); 不能这样创建 IE8有bug
   elem =  document.createElement("style");         
   // 先添加到 DOM 树中，再给 cssText 赋值，否则 css hack 会失效
   $('head', doc).append(elem);
   if (elem.styleSheet) { // IE
      elem.styleSheet.cssText = cssText;
   } else { // W3C
       $(elem).append(doc.createTextNode(cssText));
   }
};
ZTreeSingle.prototype.isString = function(str) {
  return Object.prototype.toString.apply(str) === '[object String]';
};
ZTreeSingle.prototype.beforeRemove = function(treeId, treeNode) {
  if (treeNode.status === 0 || $("#" + treeNode.tId + '_span').hasClass('useless')) {
    window.zSingle.noAddMenu();
    $('#j-modal .remodal-confirm').removeClass('none');
    $('#j-modal .remodal-confirm2').addClass('none');
    $("#j-modal p").html("该菜单已经处于废弃状态~");
    return false;
  }
  window.zSingle.noSubMenu();
  $('.remodal-cancel').removeClass('hidden');
  $("#j-modal p").html("确认废弃 -- " + treeNode.accName + "菜单吗？");
  $('#j-modal .remodal-confirm').addClass('none');
  $('#j-modal .remodal-confirm2').removeClass('none');
  
  // 监听取消事件
  $("#j-modal .remodal-cancel").unbind('click').bind('click', function(){
    $('#j-modal .remodal-confirm').removeClass('none');
    $('#j-modal .remodal-confirm2').addClass('none');
  });
  // 为了获取treeNode 因此dom操作放在里面进行
  $("#j-modal .remodal-confirm2").unbind('click').bind('click', function() {
    var id = treeNode.id;  // 当前账户id
    var delUrl = $('#ztreeId').attr('data-del-url');
    // '/catalog/delAccCatalog'
    // 删除操作
    $.ajax({
      url: delUrl,
      type: 'POST',
      dataType: 'json',
      timeout: 8000,
      data: {
        "id": id
      },
      success: function(data) {
        if (data.status === 1) {
          // 成功
          modalInstDel.open();
          $("#j-modal_del p").html(data.msg);
          $("#" + treeNode.tId + '_span').addClass('useless');
          var spanHtml = $("#" +treeNode.tId + '_span').html();
          if (spanHtml && spanHtml.indexOf('废弃') === -1) {
            $("#" +treeNode.tId + '_span').append('(废弃)');
          }
          $('#j-modal .remodal-confirm').removeClass('none');
          $('#j-modal .remodal-confirm2').addClass('none');
          // 如果它有子节点的话， 那么需要递归遍历当前根节点下的所有子节点，使它们也被废弃
          window.zSingle.allChilds(treeNode);

        } else if(data.status === 0) {
          // 失败
          var errmsg = data.msg || '废弃失败,请重试';
          modalInstDel.open();
          $("#j-modal_del p").html(errmsg);
          $('#j-modal .remodal-confirm').removeClass('none');
          $('#j-modal .remodal-confirm2').addClass('none');
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
  });
  return false;
};
ZTreeSingle.prototype.noAddMenu = function() {
  modalInst.open();
  $('.remodal-cancel').addClass('hidden');
  $("#j-modal p").html('已被废弃,不能增加菜单了');
};
ZTreeSingle.prototype.noSubMenu = function() {
  modalInst.open();
  $('.remodal-cancel').addClass('hidden');
  $("#j-modal p").html('不能再增加菜单了');
};
ZTreeSingle.prototype.addHoverDom = function(treeId, treeNode) {
  var status,
      isNoUser;
  var zTree = window.zTree; 
  if (treeId !== 'ztreeId') {
    return;
  }
  var sObj = $("#" + treeNode.tId + "_span");
  if ($("#addBtn_"+treeNode.tId).length > 0) {
    return;
  }
  var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
    + "' title='add node' onfocus='this.blur();'></span>";
  sObj.after(addStr);
  $('.add-remove').remove();
  $("#ztreeId .add, #ztreeId .remove").wrapAll("<div class='add-remove'></div>");
  var btn = $("#addBtn_"+treeNode.tId);
  if (treeNode.level === 0) {
    $("#" + treeNode.tId).find('a').eq(0).find('.add-remove').addClass('top6');
  }
  if (btn) {
    btn.unbind('click').bind("click", function(){
      if (treeNode.status === -1 || $("#" + treeNode.tId + '_span').hasClass('useless')) {
        window.zSingle.noAddMenu();
        $('#j-modal .remodal-confirm').removeClass('none');
        $('#j-modal .remodal-confirm2').addClass('none');
        $("#j-modal p").html("该菜单已经处于废弃状态~");
        return false;
      }
      var aParent = $(this).closest('a');
      var level;
      // 获取状态 是否被废弃状态
      status = treeNode.status;
      if (status === 0) {
        isNoUser = window.zSingle.noAddMenu(status);
        return false;
      }
      // 如果是第四层菜单的话 不允许再增加子菜单
      level = treeNode.level;
      if (level > 2) {
        window.zSingle.noSubMenu();
        return;
      }
      if (treeNode.level === 0) {
        $("#" + treeNode.tId).addClass('li_open');
      }
      // 获取当前子节点的name和父节点name
      var allNodesName = window.zSingle.getAllParentName(treeNode);
      // 点击新增回调
      window.zSingle.newAddCallback && $.isFunction(window.zSingle.newAddCallback) && window.zSingle.newAddCallback(zTree, treeId, treeNode,allNodesName.reverse());
      // 获取所有的节点数据, 是否显示 废弃 文案
      var nodes = zTree.getNodes();
      window.zSingle.isUseless(nodes);
      return false;
    });
  }
};
ZTreeSingle.prototype.removeHoverDom = function(treeId, treeNode) {
  $("#addBtn_"+treeNode.tId).unbind().remove();
  $(".add-remove").each(function() {
    $(this).remove();
  });
};
// 对所有子节点进行操作
ZTreeSingle.prototype.allChilds = function(treeNode) {
  var subListElem = treeNode.subList;
  var noUse = function(treeNode) {
    $("#" + treeNode.tId + '_span').addClass('useless');
    var spanHtml = $("#" +treeNode.tId + '_span').html();
    if (spanHtml && spanHtml.indexOf('废弃') === -1) {
      $("#" +treeNode.tId + '_span').append('(废弃)');
    }
    var slist = treeNode.subList;
    if (slist && slist.length) {
      for(var j = 0, jlen = slist.length; j < jlen; j++) {
        noUse(slist[j]);
      }
    }
  };
  if (subListElem && subListElem.length) {
    // 进行递归调用
    for (var i = 0, ilen = subListElem.length; i < ilen; i++) {
      noUse(subListElem[i]);
    }
  }
};
// 获取所有父节点的name值 -- 通过递归的方式
ZTreeSingle.prototype.getAllParentName = function(node) {
  var arrs = [];
  var rAllNodesName = function(node) {
     var accName = node.accName;
     var tId = node.tId;
     arrs.push({
       accName: accName,
       tId: tId
     });
     // 如果该节点有父节点的话， 使用递归的方式 递归获取
     var parentNode = node.getParentNode();
     if (parentNode && parentNode.accName) {
        rAllNodesName(parentNode);
     }
  };
  rAllNodesName(node);
  return arrs;
};
ZTreeSingle.prototype.clearClassWhite = function(treeId) {
  $("#" + treeId).find('span').removeClass("white");
};
ZTreeSingle.prototype.zTreeOnClick = function(event, treeId, treeNode) {
  // 点击标题展开
  var nodes = window.zTree.getSelectedNodes();
  if (nodes.length > 0) {
    // 先所有节点收缩 然后当前节点展开
    window.zTree.expandNode(nodes[0], true, false, true);
    $("#" + treeNode.tId).addClass('li_open').siblings();
    $("#" + treeNode.tId).find('span').eq(0).addClass('span-jian').removeClass('span-add');
  } 
  // 获取所有的节点数据, 是否显示 废弃 文案
  var nodes = window.zTree.getNodes();
  window.zSingle.isUseless(nodes);

  // 获取当前子节点的name和父节点name
  var allNodesName = window.zSingle.getAllParentName(treeNode);
  window.zSingle.clearClassWhite(treeId);
  for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
    $("#" + allNodesName[i].tId + '_span').addClass('white');
  }
  // 添加 + 号
  window.zSingle.addPlus(treeNode);

  if (treeId !== "ztreeId") {
    // 针对弹窗 点击某一项 触发事件
    window.zSingle.clickRenderCallback && $.isFunction(window.zSingle.clickRenderCallback) && window.zSingle.clickRenderCallback(treeNode);
    return;
  }
  // 说明该节点是废弃状态 废弃状态 应该去掉选中状态
  if (treeNode.status === 0) {
    var zTree = $.fn.zTree.getZTreeObj(treeId);
    var node = zTree.getSelectedNodes()[0];
    zTree.cancelSelectedNode(node);
  }
  window.zSingle.clickRenderCallback && $.isFunction(window.zSingle.clickRenderCallback) && window.zSingle.clickRenderCallback(allNodesName.reverse(),treeNode);
};
ZTreeSingle.prototype.zTreeOnExpand = function(event, treeId, treeNode) {
  var zTree = window.zTree; 
  // 获取所有的节点数据, 是否显示 废弃 文案
  var nodes = zTree.getNodes();
  window.zSingle.isUseless(nodes);
  if (treeId !== 'ztreeId2') {
    if (treeNode.open && (treeNode.level === 0)) {
      $("#" + treeNode.tId).addClass('li_open');
    } 
  }
  // 如果它有子节点的话， 那么需要递归遍历当前根节点下的所有子节点，使它们也被废弃
  if ($("#" + treeNode.tId + '_span').hasClass("useless")) {
    window.zSingle.allChilds(treeNode);
  }
  // 添加 + 号
  window.zSingle.addPlus(treeNode);
  // 使第一级节点 添加图标
  if (treeNode.level === 0) {
    $("#" + treeNode.tId).find('span').eq(0).addClass('span-jian').removeClass('span-add');
  }
};
// 给二级节点及更多节点添加 + 号
ZTreeSingle.prototype.addPlus = function(treeNode) {
  var subList = treeNode.subList;
  var cycleChild = function(item) {
    if (item.subList) {
      if ($('#' +item.tId+'_span').find('.icon_plus').length < 1) {
        $('#' +item.tId+'_span').prepend('<span class="icon_plus">+</span>');
      }
      var subItem = item.subList;
      if (subItem && subItem.length) {
        cycleChild(subItem);
      }
    }
  };
  if (subList && subList.length) {
    for (var i = 0, ilen = subList.length; i < ilen; i++) {
      var item = subList[i];
      cycleChild(item);
    }
  }
};
ZTreeSingle.prototype.zTreeOnCollapse = function(event, treeId, treeNode) {
  if (treeId !== 'ztreeId2') {
    if (!treeNode.open && (treeNode.level === 0)) {
      $("#" + treeNode.tId).removeClass('li_open');
    }
  }
  // 使第一级节点 添加图标
  if (treeNode.level === 0) {
    $("#" + treeNode.tId).find('span').eq(0).addClass('span-add').removeClass('span-jian');
  }
  $(this).addClass('span-add').removeClass('span-jian');
};
// 判断节点是否需要显示废弃状态--- 通过递归的方式遍历子节点
ZTreeSingle.prototype.isUseless = function(nodes) {
  var rAllNodesisStatus = function(node) {
    var status = node.status;
    if (status === -1) {
      var spanHtml = $("#" +node.tId + '_span').html();
      $("#" +node.tId + '_span').addClass('useless');
      if (spanHtml && spanHtml.indexOf('废弃') === -1) {
        $("#" +node.tId + '_span').append('(废弃)');
      }
    }
    var subList = node.subList;
    if (subList && subList.length) {
      for (var j = 0, jlen = subList.length; j < jlen; j++) {
        rAllNodesisStatus(subList[j]);
      }
    }
  };
  if (nodes && nodes.length) {
    for (var i = 0, ilen = nodes.length; i < ilen; i++) {
      rAllNodesisStatus(nodes[i]);
    }
  }
};
ZTreeSingle.prototype.isRepeatName = function(pNode, name, firstNodes) {
  var isflag = false;
  var subLists;
  if (pNode && pNode.subList) {
    subLists = pNode.subList;
  } else {
    subLists = firstNodes;
  }
  if (subLists && subLists.length) {
    for(var i = 0, ilen = subLists.length; i < ilen; i++) {
      if (subLists[i].accName === name) {
        isflag = true;
        break;
      }
    }
  }
  return isflag;
};
// 根据inputVal的值 展开父节点下的对应的子节点  通过递归的方式遍历所有子节点 进行对比
ZTreeSingle.prototype.expandNode = function(inputVal) {
  var zTree = window.zTree; 
  var nodes = zTree.getNodes();
  var allNodes = [];
  // 是否搜索到对应的值
  var isSearchVal = false; 
  // 获取所有的节点数据
  if (!inputVal) {
    $('.errorMsg').removeClass('hidden').html('查询的名称不能为空！');
    return;
  } else {
    $('.errorMsg').addClass('hidden');
  }
  
  var getAllNodes = function(node) {
    var accName = node.accName;
    var id = node.id;
    allNodes.push({name:accName, id: id});
    var subList = node.subList;
    if (subList && subList.length) {
      for (var j = 0, jlen = subList.length; j < jlen; j++) {
        getAllNodes(subList[j]);
      }
    }
  };
  for (var j = 0, jlen = nodes.length; j < jlen; j++) {
    getAllNodes(nodes[j]);
  }
  // 添加 + 号
  window.zSingle.addPlus(nodes);
  if (allNodes.length) {
    for (var i = 0, ilen = allNodes.length; i < ilen; i++) {
      if (inputVal == allNodes[i].name) {
        var node = zTree.getNodeByParam("id", allNodes[i].id, null);
        zTree.expandNode(node, true, false, true, true);
        zTree.selectNode(node, true);
        isSearchVal = true;
        zTree.setting.callback.onClick(null, 'ztreeId2', node);
        $("#" +node.parentTId).find('span:first-child').eq(0).removeClass('span-add').addClass('span-jian');
        break;
      }
    }
  }
  if (!isSearchVal) {
    $('.errorMsg').removeClass('hidden').html('没有搜索到对应的名称');
  } else {
    $('.errorMsg').addClass('hidden');
  }
};
ZTreeSingle.prototype.modalZtree = function(zNodes) {
  var win_open2 = '<div class="remodal" data-remodal-id="win_open2" id="j-modal-nd">' +
                    '<button data-remodal-action="close" class="remodal-close"></button>'+
                    '<div class="ztree-content-nd">' +
                      '<div class="ztree-search"><input type="text" /><div class="open2-btn">确定</div></div>'+ 
                      '<div class="errorMsg hidden">查询的名称不能为空！</div>'+
                      '<ul id="ztreeId2" class="ztree"></ul>'+
                    '</div>'+
                  '</div>';
  // 动态增加弹窗html结构
  if ($("#j-modal-nd").length < 1) {
    $('body').prepend(win_open2);
    // 弹窗实例化
    modalInstTree2 = $('[data-remodal-id=win_open2]').remodal();
    var setting2 = {
      view: {
        selectedMulti: false
      },
      edit: {
        enable: true,
        showRemoveBtn: false,
        showRenameBtn: false
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id', 
          pIdKey: 'parentId'
        },
        key: {
          name: 'accName',
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
    $.fn.zTree.init($("#ztreeId2"), setting2, zNodes);
    var zTree = $.fn.zTree.getZTreeObj("ztreeId2"); 
    window.zTree = zTree;
    var nodes = window.zTree.getNodesByFilter(function(node) {
      return node.level === 0
    });
    $(nodes).each(function(index, item){
      $("#" + item.tId).addClass('margintop14');
      $("#" + item.tId).find('span:first-child').addClass('span-add');
      $("#" + item.tId).find('a').addClass('aParent');
      $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
    });
    // 监听关闭弹窗事件
    $(document).on('closing', '#j-modal-nd', function (e) {
      window.zSingle.clearClassWhite('ztreeId2');
      // 折叠全部节点
      zTree.expandAll(false);
      $('.ztree-search input').val('');
      $("#ztreeId2 li").each(function() {
        $(this).removeClass("li_open");
        $(this).find('a.curSelectedNode').removeClass("curSelectedNode");
      });
      $('.errorMsg').addClass('hidden');

      $(nodes).each(function(index, item){
         $("#" + item.tId).find('span:first-child').eq(0).removeClass('span-jian').addClass('span-add');
      });
    });
    // 点击确定事件
    var timer;
    $('#j-modal-nd').on('click', '.open2-btn', function(e) {
      var inputVal = $.trim($(this).closest('.ztree-search').find('input').val());
      // 折叠全部节点
      zTree.expandAll(false);
      $(nodes).each(function(index, item){
         $("#" + item.tId).find('span:first-child').eq(0).removeClass('span-jian').addClass('span-add');
      });
      timer && clearTimeout(timer);
      // 使用定时器 延时一些时间
      timer = setTimeout(function() {
        window.zSingle.expandNode(inputVal);
      }, 500);
    });
    /*
    // 默认选中指定节点并执行事件
    var node = zTree.getNodeByParam("id", nodes[0].id);
    zTree.setting.callback.onClick(null, 'ztreeId2', node);
    */
    /*
    // 获取所有的节点数据, 是否显示 废弃 文案
    var allNodes = zTree.getNodes();
    window.zSingle.isUseless(allNodes);
    */
  }
  modalInstTree2.open();
};
window.ZTreeSingle = ZTreeSingle;

