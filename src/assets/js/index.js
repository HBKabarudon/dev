// swiper読み込み
import Swiper from "swiper/bundle";
import "../../../node_modules/swiper/swiper-bundle.css";

//scss読み込み
import "../scss/style.scss";

//サポートするviewportの最小値を設定
(function () {
  const setSize = 360; //　希望のviewport下限を設定
  const viewport = document.querySelector("meta[name='viewport']");
  function adjustViewport() {
    /*
    三項演算子(条件演算子)
    condition ? exprIfTrue(trueに変換できる値) : exprIfFalse(falseに変換できる値)
    */
    const value = window.outerWidth > setSize ? "width=device-width,initial-scale=1" : "width=" + setSize;
    if (viewport.getAttribute("content") !== value) {
      viewport.setAttribute("content", value);
    }
  }
  addEventListener("resize", adjustViewport);
  adjustViewport();
})();

// メディアクエリ
let mediaFlag;
const mediaQueryTablet = window.matchMedia("(min-width: 768px) and (max-width: 1024px)");
const mediaQueryMobile = window.matchMedia("(max-width: 767px)");
const mediaQueryPC = window.matchMedia("(min-width: 1025px)");
 
function mediaCheckMobile(event) {
  if (event.matches) {
    mediaFlag = "mobile";
  }
}
 
function mediaCheckTablet(event) {
  if (event.matches) {
    mediaFlag = "tablet";
  }
}
 
function mediaCheckPC(event) {
  if (event.matches) {
    mediaFlag = "pc";
  }
}
 
/* windowのresizeではなくmatchMediaのchangeで変更を監視 */
mediaQueryMobile.addEventListener("change", mediaCheckMobile);
mediaQueryTablet.addEventListener("change", mediaCheckTablet);
mediaQueryPC.addEventListener("change", mediaCheckPC);
/* ブラウザ表示時に初期実行 */
mediaCheckMobile(mediaQueryMobile);
mediaCheckTablet(mediaQueryTablet);
mediaCheckPC(mediaQueryPC);
 
/* mediaFlagで処理を出し分け */
// 例 if (mediaFlag == "pc" || mediaFlag == "tablet") {~処理内容~}
if (mediaFlag === "pc") {
  // pc時の処理
}
 
if (mediaFlag === "tablet") {
  // tablet時の処理
}
 
if (mediaFlag === "mobile") {
  // mobile時の処理内容
}


//スクロールでアニメーションクラスを追加
if (document.querySelector(".anm") != null) {
  /*  .anmが付与されている要素全てをターゲットに設定  */
  const anm = document.querySelectorAll(".anm");

  /*  IntersectionObserverのオプションを設定可能(省略可能) */
  const options = {
    /*  交差を判定するトリガーを指定可能。指定しない場合はviewportがトリガーになる
        指定する場合は document.querySelector('.hoge') 等 */
    root: null,

    /*  交差位置 = 交差を監視している要素の座標 + ここに指定した数値(px % を指定可能)になる
        正数指定 = 要素の上辺が、指定した数値分画面に入る前に処理が開始
        負数指定 = 要素の上辺が、指定した数値分画面に入ってから処理が開始 */
    rootMargin: "-8%",

    /*  コールバック関数を実行する閾値を指定可能
        [0] = ターゲット要素が見え始め・見える終わりのタイミングで実行
        [0.5] = ターゲット要素の半分を通過したタイミングで実行
        [1] = ターゲット要素の下辺まで到達したタイミングで実行  */
    threshold: [0],
  };

  /*  IntersectionObserverを実行するためのインスタンスを生成
      (コールバック関数,オプション)の順で引数を記述(optionは省略可能)  */
  const observe = new IntersectionObserver(addAnimation, options);

  anm.forEach(function (elem, index) {
    /*  引数に記述した要素をターゲット要素としてIntersectionObserverを実行 */
    observe.observe(elem);
  });

  /*  IntersectionObserverのコールバック関数を設定
      引数(entries)に交差オブジェクトの配列が格納されている */
  function addAnimation(entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        /*  交差判定がtrueの場合  */
        entry.target.classList.add("is-show");
      } else {
        /*  交差判定がfalseの場合
          一度実行されたらアニメーションを反復させたくない場合はelse文を削除 */
        entry.target.classList.remove("is-show");
      }
    });
  }
}

//ハンバーガーメニュー
if (document.querySelector(".js-globalMenuButton") != null) {
  const globalMenu = document.querySelector(".js-globalMenuButton");
  const globalMenuInner = document.querySelector(".js-globalmenuInner");
  const globalMenuInnerList = document.querySelector(".js-globalmenuNavigation");
  const globalMenuAnchor = document.querySelectorAll(".js-globalmenuAnchor");
  const bars = document.querySelectorAll(".js-bar1,.js-bar2,.js-bar3");
  const body = document.body;
  let scrollTop;
  let scrollTopBack;
  globalMenu.addEventListener("click", function () {
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (globalMenu.getAttribute("aria-label") === "サイトマップを開く") {
      globalMenu.setAttribute("aria-label", "サイトマップを閉じる");
      globalMenu.setAttribute("aria-expanded", "true");
      globalMenuInner.setAttribute("aria-hidden", "false");
      async function addBgElm() {
        body.insertAdjacentHTML("afterbegin", '<div class="p-globalmenu-background js-globalmenuBackground"></div>');
      }
      async function addBgClass() {
        await addBgElm();
        const globalMenuBg = document.querySelector(".js-globalmenuBackground");
        setTimeout(function () {
          globalMenuBg.classList.add("is-active");
        }, 1);
      }
      addBgClass();
    } else {
      const globalMenuBg = document.querySelector(".js-globalmenuBackground");
      globalMenu.setAttribute("aria-expanded", "false");
      globalMenu.setAttribute("aria-label", "サイトマップを開く");
      globalMenuInner.setAttribute("aria-hidden", "true");
      globalMenuBg.classList.remove("is-active");
      globalMenuBg.addEventListener("transitionend", function () {
        globalMenuBg.remove();
      });
    }
    // tabでフォーカス切り替え可能に
    globalMenuAnchor.forEach(function (elem, index) {
      if (elem.getAttribute("tabindex") === "-1") {
        elem.removeAttribute("tabindex");
      } else {
        elem.setAttribute("tabindex", "-1");
      }
      // フォーカスをメニュー内に束縛
      elem.addEventListener("focus", function () {
        if (elem.classList.contains("js-focusReset")) {
          globalMenu.focus();
        }
      });
    });
    //アニメーション
    globalMenuInner.classList.toggle("is-show");
    globalMenuInnerList.classList.toggle("on-animation");
    bars.forEach(function (elem, index) {
      elem.classList.toggle("is-open");
    });
    // メニューオープン中はスクロール禁止 + クローズ時スクロール可能に戻す
    if (!body.classList.contains("is-fixed")) {
      body.classList.add("is-fixed");
      body.style.top = -scrollTop + "px";
      scrollTopBack = scrollTop;
    } else {
      body.classList.remove("is-fixed");
      window.scrollTo(0, scrollTopBack);
    }
  });
  // 背景をクリックした場合
  document.addEventListener("click", function (event) {
    if (event.target && event.target.classList.contains("js-globalmenuBackground")) {
      const globalMenuBg = document.querySelector(".js-globalmenuBackground");
      globalMenuInner.classList.toggle("is-show");
      bars.forEach(function (elem, index) {
        elem.classList.toggle("is-open");
      });
      globalMenuInnerList.classList.toggle("on-animation");
      globalMenu.setAttribute("aria-expanded", "false");
      globalMenu.setAttribute("aria-label", "サイトマップを開く");
      globalMenuInner.setAttribute("aria-hidden", "true");
      globalMenuBg.classList.remove("is-active");
      globalMenuBg.addEventListener("transitionend", function () {
        globalMenuBg.remove();
      });
      if (!body.classList.contains("is-fixed")) {
        body.classList.add("is-fixed");
        body.style.top = -scrollTop + "px";
        scrollTopBack = scrollTop;
      } else {
        body.classList.remove("is-fixed");
        window.scrollTo(0, scrollTopBack);
      }
    }
  });
}

//スムーススクロール
if (document.querySelector(".scrollTrigger") != null) {
  const scrollTrigger = document.querySelectorAll(".scrollTrigger");
  scrollTrigger.forEach(function (elem, index) {
    elem.addEventListener("click", function (event) {
      event.preventDefault();
      const scrollTargetAttr = elem.getAttribute("href");
      const scrollTargetElm = document.querySelector(scrollTargetAttr);
      const rect = scrollTargetElm.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollTargetTop = rect.top + scrollTop;
      window.scrollTo({
        top: scrollTargetTop,
        left: 0,
        behavior: "smooth",
      });
    });
  });
}

//
