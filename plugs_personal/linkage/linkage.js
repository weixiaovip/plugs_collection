/**
 * Created by wx on 2016/10/9.
 */
(function (window, factory) {

    if (typeof exports === 'object') { // NodeJS && ModJS

        module.exports = factory(require);

    } else if (typeof define === 'function') { // RequireJS && SeaJS

        define(factory);

    } else {

        window.Linkage = factory(); // 需要修改暴露到全局的变量名！！！
    }
})(this, function (require) {
    "use strict";

    var gobal = null; //全局对象
    try {
        gobal = window;
    } catch (e) {
        gobal = global;
    }

    /**
     * 下拉联动组件
     * @param options 配置参数
     * @constructor
     */
    function Linkage(options) {
        this.options = options.apiList || [];
        this.defaultOption = {value: '', name: '全部'};
        this.total = this.options.length;
        this.cache = {}; //缓存数据
        this.isJSONP = options.isJSONP;
        this.flagValid = {}; //请求数据的最新时间标记
        this.init();
    }


    /**
     * 初始化函数，创建实例时自动执行
     */
    Linkage.prototype.init = function () {
        var _this = this;

        //一开始，把所有select初始化为指定的默认值
        _this.setDefault(0);
        //请求第一个select的数据并展示出来
        _this.getDataToSelect(0);

        for (var i = 0; i < _this.total; i++) {
            //给所有select标签添加onchange事件
            $('#' + _this.options[i].id).attr('linkageIndex', i).on('change', function (e) {
                //添加索引的自定义属性
                var index = $(this).attr('linkageIndex');
                index = parseInt(index) + 1;
                //获得数据、并把数据展示到index对应的select项上
                _this.getDataToSelect(index);
                //展示索引之后的项置为默认“全部”
                _this.setDefault(index + 1);
            })
        }
    };


    /**
     * showOptions 展示数据--拼接下拉框选项
     * @param index 当前select框的索引
     * @param data 要展示的数据
     */
    Linkage.prototype.showOptions = function (index, data) {
        data = data || [];
        //展示索引对应select框的内容
        var curId = this.options[index].id;
        var defaultOption = this.options[index].defaultOption || this.defaultOption;

        //数据量太大时
        if(data.length > 2000){
            alert('option超过2000条，请检查请求数据url是否正确！');
            console.log('option超过2000条，请检查请求数据url是否正确！',data);
        }

        var str = '<option value="' + defaultOption.value + '">' + defaultOption.name + '</option>';
        //data最多展示1000条
        for(var i= 0,len = data.length >2000?2000:data.length; i<len; i++){
            var cur = data[i];
            str += '<option value="' + cur.id + '">' + cur.name + '</option>';
        }

        $('#' + curId).html(str);
    };


    /**
     * 重置为默认--“全部”，把当前项及以后的所有项置为默认
     * @param index 当前select框的索引
     */
    Linkage.prototype.setDefault = function (index) {
        for (var i = index; i < this.total; i++) {
            var defaultOption = this.options[i].defaultOption || this.defaultOption;
            $('#' + this.options[i].id).html('<option value="' + defaultOption.value + '">' + defaultOption.name + '</option>');
        }
    };


    /**
     * 请求select框数据，展示并选择制定选择项
     * @param index 当前select框的索引
     * @param param 获得当前select需要的问号参数数据，例如{'id':'pp1'}，如果不传，默认取上一个select框中的值
     * @param value 请求完数据后，select框选择的option的value值，可省略
     */
    Linkage.prototype.getDataToSelect = function (index, param, value) {
        var _this = this;

        var paramName = '1';//param的参数名
        //param参数是传入还是自动取值
        if(Object.prototype.toString.call(param) == "[object Object]"){
            param = param || {};
        }else{
            //查询参数
            param = {};
            if (index == 0) {
                param = {};
            } else if (index > 0 && index < this.total) {
                var preId = this.options[index - 1].id;
                paramName = this.options[index].paramName;
                param[paramName] = $('#' + preId).val();

            } else {
                //请求的索引值不正确
                return;
            }

        }

        //是否为最新请求的标志位
        var flagValid = new Date()*1; //本次调用的时间标志位
        _this.flagValid[index] = flagValid; //更新时间标志位

        //获取url地址
        var url = this.options[index].url;
        //拼接cache名
        var cacheName = ''+url;
        for(var key in param){
            cacheName += '&'+'key'+param[key];
        }

        //判断缓存数据中是否存在
        if (_this.cache[cacheName]) {
            _this.showOptions(index, _this.cache[cacheName]);
            value && $('#' + _this.options[index].id).val(value);

        } else {

            //如果param的值为指定的默认option，则不发送请求
            if (param[paramName] == _this.options[index].defaultOption.value) {
                _this.cache[cacheName] = {};
                _this.showOptions(index, {});
            } else {
                var cb = this.options[index].jsonp || 'cb';
                //请求数据
                $.ajax({
                    type: "get",
                    url: url,
                    data: param || {},
                    dataType: _this.isJSONP ? "jsonp" : 'json',
                    async: false,
                    jsonp: cb,
                    success: function (data) {
                        //不是最新的请求，则不用绑定数据
                        if (!data || _this.flagValid[index] > flagValid) {
                            return;
                        }
                        //数据放入缓存中
                        _this.cache[cacheName] = data;
                        _this.showOptions(index, data);

                        //如果value有值，则设置当前select框为此value对应的option
                        value && $('#' + _this.options[index].id).val(value);

                    },
                    error: function (data) {
                        console.log(data);
                    }
                });

            }

        }

    };

    return Linkage;
});
