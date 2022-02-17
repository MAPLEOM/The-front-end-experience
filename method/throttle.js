/**
 * @description 节流函数
 * 连续触发事件但在n秒内只执行一次函数
 */
// => 时间戳版本
function throttle_1(fn, wait) {
	let prev = 0;
	return function () {
		let now = new Date();
		let context = this;
		let args = arguments;
		if (now - prev > wait) {
			fn.apply(context, args);
			prev = now;
		}
	};
}
// => 定时器版本
function throttle_2(fn, wait) {
	let timer = null;
	return function () {
		const context = this;
		const argu = arguments;
		if (!timer) {
			fn.apply(context, argu);
			timer = setTimeout(() => {
				timer = null;
			}, wait);
		}
	};
}

// => 合成版本
/**
 * @param {*} fn   处理函数
 * @param {*} wait 等待时间
 * @param {*} type 1表示时间戳 2表示定时器版本
 */
function throttle(fn, wait, type = 2) {
	if (type === 1) {
		var prev = 0;
	} else {
		var timer = null;
	}
	return function () {
		const context = this;
		const argu = arguments;
		if (type === 1) {
			// 时间戳
			const now = new Date();
			if (now - prev > wait) {
				fn.apply(context, argu);
				prev = now;
			}
		} else if (!timer) {
			fn.apply(context, argu);
			timer = setTimeout(() => {
				timer = null;
			}, wait);
		}
	};
}
