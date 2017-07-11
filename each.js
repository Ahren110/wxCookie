function _EACHFN(obj, callback) {
    var length = obj.length;
    if (length === undefined) {
        for (var name in obj) {
            if (obj.hasOwnProperty(name)) {
                if (callback.call(obj[name], obj[name], name) === false) {
                    break;
                }
            }
        }
    } else {
        for (var i = 0; i < length; i++) {
            if (callback.call(obj[i], obj[i], i) === false) {
                break;
            }
        }
    }
}
module.exports = _EACHFN;