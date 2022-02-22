/**
 * @param {*} callback 回调函数
 * @param {*} initValue 初始值(非必须)
 */
Array.prototype.myReduce = function (callback, initValue) {
	const isArray = Object.prototype.toString.call();
	if (!isArray) {
		throw new Error('it is not Array !');
	}
	if (this.length === 0 && arguments.length < 2) {
		throw new TypeError('Reduce of empty array with no initial value');
	}
	let arr = this;
	let res = null;
	if (arguments.length > 1) {
		res = initValue;
	} else {
		res = arr.splice(0, 1)[0]; //没有就取第一个值
	}
	arr.forEach((item, index) => {
		res = callback(res, item, index, arr); // cb 每次执行完都会返回一个新的 res值，覆盖之前的 res
	});
	return res;
};
