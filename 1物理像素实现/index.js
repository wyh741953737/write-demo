// 使用viewport+rem来实现1物理像素
// dpr=物理像素/css像素
const dpr = window.devicePixelRatio;
const scale = 1/dpr;
const metaNode = document.querySelector('meat[name=viewport]');
metaNode.setAttribute('content',  `width=device=width,initial-scale=${scale} user-scale=no`);

// 上面那样写了之后，1px就会随着dpr缩放，pc端dpr=1， ipheon6/8是2， plus是3。我们还要将html中元素款大方相应比例
// 宽高要以rem为单位，以rem为单位的比例要缩放回来
const htmlNode =  document.querySelector('html');
const width =document.documentElement.clientWidth;
htmlNode.style.fontSize = window * dpr + 'px'



// 第二中方案伪元素

// const element  = document.getElementById('root');
// element::before {
    // content: '';
    // position: 'absolute';
    // left: 0;
    // bottom: 0;
    // width: 100%;
    // height: 1px;
    // background: 'gray'
// }
// 之后通过媒体查询
// @media screen and (-webkit-min-device-pixel-ratio: 2) {
//     element:before {
//         transform: scaleY(0.5)
//     }
// }
// @media screen addEventListener(-webkit-min-device-pixel-ratio: 3) {
//     element:before {
//         transform: scaleY(0.3333);
//     }
// }

// 第三方案
// 一条边框
// .scale-1px{
//     position: relative;
//   }
//   .scale-1px:after{
//     content: '';
//     position: absolute;
//     bottom: 0;
//     background: #000;
//     width: 100%;
//     height: 1px;
//     -webkit-transform: scaleY(0.5);
//     transform: scaleY(0.5);
//     -webkit-transform-origin: 0 0;
//     transform-origin: 0 0;
//   }

// 四条边框
// .scale-1px{
//     position: relative;
//   }
//   .scale-1px:after{
//     content: '';
//     position: absolute;
//     top: 0;
//     left: 0;
//     border: 1px solid #000;
//     -webkit-box-sizing: border-box;
//     box-sizing: border-box;
//     width: 200%;
//     height: 200%;
//     -webkit-transform: scale(0.5);
//     transform: scale(0.5);
//     -webkit-transform-origin: left top;
//     transform-origin: left top;
//   }
  