// 防抖函数()
let timer = null;
function debounce(fn, delay) {
	clearTimeout(timer);
	timer = setTimeout(() => {
		fn();
	}, delay);
}
