function randomString() {
    var result = '';
    const length = 16
    const chars = '0123!456789abcdefghij!klmnopqrstuvwxyzABCDEFG!HIJKLMNOPQR!STUXYZ.!'
    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
    return result;
}


module.exports = randomString;