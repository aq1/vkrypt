var encrypt = function(text, key) {
    // Convert text to bytes
    var textBytes = aesjs.utils.utf8.toBytes(text);

    // The counter is optional, and if omitted will begin at 1
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var encryptedBytes = aesCtr.encrypt(textBytes);

    // To print or store the binary data, you may convert it to hex
    var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
    return 'secret:' + encryptedHex;
    // console.log(encryptedHex);
    // document.getElementsByClassName('im_editable')[0].innerHTML = encryptedHex;
    // 'a338eda3874ed884b6199150d36f49988c90f5c47fe7792b0cf8c7f77eeffd87
    //  ea145b73e82aefcf2076f881c88879e4e25b1d7b24ba2788'
    var end = performance.now();
    // console.log(end - start);
};


var decrypt = function(text, key) {

    // When ready to decrypt the hex string, convert it back to bytes
    if (!text.startsWith('secret:')) {
        return text;
    }
    text = text.replace(/^secret:/, '')
    var encryptedBytes = aesjs.utils.hex.toBytes(text);

    // The counter mode of operation maintains internal state, so to
    // decrypt a new instance must be instantiated.
    console.log('decrypt');
    var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
    var decryptedBytes = aesCtr.decrypt(encryptedBytes);
    console.log('decrypt key');

    // Convert our bytes back into text
    var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
    return decryptedText;
    // console.log(decryptedText);
}

window.I = 0;
var checkMessages = function() {
    var divs = document.getElementsByClassName('im-mess--text');
    for (var i = window.I; i < divs.length; i++) {
        divs[i].innerText = decrypt(divs[i].innerText, window.SUPER_SECRET_KEY);
    }
    // window.I = i;
};

setInterval(checkMessages, 100);

var findKey = function() {
    var start = performance.now();

    var password = new buffer.SlowBuffer('VERY LONG PASSWORD BEATCH'.normalize('NFKC'));
    var salt = new buffer.SlowBuffer('someSalt'.normalize('NFKC'));

    var N = 1024,
        r = 8,
        p = 1;
    var dkLen = 32;

    scrypt(password, salt, N, r, p, dkLen, function(error, progress, key) {
        if (key) {
            window.SUPER_SECRET_KEY = key;
            patchVK(key);
        }
    }); 
};


var patchVK = function(key) {
    var _ajaxPost = ajax.post;
    var ajaxPost = function(url, query, options) {
        // console.log(arguments);
        if (query.act == 'a_send' && query.to == '452444087') {
            query.msg = encrypt(query.msg, key);
        }
        _ajaxPost(url, query, options);
    };
    window.ajax.post = ajaxPost;
    console.log('VKrypt is loaded');
};


findKey();
