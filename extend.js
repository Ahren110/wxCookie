var extend, mi_extend, _isObject;
_isObject = function (o) {
    return Object.prototype.toString.call(o) === '[object Object]';
};
mi_extend = function self(destination, source) {
    try {
        var property;
        for (property in destination) {
            if (destination.hasOwnProperty(property)) {
                // 若destination[property]和sourc[property]都是对象，则递归
                if (_isObject(destination[property]) && _isObject(source[property])) {
                    self(destination[property], source[property]);
                };
                // 若sourc[property]已存在，则跳过
                if (source.hasOwnProperty(property)) {
                    continue;
                } else {
                    source[property] = destination[property];
                }
            }
        }
    } catch (e) {
        // TODO: handle exception
    }
};
extend = function () {
    var arr = arguments,
        result = {},
        i;
    if (!arr.length) return {};
    for (i = arr.length - 1; i >= 0; i--) {
        if (_isObject(arr[i])) {
            mi_extend(arr[i], result);
        };
    }
    arr[0] = result;
    return result;
};
module.exports = extend;