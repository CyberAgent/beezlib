beezlib
=========

[![NPM](https://nodei.co/npm/beezlib.png)](https://nodei.co/npm/beezlib/)


## About

Node.js library for beez and beez-founation with beez-tools.


## Used Project

- [beez](https://github.com/CyberAgent/beez)
- [beez-foundation](https://github.com/CyberAgent/beez-foundation)
- [beez-tools](https://github.com/CyberAgent/beez-tools)

## Requirements

- [ImageMagick](http://www.imagemagick.org/script/index.php)
- [Underscore.js](http://underscorejs.org/)
- [mkdirp](https://github.com/substack/node-mkdirp)
- [suns.js](https://github.com/CyberAgent/suns.js)
- [handlebars](http://handlebarsjs.com/)
- [jsonminify](https://github.com/fkei/JSON.minify)
- [Stylus](http://learnboost.github.com/stylus/)
- [nib](https://github.com/visionmedia/nib)
- [colors](https://npmjs.org/package/colors)
- [jshint](https://npmjs.org/package/jshint)
- [beez-ua](https://github.com/CyberAgent/beez-ua)
- [node-spritesheet](https://github.com/shibucafe/node-spritesheet)
- [mocha](https://npmjs.org/package/mocha)
- [should](https://npmjs.org/package/should)
- [jsdoc3](https://github.com/jsdoc3/jsdoc)


## Features

- sprite
    - 複数画像を一枚にする
    - StylusファイルでCSSを出力可能
- stylus
    - コンパイル
    - b64 サポート
    - web-font サポート
    - nib 標準搭載
- image
    - optipng
    - imagemagick
        - 画像サイズ取得
        - ファイル名のpixelRatioから、それ以外のpixelRatio画像をリサイズ
- fsys
    - ファイルのタイプを判定(file, directory, block device, charactor device, symlink, fifo, socket)
    - rm -rf (sync) : フォルダ削除
    - mkdir -p (async|sync) : フォルダ作成
    - glob : フォルダ内を走査
    - JSONファイルを読み込む
    - JSファイル(JSON)を読み込む
    - chmod ファイル権限変更
    - cp : ファイルコピー
    - ファイルパスの '~' をパスに変換
- fsys.store
    - ディレクトリ内の、JSON, Function-JSON ファイルをまとめてロードし保持する。
        - Auto-load
- simple logging
    - ログレベル、端末のカラーリング、ログ出力行番号サポート
- obj
    - cp -rf フォルダ内を再帰的にコピー
- template
    - handlebars
        - hbs to hbsc.js
        - hbsp to hbsp.js
        - require.beez.js.hbs to require.beez.hbsc.js
        - hbs to hbsc to html

## Install

```sh
$ npm install beezlib
```

## Test

```sh
$ npm install .
$ make test
```

## jshint

```sh
$ npm install .
$ make jshint
```

## jsdoc

```sh
$ npm install .
$ make jsdoc
```

# Documents

## Load configuration file (javascript/json)

You can load configuration file writeen by json, javascript.

**test/json/item.json**

```json
{
    "item": { // item data
        "fruit": "Orange"
    }
}
```


**test/json/json.js**

```javascript
(function () {

    // You can use these global objects on Node.js.
    // 'process', 'require', '__filename', '__dirname', 'module', 'exports'
    
    var fs = require('fs'); // sample

    return {
        hoge: "foo"
    };
}());
```

> Support node.js global object


## Contributing


- Kei FUNAGAYAMA - [@fkei](https://twitter.com/fkei) [github](https://github.com/fkei)
- Kazuma MISHIMAGI - [@maginemu](https://twitter.com/maginemu) [github](https://github.com/maginemu)
- HIRAKI Satoru - [github](https://github.com/Layzie)
- Yuhei Aihara - [github](https://github.com/yuhei-a)

## Copyright

CyberAgent, Inc. All rights reserved.

## LICENSE

@see : [LICENSE](https://raw.github.com/CyberAgent/beezlib/master/LICENSE)

```
The MIT License (MIT)

Copyright © CyberAgent, Inc. All Rights Reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

```


[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/CyberAgent/beezlib/trend.png)](https://bitdeli.com/free "Bitdeli Badge")

