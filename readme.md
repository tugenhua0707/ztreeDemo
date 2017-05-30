
#### 树形菜单使用方式如下：
#### HTML引入的方式如下：
<pre>
<!DOCTYPE html>
 <html>
    <head>
        <meta charset="utf-8">
        <title>ztree树形菜单demo</title>
        <link rel='stylesheet' href='libs/zTreeStyle.css' />
        <link rel='stylesheet' href='libs/remodal.css' />
        <link rel='stylesheet' href='libs/remodal-default-theme.css' />
        <link rel='stylesheet' href='css/index.css' />
    </head>
    <body>
        <!--  弹窗 -->
        <div class="remodal w360" data-remodal-id="modal2" id='data-modal2'>  
          <div class="remodal-wrap">                     
            <div class='m-title'>新增账户</div>
            <div class="m-center-modal">
              <div class='directory'>  
                <label>目录结构</label>    
                <span></span>
              </div>
              <div class="account-name">      
                <label>账户名称</label>
                <input type="text" maxlength="16" />
              </div>
              <div class="modal-tips hidden"></div>
            </div>
          </div>
          <div class='m-btn'>
            <button class="remodal-cancel">取消</button>
            <button class="remodal-confirm">确定</button>
          </div>
        </div>

        <div class="container" id="container">
          <div class="account_page content">
            <div class='ztree-container' style='border-right:none'>
              <div class="add-btn" id="add-btn"></div>
              <ul id="ztreeId" class="ztree" data-add-url='' data-del-url='' data-img-url='' data-tree=''></ul>
            </div>
            <!-------------------------------下面是右侧的内容 ----------------------->
            <div class='ztree-content'>
                右侧的内容放在这里
                
            </div>
            <div class="catalog-line"></div>
          </div>
        </div>
        <script src='libs/jquery.min.js'></script>
        <script src='libs/jquery.ztree.core.js'></script>
        <script src='libs/jquery.ztree.exedit.js'></script>
        <script src='libs/remodal.js'></script>
        <script src='libs/ztree.js'></script>
        <script src='js/index.js'></script>
    </body>
</html>
</pre>
#### 注意：
#### 1. css需要引入：<br />
#### <link rel='stylesheet' href='libs/zTreeStyle.css' /><br />
#### <link rel='stylesheet' href='libs/remodal.css' /><br />
#### <link rel='stylesheet' href='libs/remodal-default-theme.css' /><br />
#### <link rel='stylesheet' href='css/index.css' /><br />
#### 2. JS需要引入如下：<br />
#### <script src='libs/jquery.min.js'></script><br />
#### <script src='libs/jquery.ztree.core.js'></script><br />
#### <script src='libs/jquery.ztree.exedit.js'></script><br />
#### <script src='libs/remodal.js'></script><br />
#### <script src='libs/ztree.js'></script><br />
#### <script src='js/index.js'></script><br />

#### 3. 在id为ztreeId 添加4个属性，<br />
 ####  3-1： data-add-url 为添加菜单的接口（数据返回的格式和成本中心的 /catalog/addAccCatalog 的格式字段一样）。<br />
 ####  3-2： data-del-url 为删除菜单接口(数据返回的格式和成本中心的 /catalog/delAccCatalog 格式字段一样)。<br />
 ####  3-3:  data-img-url: 图片的相对路径，比如图片的路径为 xxx/yyy/images/xx.png  因此 data-img-url = 'xxx/yyy' 就可以了。<br />
 ####  3-4:  data-tree:  树形目录的数据，<br />


#### 4. 弹窗树形菜单 模糊匹配 <br />
#### 配置如下：<br />
#### 在页面上放一个隐藏域input 设置id为 ztreeId， data-img-url 和上面一样，是图片前缀路径， data-tree 是 树形菜单的数据。如下代码：<br />
#### <input type='hidden' id="ztreeId" data-img-url='.' data-tree = '' /><br />









