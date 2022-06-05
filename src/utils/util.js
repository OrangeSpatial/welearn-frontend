/* eslint-disable no-unused-vars */
export function timeFix() {
  const time = new Date();
  const hour = time.getHours();
  return hour < 9
    ? "早上好"
    : hour <= 11
    ? "上午好"
    : hour <= 13
    ? "中午好"
    : hour < 20
    ? "下午好"
    : "晚上好";
}

export function welcome() {
  const arr = [
    "休息一会儿吧",
    "准备吃什么呢?",
    "要不要打一把 DOTA",
    "我猜你可能累了"
  ];
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
}

export function formatTime(date) {
  var Ndate = new Date(date);
  var YY = Ndate.getFullYear() + "-";
  var MM =
    (Ndate.getMonth() + 1 < 10
      ? "0" + (Ndate.getMonth() + 1)
      : Ndate.getMonth() + 1) + "-";
  var DD = Ndate.getDate() < 10 ? "0" + Ndate.getDate() : Ndate.getDate();
  var hh =
    (Ndate.getHours() < 10 ? "0" + Ndate.getHours() : Ndate.getHours()) + ":";
  var mm =
    (Ndate.getMinutes() < 10 ? "0" + Ndate.getMinutes() : Ndate.getMinutes()) +
    ":";
  var ss =
    Ndate.getSeconds() < 10 ? "0" + Ndate.getSeconds() : Ndate.getSeconds();
  return YY + MM + DD + " " + hh + mm + ss;
}

export function formatDate(date) {
  var Ndate = new Date(date);
  var YY = Ndate.getFullYear() + "-";
  var MM =
    (Ndate.getMonth() + 1 < 10
      ? "0" + (Ndate.getMonth() + 1)
      : Ndate.getMonth() + 1) + "-";
  var DD = Ndate.getDate() < 10 ? "0" + Ndate.getDate() : Ndate.getDate();
  return YY + MM + DD;
}

export function formatDateToMonth(date) {
  var Ndate = new Date(date);
  var YY = Ndate.getFullYear() + "-";
  var MM =
    Ndate.getMonth() + 1 < 10
      ? "0" + (Ndate.getMonth() + 1)
      : Ndate.getMonth() + 1;
  var DD = Ndate.getDate() < 10 ? "0" + Ndate.getDate() : Ndate.getDate();
  return YY + MM;
}

export function getDateToMonth(date) {
  var Ndate = new Date(date);
  return Ndate.getMonth() + 1;
}

export function formatDateToYear(date) {
  var Ndate = new Date(date);
  return Ndate.getFullYear();
}

/**
 * 触发 window.resize
 */
export function triggerWindowResizeEvent() {
  const event = document.createEvent("HTMLEvents");
  event.initEvent("resize", true, true);
  event.eventType = "message";
  window.dispatchEvent(event);
}

export function handleScrollHeader(callback) {
  let timer = 0;

  let beforeScrollTop = window.pageYOffset;
  callback = callback || function() {};
  window.addEventListener(
    "scroll",
    event => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        let direction = "up";
        const afterScrollTop = window.pageYOffset;
        const delta = afterScrollTop - beforeScrollTop;
        if (delta === 0) {
          return false;
        }
        direction = delta > 0 ? "down" : "up";
        callback(direction);
        beforeScrollTop = afterScrollTop;
      }, 50);
    },
    false
  );
}

export function isIE() {
  const bw = window.navigator.userAgent;
  const compare = s => bw.indexOf(s) >= 0;
  const ie11 = (() => "ActiveXObject" in window)();
  return compare("MSIE") || ie11;
}

/**
 * Remove loading animate
 * @param id parent element id or class
 * @param timeout
 */
export function removeLoadingAnimate(id = "", timeout = 1500) {
  if (id === "") {
    return;
  }
  setTimeout(() => {
    document.body.removeChild(document.getElementById(id));
  }, timeout);
}
