/* jshint undef: true, unused: true */
/* jshint expr: true, boss: true */
/* jshint browser: true, devel: true, jquery: true*/
/* global plupload*/

var Q = {};

Q.avatarUrl = '';
Q.photoUrl = '';
Q.photoSize = {
    width: 0,
    height: 0
};
Q.photoStyle = '';
Q.template = {
    newyear: {
        post: '哥哥从南非给我带回来的5克拉蓝色钻石，可惜春节在夏威夷度假，玩的太high, 晒得有点黑~~偶朋友圈的小姐伙伴们，你们的春节假期怎么过？',
        persons: ["李娜", "潘石屹", "任志强", "马云", "史玉柱", "庆丰包子铺", "郭敬明", "韩寒"],
        comments: [
            ['李娜', '我从来没想过在中国以外的地方生活，因为我小时候在国外打球训练，很不习惯，必须得回家。我还是回家“挤春运”吧！'],
            ['$name', '李娜', '娜样精彩！'],
            ['潘石屹', '我给乡亲卖苹果！义务代言家乡天水的苹果。网上很多人骂我，说我（代言“潘苹果”）赚了不少钱。我的代言、捧场完全是义务的，我没有赚钱，我还贴了钱。'],
            ['任志强', '潘石屹', '别听小潘瞎忽悠！'],
            ['庆丰包子铺', '奋笔疾书写文案：“庆丰包子铺酱肉包子”制作秘籍，“从庆丰包子铺的21元套餐看名人营销”以及“春节期间庆丰包子铺旅游团开团”。'],
            ['郭敬明', '又是这样漫长而灰蒙蒙的冬季 - 我们的爱，恨，感动，伤怀。'],
            ['韩寒', '郭敬明', '小四，“萌”你比不过我哦！'],
            ['冯小刚', '你丫看春晚怎么不吐槽！'],
            ['李娜', '我从来没想过在中国以外的地方生活，因为我小时候在国外打球训练，所以我不知道']
        ]
    }
};

var FONT = '微软雅黑';
var NAME_SIZE = 32,
    POST_SIZE = 28,
    LIKE_SIZE = 26,
    COMMENT_SIZE = 26;

Q.utf8_encode = function(argString) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // +   bugfixed by: Rafal Kukawski
    // +   improved by: kirilloid
    // +   bugfixed by: kirilloid
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    if (argString === null || typeof argString === 'undefined') {
        return '';
    }

    var string = (argString + ''); // .replace(/\r\n/g, '\n').replace(/\r/g, '\n');
    var utftext = '',
        start, end, stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode(
                (c1 >> 6) | 192, (c1 & 63) | 128
            );
        } else if (c1 & 0xF800 ^ 0xD800 > 0) {
            enc = String.fromCharCode(
                (c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        } else { // surrogate pairs
            if (c1 & 0xFC00 ^ 0xD800 > 0) {
                throw new RangeError('Unmatched trail surrogate at ' + n);
            }
            var c2 = string.charCodeAt(++n);
            if (c2 & 0xFC00 ^ 0xDC00 > 0) {
                throw new RangeError('Unmatched lead surrogate at ' + (n - 1));
            }
            c1 = ((c1 & 0x3FF) << 10) + (c2 & 0x3FF) + 0x10000;
            enc = String.fromCharCode(
                (c1 >> 18) | 240, ((c1 >> 12) & 63) | 128, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128
            );
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.slice(start, end);
            }
            utftext += enc;
            start = end = n + 1;
        }
    }

    if (end > start) {
        utftext += string.slice(start, stringl);
    }

    return utftext;
};

Q.base64_encode = function(data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='
    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
        ac = 0,
        enc = '',
        tmp_arr = [];

    if (!data) {
        return data;
    }

    data = Q.utf8_encode(data + '');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1 << 16 | o2 << 8 | o3;

        h1 = bits >> 18 & 0x3f;
        h2 = bits >> 12 & 0x3f;
        h3 = bits >> 6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
            break;
        case 2:
            enc = enc.slice(0, -1) + '=';
            break;
    }

    return enc;
};

Q.URLSafeBase64Encode = function(v) {
    v = Q.base64_encode(v);
    return v.replace(/\//g, '_').replace(/\+/g, '-');
};

//UTF-8 decoding
Q.utf8_decode = function(str_data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: kirilloid
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var tmp_arr = [],
        i = 0,
        ac = 0,
        c1 = 0,
        c2 = 0,
        c3 = 0,
        c4 = 0;

    str_data += '';

    while (i < str_data.length) {
        c1 = str_data.charCodeAt(i);
        if (c1 <= 191) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if (c1 <= 223) {
            c2 = str_data.charCodeAt(i + 1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else if (c1 <= 239) {
            // http://en.wikipedia.org/wiki/UTF-8#Codepage_layout
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        } else {
            c2 = str_data.charCodeAt(i + 1);
            c3 = str_data.charCodeAt(i + 2);
            c4 = str_data.charCodeAt(i + 3);
            c1 = ((c1 & 7) << 18) | ((c2 & 63) << 12) | ((c3 & 63) << 6) | (c4 & 63);
            c1 -= 0x10000;
            tmp_arr[ac++] = String.fromCharCode(0xD800 | ((c1 >> 10) & 0x3FF));
            tmp_arr[ac++] = String.fromCharCode(0xDC00 | (c1 & 0x3FF));
            i += 4;
        }
    }

    return tmp_arr.join('');
};

Q.base64_decode = function(input) {
    var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
    var output = "";
    var chr1, chr2, chr3;
    var enc1, enc2, enc3, enc4;
    var i = 0;
    if (!input) {
        return input;
    }
    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '');

    while (i < input.length) {

        enc1 = b64.indexOf(input.charAt(i++));
        enc2 = b64.indexOf(input.charAt(i++));
        enc3 = b64.indexOf(input.charAt(i++));
        enc4 = b64.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 !== 64) {
            output = output + String.fromCharCode(chr2);
        }
        if (enc4 !== 64) {
            output = output + String.fromCharCode(chr3);
        }

    }

    output = Q.utf8_decode(output);

    return output;
};

Q.URLSafeBase64Decode = function(v) {
    if (typeof v !== 'string') {
        return null;
    }
    v = v.replace(/_/g, '/').replace(/\-/g, '+');
    return Q.base64_decode(v);
};

Q.d = function(x, y) {
    return '/dx/' + x + '/dy/' + y + '/gravity/NorthWest';
};

Q.text = function(str, font, size, color, dx, dy) {
    var t = Q.URLSafeBase64Encode(str),
        f = Q.URLSafeBase64Encode(font),
        c = Q.URLSafeBase64Encode(color);
    return '/text/' + t + '/font/' + f + '/fontsize/' + size * 20 + '/fill/' + c + Q.d(dx, dy);
};

Q.image = function(url, dx, dy) {
    return '/image/' + Q.URLSafeBase64Encode(url) + Q.d(dx, dy);
};

Q.getStyleAndDy = function() {
    var result = {
        styleName: '',
        dy: 0
    };
    var w = Q.photoSize.width,
        h = Q.photoSize.height;
    if (w > 570 || h > 400) {
        if (w / h > 570 / 400) {
            result.styleName = '-phw';
            result.dy = 570 * h / w;
        } else if (w / h < 570 / 400) {
            result.styleName = '-phh';
            result.dy = 400;
        } else {
            result.styleName = '-phfull';
            result.dy = 400;
        }
    } else if (w > 0 && h > 0) {
        result.dy = h;
    }
    result.dy = Math.floor(result.dy) + 1;
    return result;
};

Q.len = function(str) {
    var flag = 0,
        len = 0;
    for (var i = 0; i < str.length; i++) {
        if (/[A-Za-z0-9]/.test(str[i])) {
            if (flag === 1) len++;
            flag = (flag + 1) % 2;
        } else {
            len++;
        }
    }
    return len + flag;
};
Q.split2line = function(post, linesize, offset) {
    var msg = post,
        limit = linesize - offset,
        lines = [];
    var flag = 0;
    var count = 0;
    for (var i = 0; i < msg.length; i++) {
        if (/[A-Za-z0-9]/.test(msg[i])) {
            if (flag === 0) limit++;
            flag = (flag + 1) % 2;
        }
        if (count === limit) {
            lines.push(msg.slice(i - limit, i));
            limit = linesize;
            count = 0;
            count++;
        } else if (i === msg.length - 1) {
            lines.push(msg.slice(i - count, i + 1));
            break;
        } else {
            count++;
        }
    }
    return lines;
};

Q.split2LikeLine = function(persons) {
    var lines = [],
        temp = [],
        tempLen = 0;
    var limit = 17;
    for (var i = 0; i < persons.length; i++) {
        if (tempLen + Q.len(persons[i]) > limit) {
            lines.push(temp.join(', ') + ',');
            temp = [];
            tempLen = 0;
        }
        temp.push(persons[i]);
        tempLen += Q.len(persons[i]);
        if (i === persons.length - 1) {
            lines.push(temp.join(', '));
            break;
        }
    }
    return lines;
};

Q.initPluploader = function(browse_button_id, container_id, progress_id, error_id) {
    var uploader = new plupload.Uploader({
        runtimes: 'html5,flash,silverlight,html4',
        browse_button: document.getElementById(browse_button_id),
        container: document.getElementById(container_id),
        max_file_size: '100mb',
        url: 'http://up.qiniu.com',
        flash_swf_url: 'js/plupload/Moxie.swf',
        silverlight_xap_url: 'js/plupload/Moxie.xap',
        multi_selection: false,
        filters: {
            mime_types: [{
                title: "Image files",
                extensions: "jpg,gif,png"
            }]
        },
        multipart: true,
        multipart_params: {
            key: '',
            token: ''
        }
    });

    uploader.bind('Init', function(up, params) {
        //显示当前上传方式，调试用
        $.ajax({
            url: '/token',
            type: 'GET',
            cache: false,
            success: function(data) {
                if (data && data.token) {
                    up.settings.multipart_params.token = data.token;
                }
            },
            error: function(error) {
                console.log(error);
            }
        });
    });
    uploader.init();

    uploader.bind('FilesAdded', function(up, files) {
        up.start();
        up.refresh(); // Reposition Flash/Silverlight
    });

    uploader.bind('BeforeUpload', function(up, file) {
        var prefix = '';
        switch (browse_button_id) {
            case 'uploadAvatar':
                prefix = 'avatar/';
                break;
            case 'uploadPhoto':
                prefix = 'photo/';
                break;
            default:
                prefix = 'default/';
        }
        prefix += (new Date()).valueOf() + '/';
        up.settings.multipart_params.key = prefix + file.name;
    });

    uploader.bind('UploadProgress', function(up, file) {
        document.getElementById(progress_id).innerHTML = file.percent + "%," + up.total.bytesPerSec;
    });

    uploader.bind('Error', function(up, err) {
        document.getElementById(error_id).innerHTML += "\nError #" + err.code + ": " + err.message;
        up.refresh(); // Reposition Flash/Silverlight
    });


    uploader.bind('FileUploaded', function(up, file, info) {
        var res = $.parseJSON(info.response);
        var link = 'http://zhuangbility.qiniudn.com/';
        if (res.key.indexOf('avatar/') > -1) {
            Q.avatarUrl = link + res.key;
        } else if (res.key.indexOf('photo/') > -1) {
            Q.photoUrl = link + res.key;
            console.log(Q.photoUrl);
            Q.imgReady(Q.photoUrl, function() {
                console.log(this.width, this.height);
                Q.photoSize.width = this.width;
                Q.photoSize.height = this.height;
                console.log(Q.photoSize);
            }, null, null);
        }
        document.getElementById(progress_id).innerHTML = '上传成功';
    });
};

Q.imgReady = (function() {
    var list = [],
        intervalId = null,

        // 用来执行队列
        tick = function() {
            var i = 0;
            for (; i < list.length; i++) {
                list[i].end ? list.splice(i--, 1) : list[i]();
            }
            (!list.length) && stop();
        },

        // 停止所有定时器队列
        stop = function() {
            clearInterval(intervalId);
            intervalId = null;
        };

    return function(url, ready, load, error) {
        var onready, width, height, newWidth, newHeight,
            img = new Image();
        img.src = url;

        // 如果图片被缓存，则直接返回缓存数据
        if (img.complete) {
            ready.call(img);
            load && load.call(img);
            return;
        }

        width = img.width;
        height = img.height;

        // 加载错误后的事件
        img.onerror = function() {
            error && error.call(img);
            onready.end = true;
            img = img.onload = img.onerror = null;
        };

        // 图片尺寸就绪
        onready = function() {
            newWidth = img.width;
            newHeight = img.height;
            if (newWidth !== width || newHeight !== height ||
                // 如果图片已经在其他地方加载可使用面积检测
                newWidth * newHeight > 1024
            ) {
                ready.call(img);
                onready.end = true;
            }
        };
        onready();

        // 完全加载完毕的事件
        img.onload = function() {
            // onload在定时器时间差范围内可能比onready快
            // 这里进行检查并保证onready优先执行
            !onready.end && onready();
            load && load.call(img);
            // IE gif动画会循环执行onload，置空onload即可
            img = img.onload = img.onerror = null;
        };

        // 加入队列中定期执行
        if (!onready.end) {
            list.push(onready);
            // 无论何时只允许出现一个定时器，减少浏览器性能损耗
            if (intervalId === null) intervalId = setInterval(tick, 40);
        }
    };
})();


$(function() {
    var getName = function() {
        return document.getElementById('name').value;
    };
    var getPost = function() {
        return document.getElementById('post').value;
    };
    var getPerson = function() {
        var likes = document.getElementsByClassName('like');
        var p = [];
        for (var i = 0; i < likes.length; i++) {
            if (likes[i].value !== '') {
                p.push(likes[i].value);
            }
        }
        return p;
    };
    var getComments = function() {
        var comments = document.getElementsByClassName('comment');
        var c = [];
        for (var i = 0; i < comments.length; i++) {
            var namea = comments[i].getElementsByClassName('namea')[0].value,
                nameb = comments[i].getElementsByClassName('nameb')[0].value,
                msg = comments[i].getElementsByClassName('msg')[0].value;
            var line = [];
            if (namea !== '') {
                line.push(namea);
                if (nameb !== '') {
                    line.push(nameb);
                }
                if (msg !== '') {
                    line.push(msg);
                }
            }
            if (line.length > 0) {
                c.push(line);
            }
        }
        return c;
    };
    // render functions
    // ------------------------------------------------
    var render = {};
    render.avatar = function(url, dy) {
        return {
            url: url ? Q.image(url + '-ava', 24, dy) : '',
            h: 72
        };
    };
    render.name = function(name, dy) {
        return {
            url: Q.text(name, FONT, NAME_SIZE, '#506992', 122, dy),
            h: 52
        };
    };
    render.post = function(postMsg, oy) {
        var y = oy,
            result = '',
            lines = Q.split2line(postMsg, 20, 0);
        for (var i = 0; i < lines.length; i++) {
            result += Q.text(lines[i], FONT, POST_SIZE, 'black', 122, y + i * 33);
        }
        return {
            url: result,
            h: lines.length * 33
        };
    };
    render.photo = function(url, dy) {
        var ret = Q.getStyleAndDy(),
            photo = url ? Q.image(url + ret.styleName, 122, dy) : '';
        return {
            url: photo,
            h: ret.dy
        };
    };
    render.bubblehead = function(dy) {
        var bubbleheadUrl = 'http://zhuangbility.qiniudn.com/bubblehead.png';
        return {
            url: Q.image(bubbleheadUrl, 122, dy),
            h: 60
        };
    };
    render.likes = function(persons, oy) {
        var like1Url = 'http://zhuangbility.qiniudn.com/like1.png',
            like2Url = 'http://zhuangbility.qiniudn.com/like2.png',
            result = '';
        var lines = Q.split2LikeLine(persons);
        for (var i = 0; i < lines.length; i++) {
            result += Q.image(i === 0 ? like1Url : like2Url, 122, oy + i * 33);
            result += Q.text(lines[i], FONT, LIKE_SIZE, '#506991', i === 0 ? 178 : 134, oy - 5 + i * 33);
        }
        return {
            url: result,
            h: lines.length * 33
        };
    };
    render.cutline = function(dy) {
        var cutlineUrl = 'http://zhuangbility.qiniudn.com/cutline.png';
        return {
            url: Q.image(cutlineUrl, 122, dy),
            h: 14
        };
    };
    render.comments = function(comments, oy) {
        var commentUrl = 'http://zhuangbility.qiniudn.com/comment.png';
        var firstLine = function(name, src, dx, dy) {
            var result = '';
            var nameLen = Q.len(name);
            result += Q.image(commentUrl, 122, dy);
            result += Q.text(name, FONT, COMMENT_SIZE, '#556d93', dx, dy);
            result += Q.text(': ' + src, FONT, COMMENT_SIZE, '#3d3b3c', dx + COMMENT_SIZE * nameLen, dy);
            return result;
        };
        var firstLineReply = function(namea, nameb, src, dx, dy) {
            var result = '';
            var nameLena = Q.len(namea),
                nameLenb = Q.len(nameb);
            var x = dx;

            result += Q.image(commentUrl, 122, dy);
            result += Q.text(namea, FONT, COMMENT_SIZE, '#556d93', x, dy);
            x += COMMENT_SIZE * nameLena + 2;
            result += Q.text('回复', FONT, COMMENT_SIZE, '#3d3b3c', x, dy);
            x += COMMENT_SIZE * 2 + 2;
            result += Q.text(nameb, FONT, COMMENT_SIZE, '#556d93', x, dy);
            x += COMMENT_SIZE * nameLenb;
            result += Q.text(': ' + src, FONT, COMMENT_SIZE, '#3d3b3c', x, dy);
            return result;
        };
        var allLine = function(src, dx, dy) {
            var result = '';
            result += Q.image(commentUrl, 122, dy);
            result += Q.text(src, FONT, COMMENT_SIZE, '#3d3b3c', dx, dy);
            return result;
        };

        var result = '',
            y = oy;
        for (var i = 0; i < comments.length; i++) {
            var nameLen = 0;
            var comLines = [];
            if (comments[i].length === 3) {
                var namea = comments[i][0],
                    nameb = comments[i][1];
                nameLen = Q.len(namea) + Q.len(nameb) + 2;
                comLines = Q.split2line(comments[i][2], 20, nameLen);
                result += firstLineReply(namea, nameb, comLines[0], 134, y);
            } else {
                var name = comments[i][0];
                nameLen = Q.len(name);
                comLines = Q.split2line(comments[i][1], 20, nameLen);
                result += firstLine(name, comLines[0], 134, y);
            }
            y += 40;
            if (comLines.length > 1) {
                for (var j = 1; j < comLines.length; j++) {
                    result += allLine(comLines[j], 134, y);
                    y += 40;
                }
            }
        }
        return {
            url: result,
            h: y
        };
    };
    render.bubblefoot = function(dy) {
        var bubblefootUrl = 'http://zhuangbility.qiniudn.com/v1/bubblefoot.png';
        return {
            url: Q.image(bubblefootUrl, 0, dy),
            h: 40
        };
    };
    var buildURL = function() {
        var BG = 'http://zhuangbility.qiniudn.com/v2/whitebg.png';

        var renderList = [],
            scanLine = 132;

        // step 1: render avatar
        var avatar = render.avatar(Q.avatarUrl, 138);
        renderList.push(avatar.url);

        // step 2: render name
        var nameTxt = getName();
        var name = render.name(nameTxt, scanLine);
        renderList.push(name.url);
        scanLine += name.h;

        // step 3: render post
        var postMsg = getPost();
        var post = render.post(postMsg, scanLine);
        renderList.push(post.url);
        scanLine += post.h + 26;

        // step 4: render photo
        var photo = render.photo(Q.photoUrl, scanLine);
        renderList.push(photo.url);
        scanLine += photo.h + 16;

        // render bubblehead
        var bubblehead = render.bubblehead(scanLine);
        renderList.push(bubblehead.url);
        scanLine += bubblehead.h;

        // step 5: render likes
        var persons = getPerson();
        var likes = render.likes(persons, scanLine); // TODO
        renderList.push(likes.url);
        scanLine += likes.h;

        // step 6: render comments
        var commentsList = getComments();
        if (commentsList.length > 0) {
            var cutline = render.cutline(scanLine);
            renderList.push(cutline.url);
            scanLine += cutline.h;

            var comments = render.comments(commentsList, scanLine); // TODO
            renderList.push(comments.url);
            scanLine += comments.h;
        }

        // render bubblefoot
        var bubblefoot = render.bubblefoot(scanLine);
        renderList.push(bubblefoot.url);
        scanLine += bubblefoot.h;

        return BG + '?watermark/3' + renderList.join('');
    };
    // ------------------------------------------------
    var addLike = function(n) {
        var LIKE_TMPL = '<div class="form-group col-md-12 col-sm-6"><input class="like form-control"></div>';
        var l = n || 1,
            strEl = '';
        for (var i = 0; i < l; i++) {
            strEl += LIKE_TMPL;
        }
        $('#likes').append(strEl);
    };
    var addComment = function(n) {
        var COMMENT_TMPL = '<div class="comment form-group"><div class="row"><div class="col-xs-6"><label class="control-label">name 1:</label><input class="namea form-control"></div><div class="col-xs-6"><label class="control-label">name 2:</label><input class="nameb form-control"></div><div class="col-xs-12"><label class="control-label">msg:</label><input class="msg form-control"></div></div></div>';
        var l = n || 1,
            strEl = '';
        for (var i = 0; i < l; i++) {
            strEl += COMMENT_TMPL;
        }
        $('#comments').append(strEl);
    };
    var loadTemplate = function(template) {
        var name = $('#name').val();
        var fillPost = function(post) {
            $('#post').val(post);
        };
        var fillLikes = function(persons) {
            $('#likes').html('');
            addLike(persons.length);
            var i = 0;
            $('.like').each(function() {
                if (i >= persons.length) {
                    return;
                }
                $(this).val(persons[i++]);
            });
        };
        var fillComments = function(comments) {
            $('#comments').html('');
            addComment(comments.length);
            var i = 0;
            $('.comment').each(function() {
                if (i >= comments.length) {
                    return;
                }
                $(this).find('.namea').val(comments[i][0].replace('$name', name));
                if (comments[i].length === 3) {
                    $(this).find('.nameb').val(comments[i][1].replace('$name', name));
                    $(this).find('.msg').val(comments[i][2]);
                } else {
                    $(this).find('.msg').val(comments[i][1]);
                }
                i++;
            });
        };
        fillPost(template.post);
        fillLikes(template.persons);
        fillComments(template.comments);
    };

    Q.initPluploader('uploadAvatar', 'upload-wrapper-1', 'progess-1', 'error-1');
    Q.initPluploader('uploadPhoto', 'upload-wrapper-2', 'progess-2', 'error-2');
    $('#btn').on('click', function() {
        var img = document.getElementById('demo');
        var src = buildURL();
        img.src = src;
    });
    $('#load').on('click', function() {
        loadTemplate(Q.template.newyear);
    });
    $('#add-like').on('click', function() {
        addLike();
    });
    $('#add-comment').on('click', function() {
        addComment();
    });
});
