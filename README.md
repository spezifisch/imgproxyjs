# imgproxyjs

![npm](https://img.shields.io/npm/dm/@spezifisch/imgproxyjs)
![npm](https://img.shields.io/npm/v/@spezifisch/imgproxyjs)
![npm bundle size](https://img.shields.io/bundlephobia/min/@spezifisch/imgproxyjs)

This fork adds:

* `presetOnly` option
* dependency updates

## Javascript client (nodejs/browser) for [imgproxy](https://imgproxy.net/)

    import { ImgProxy } from '@spezifisch/imgproxyjs';
    const instance = new ImgProxy({url: 'https://imgproxy.test.com'}, {size:{width:40, height: 40, enlarge:true, extend:false}, background: '#ffffff'});

    const finalImg = instance.get("http://images.com/logo.png");
