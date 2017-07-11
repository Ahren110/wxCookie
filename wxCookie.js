let _extend = require("../utils/extend");
let _each = require("../utils/each");
var postfix = '_javascript';
var postfixLeft = 'javascript_';
var postfixRight = postfix;
var posttemp = "(\/temp\/)";
function trimFn(str) {
    return str.replace(/(^\s*)|(\s*$)/g, "");
}
function CACHE() {
    return "Cache method (time limited, default 1 second)";
};
CACHE.prototype.remove = function (k) {
    wx.removeStorageSync(k);
};
CACHE.prototype.set = function (name,value,Exps,Path) {
    try{
        var session_id = wx.getStorageSync(name);
        if (session_id == undefined || session_id == null || session_id == "") {
            this.remove("kyq.mc" + postfix);
        }
        var strsec = this.msTo(Exps);
        var exp = new Date();
        exp.setTime(exp.getTime() + strsec * 1);
        var pathFn = Path ? Path:"/";
        var cacteStr = ";Path=" + pathFn + ";Expires=" + exp.toGMTString()+";";
        var dftOpt = {"Path":"/", "Expires": exp.toGMTString()};
        var aaa =this.toObj(value);
        var kyqMc = wx.getStorageSync("kyq.mc" + postfix);
        if (kyqMc == undefined || kyqMc == null || kyqMc == "") {
            dftOpt = dftOpt;
        }else{
            dftOpt["kyq.mc"] = kyqMc;
        }
        var opts = aaa;
        if("data" in aaa){
            opts = _extend({}, dftOpt, aaa["data"]);
        }
        if ("kyq.mc" in opts){
            
            var qqq123= wx.setStorageSync("kyq.mc" + postfix, opts["kyq.mc"]);
            console.log(qqq123)
        }
        wx.setStorageSync(name, this.toStr(opts) );
        console.log(opts)
        console.log("kyq.mc", "kyq.mc" in opts);
    }catch(e){}
};
CACHE.prototype.msTo = function(str) {
    try{
        var letExp = new RegExp("[A-Za-z]+$", "ig");
        var numExp = new RegExp("[0-9].*[0-9]|[0-9].*[0-9]", "ig");
        var _numTxt = str.match(numExp) || 1, _letTxt = str.match(letExp);
        var _secondTime = _numTxt * 1000;
        var _minTime = _secondTime * 60;
        var _hourTime = _minTime * 60;
        var _dayTime = _minTime * 60;
        if (_letTxt == "s") {
            return _secondTime;
        } if (_letTxt == "m") {
            return _minTime;
        } else if (_letTxt == "h") {
            return _hourTime;
        } else if (_letTxt == "d") {
            return _dayTime;
        }
    }catch(e){}
    return null;
} 
CACHE.prototype.get = function (CACHEDATA,name) {
    try{
        var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
        var session_id = wx.getStorageSync(CACHEDATA);
        if (name == undefined || name == null || name == "" ){
            if (session_id == undefined || session_id == null || session_id == "") {
                return { "data": "not found", "code": 0 };
            }
            else {
                return { "data": session_id, "code": 1 };
            }
        }else{
            if (arr = session_id.match(reg)){
                return { "data": unescape(arr[2]), "code": 1 };
            }
            else{
                return { "data": "not found", "code": 0 };
            }
        }
    }catch(e){
        return { "data": "not found", "code": 0 };
    }
};

CACHE.prototype.getStr = function (session_id,CACHEDATA, name) {
    try {
        var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)");
        if (name == undefined || name == null || name == "") {
            if (arr = session_id.match(reg2)) {
                var strGet = this.get;
                var txtExp = strGet(CACHEDATA, "Expires")["msg"];
                var timetamp = new Date().getTime(), timeExp = new Date(txtExp).getTime();
                if (timetamp <= timeExp) {
                    return { "msg": unescape(arr[2]), "code": 1 };
                } else {
                    return { "msg": "time out!", "code": -1 };
                }
            }
            else {
                return { "msg": "not found", "code": 0 };
            }
        } else {
            if (arr = session_id.match(reg)) {
                return { "msg": unescape(arr[2]), "code": 1 };
            }
            else {
                return { "msg": "not found", "code": 0 };
            }
        }
    } catch (e) { }
};
var getLength = function (obj) {
    var i = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            i++;
        }
    }
    return i;
};
function isString(str) {
    return (typeof str == 'string') && str.constructor == String;
} 
CACHE.prototype.toObj = function (_STRING) {
   try {
       if (isString(_STRING)){
            var msgCode = {}, regExp = null;
            var strs = []; //定义一数组 
            var strs1 = []; //定义一数组 
            var _JSON = null;
            strs = _STRING.split(";"); //字符分割
            if (strs.length>0){
                _JSON = {};
                _each(strs,function(data,ex){
                    strs1 = data.split("="); //分割后的字符输出 
                    if (strs1.length > 1) {
                        var strs10 = trimFn(strs1[0]);
                        var strs11 = trimFn(strs1[1]);
                        if (strs10.indexOf("HttpOnly,") > -1) {
                            strs10 = strs10.replace(new RegExp("HttpOnly,", "gm"), "");
                        }
                        if (("\"\"") == strs11) {
                            strs11 = ""
                        }
                        _JSON[strs10] = strs11;
                    } 
                })
                return { "data": _JSON, "len": getLength(_JSON)};
            }else{
                return { "data":"not found", "len": -1 }
            }
       }else{
           return { "data": _STRING, "len": getLength(_JSON)};
       }
    } catch (e) { 
       return { "data": "not found", "len": -1 }
    }
};
CACHE.prototype.toStr = function (_OBJECT) {
    try {
        console.log(_OBJECT["data"])
        var jsonStr = "";
        _each(_OBJECT, function (data, ex) {
            if (ex.indexOf("HttpOnly,")>-1){
                ex = ex.replace(new RegExp("HttpOnly,","gm"), "");
            }
            if (("\"\"") == data ){
                data =""
            }
            jsonStr += (ex + "=" + data + ";");
        })
        return jsonStr;
   } catch (e) { }
};
module.exports = CACHE;
