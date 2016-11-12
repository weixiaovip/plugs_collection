### 下拉框联动组件说明

### 功能
*   通过配置options参数，实现select下拉框之间的联动

### 说明
*   此组件依赖jquery/zepto,调用前请先引用jquery/zepto
*   支持AMD/CommonJS方式调用

### 使用

*   参数options
~~~
var options = {
        apiList: [ //select框和对应api列表，数组顺序和select框联动顺序一直
            {
                url: "./mock/getList1.json", //第一个select框获得数据的接口
                jsonp:'callback', //jsonp请求方式，保存callback的问号参数名称,默认为"cb"
                id: "select1", //第一个select框的id
                defaultOption:{ //select默认项的value和名称
                    value:'empty1',
                    name:'默认a'
                }
            },
            {
                url: "./mock/getList2.json?b=2", //第二个select框获得数据的接口
                jsonp:'callback', //jsonp请求方式，保存callback的问号参数名称,默认为"cb"
                id: "select2", //第二个select框的id
                paramName:'id2', //url中参数名，用来标记查询哪一个选项下的列表
                defaultOption:{
                    value:'',
                    name:'默认b'
                }
            }],
        isJSONP : true //是否为跨域方式请求，true为跨域jsonp方式，false为同域ajax方式
    };
~~~

*   调用
~~~
//创建实例
var linkage = new Linkage(options);
~~~

*   方法
~~~
//getDataToSelect--请求select框数据，展示并选择制定选择项。
//@param1 index 当前select框的索引
//@param2 param 获得当前select需要的问号参数数据，例如{'id':'pp1'}，如果不传，默认取上一个select框中的值
//@param3 value 请求完数据后，select框选择的option的value值，可省略
linkage.getDataToSelect(1,{'id1':'pp1'},'cx2');
~~~
*   示例demo
参见包目录下的demo文件夹
注意：
- 1.demo.html需要用启服务的方式打开（例如：WebStorm中打开），直接单击demo.html打开无法模拟ajax