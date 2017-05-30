// 弹窗实例化
var modalInst2;
var timer;
var newAddCallback = function(zTree, treeId, treeNode, allNodesName) {
  modalInst2.open();
  $('.remodal-cancel').removeClass('hidden');
  $(".account-name input").val('');
  $('.modal-tips').addClass('hidden').html('');

  var arrNames = [];
  if (allNodesName && allNodesName.length) {
    for (var i = 0, ilen = allNodesName.length; i < ilen; i++) {
       arrNames.push(allNodesName[i].accName);
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
      accName ：账户名称-简写;
     */
    var parentId = (treeNode && treeNode.id) ? treeNode.id : -1;
    var accLevel = treeNode ? (treeNode.level === 0 ? 2 : (treeNode.level+2)) : 1;
    var accType = $('.a-select').val();
    var accName = $.trim($('.account-name input').val());
    if (accName === '') {
       $('.modal-tips').removeClass('hidden').html('请填写账户名称');
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
      isRepeatName = window.zSingle.isRepeatName(treeNode, accName);
      smsg = '子菜单不能有相同的名称，请重新输入';
    } else {
      isRepeatName = window.zSingle.isRepeatName(treeNode, accName, nodes);
      smsg = '菜单不能有相同的名称，请重新输入';
    }
    if(isRepeatName) {
       $('.modal-tips').removeClass('hidden').html(smsg);
       $this.removeClass('checkSubmitFlag');
       return;
    } else {
      $('.modal-tips').addClass('hidden').html('');
    }
    var data;
    if (treeNode && treeNode.level && treeNode.level === 2) {
       data = {
         parentId: parentId,
         accType:accType,
         accName:accName,
         accLevel: accLevel,
         isLeaf: 1
       }
    } else {
       data = {
         parentId: parentId,
         accType:accType,
         accName:accName,
         accLevel: accLevel
       }
    }
    var addUrl = $('#ztreeId').attr('data-add-url');
    $.ajax({
      // '/catalog/addAccCatalog'
       url: addUrl,
       type: 'POST',
       dataType: 'json',
       data: data, 
       timeout: 8000,
       success: function(data) {
        /*
         var data = {
          "data":
          {
            "accId":"00090010001300090003",
            "accLevel":3,
            "accName":"运营2-2",
            "accType":3,
            "createTime":1489751958034,
            "id":17,
            "isLeaf":0,
            "parentId":16,
            "status":1},
            "msg":"亲,添加成功了~","status":1}}
          */
         if(data.status === 1) {
           // 成功
           $this.removeClass('checkSubmitFlag');
           modalInst2.close();
           var data = data.data;
          if (treeNode && treeNode.id) {  
            zTree.addNodes(treeNode, {id:data.id, parentId: treeNode.id, accName: data.accName,accId: data.accId});
            var nodes = zTree.getNodesByFilter(function(node) {
              return node.level === 0
            });
            $(nodes).each(function(index, item){
              $("#" + item.tId).addClass('margintop14');
              $("#" + item.tId).find('a').addClass('aParent');
              $("#" + item.tId).find('span').eq(0).removeClass('span-add').removeClass('hidden').addClass('span-jian');
              if(!item.subList) {
                $("#" + item.tId).find('span:first-child').addClass('hidden');
              }
            });
          } else {
            zTree.addNodes(null, {id:data.id, parentId: data.parentId, accName: data.accName,accId: data.accId});
            var nodes = zTree.getNodesByFilter(function(node) {
              return node.level === 0
            });
            $(nodes).each(function(index, item){
              $("#" + item.tId).addClass('margintop14');
              $("#" + item.tId).find('a').addClass('aParent');
              $("#" + item.tId).find('a span:last-child').addClass('fontsize14');
              if(!item.subList) {
                $("#" + item.tId).find('span:first-child').addClass('hidden');
              }
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
  newAddCallback: newAddCallback
};
$(function(){
  window.zSingle = new ZTreeSingle(cfg);
  var setting = {
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

  modalInst2 = $('[data-remodal-id=modal2]').remodal();
  var dataTree = $('#ztreeId').attr('data-tree');
  var zNodes;
  if (dataTree) {
    zNodes = JSON.parse(dataTree);
    zNodes = zNodes.data;
  }
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
      if(!item.subList) {
        $("#" + item.tId).find('span:first-child').addClass('hidden');
      }
    });
    var node = window.zTree.getNodeByParam("id", nodes[0].id);
    window.zTree.setting.callback.onClick(null, 'ztreeId', node);
    var allNodes = window.zTree.getNodes();
    window.zSingle.isUseless(allNodes);
  }
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
  // $("#ztreeId").css({"height": $(window).height() - 150 + 'px'});
  
  /*
  // 测试弹窗
  var zNodes2 = [
    { id:1, parentId:null, accName:"父节点 1",level:0,status:0,accId: 0,
      subList:[
        { 
          id:11, 
          parentId:1,
          accId: 1, 
          accName:"叶子节点 1-1", 
          subList: [
            { 
              id:111, 
              parentId:11, 
              accName:"叶子节点 1-1-1",
              status:0,
              accId: 2,
              subList: [
                { id:1111, parentId:111, accName:"叶子节点 1-1-2",status:0, accId: 3}
              ]
            }
          ]
        },
        { id:12, parentId:1, accName:"叶子节点 1-2",accId: 0},
        { id:13, parentId:1, accName:"叶子节点 1-3",accId: 0}
      ]
    },
    { id:2, parentId:null, accName:"父节点 2",status:1,level:0, accId: 0,
      subList: [
        { id:21, parentId:2, accName:"叶子节点 2-1", accId: 1, status:1,
          subList: [
            { 
              id:111, 
              parentId:21, 
              accName:"叶子节点 2-1-1",
              status:1,
              accId: 2,
              subList: [
                { id:1111, parentId:111, accName:"叶子节点 2-1-2",status:0, accId: 3}
              ]
            }
          ]
        },
        { id:22, parentId:2, accName:"叶子节点 2-2", accId: 1, status:0},
        { id:23, parentId:2, accName:"叶子节点 2-3", accId: 1}
      ]
    },  
    { id:3, parentId:null, accName:"父节点 3",status:1,level:0, accId: 0,
      subList: [
        { id:31, parentId:3, accName:"叶子节点 3-1", accId: 1},
        { id:32, parentId:3, accName:"叶子节点 3-2", accId: 1},
        { id:33, parentId:3, accName:"叶子节点 3-3", accId: 1}
      ]
    } 
  ];
  $(".tbj-nav-list li a").click(function(e) {
    e.preventDefault();
    window.zSingle.modalZtree(zNodes2); 
  });
  */

  // 菜单的展开与收缩效果
  var containerWrap = $('.account_page')[0],
    leftWrap = $('.ztree-container')[0],
    rightWrap = $('.ztree-content')[0],
    oLine = $('.catalog-line')[0];
  if (containerWrap && leftWrap && rightWrap && oLine) {
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
  
})