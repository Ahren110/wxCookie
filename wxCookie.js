function CACHE() {
    return "Cache method (time limited, default 1 second)";
};
CACHE.prototype.remove = function (k) {
    wx.removeStorageSync(k);
};
CACHE.prototype.set = function (name,value,Exps,Path) {
    var strsec = this.msTo(Exps);
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);

    var pathFn = Path ? Path:"/";
    var cacteStr = ";Path=" + pathFn + ";Expires=" + exp.toGMTString()+";"; 
    if ("JSESSIONID" == name){
        cacteStr = "JSESSIONID=" + value + ";" + "kyq.mc=" + Cookie.get(name, "kyq.mc")["msg"]  + cacteStr;
    }else{
        cacteStr = name + "=" + value + cacteStr;
    }
    console.log(cacteStr)
    wx.setStorageSync(name, cacteStr);
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
        var arr, reg = new RegExp("(^|)" + name + "=([^;]*)(;|$)"), reg2 = new RegExp("(^| )" + CACHEDATA + "=([^;]*)(;|$)");
        var session_id = wx.getStorageSync(CACHEDATA);
        if (name == undefined || name == null || name == "" ){
            if (arr = session_id.match(reg2)) {
                var strGet =  this.get;
                var txtExp  =  strGet(CACHEDATA, "Expires")["msg"];
                var timetamp = new Date().getTime(), timeExp = new Date(txtExp).getTime();
                if (timetamp <= timeExp){
                    return { "msg": unescape(arr[2]), "code": 1 };
                }else{
                    return {"msg":"time out!","code":-1};
                }
            }
            else {
                return { "msg": "not found", "code": 0 };
            }
        }else{
            if (arr = session_id.match(reg)){
                return { "msg": unescape(arr[2]), "code": 1 };
            }
            else{
                return { "msg": "not found", "code": 0 };
            }
        }
    }catch(e){}
};
module.exports = CACHE;
