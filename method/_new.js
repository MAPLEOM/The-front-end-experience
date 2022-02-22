/**
 * @description 封装new关键字
 */
function _new() {
	const target = {};
	const [constructor, ...args] = [...arguments];
	target.__proto__ = constructor.prototype;
	let result = constructor.apply(target, args);
	if (result && (typeof result == 'object' || typeof result == 'function')) {
		return result;
	}
	return target;
}
