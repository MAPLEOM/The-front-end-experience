/**
 * @description 防抖
 * 触发事件后n秒后才执行函数 若n秒内触发了事件 则会重新计算事件
 */
// => 非立即执行版本
function debounce_1(fn, wait) {
	let timer = null;
	return function () {
		const argu = arguments;
		const context = this;
		if (timer) clearTimeout(timer);
		timer = setTimeout(function () {
			fn.apply(context, argu);
		}, wait);
	};
}
// => 立即执行版本
function debounce_2(fn, wait) {
	let timer = null;
	return function () {
		const argu = argument;
		const context = this;
		if (timer) {
			clearTimeout(timer);
		} else {
			fn.apply(context, argu);
		}
		timer = setTimeout(() => {
			timer = null;
		}, wait);
	};
}
// => 合成版本
function dobounce(fn, wait, immediate) {
	let timer = null;
	return function () {
		const context = this;
		const argu = arguments;
		timer && clearTimeout(timer);
		if (immediate) {
			!timer && fn.apply(context, argu);
			timer = setTimeout(() => {
				timer = null;
			}, wait);
		} else {
			timer = setTimeout(() => {
				fn.apply(context, argu);
			}, wait);
		}
	};
}
