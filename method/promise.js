/**
 * @description 手写promise
 * 缺少链式结构以及穿透值
 */
class Promise {
	constructor(executor) {
		this.status = 'pending';
		this.value = undefined;
		this.reson = undefined;
		this.successStore = []; //定义一个存放成功函数的数组 => 用于处理 setTimeout
		this.failStore = []; //定义一个存放失败函数的数组 => 用于处理 setTimeout
		let resolve = (value) => {
			if (this.status === 'pending') {
				this.value = value;
				this.status = 'resolved';
				this.successStore.forEach((func) => func());
			}
		};
		let reject = (reson) => {
			if (this.status === 'pending') {
				this.reson = reson;
				this.status = 'rejected';
				this.failStore.forEach((func) => func());
			}
		};
		try {
			executor(resolve, reject); // 立即执行(新建Promise的对象 立即执行 then中的为微任务)
		} catch (e) {
			reject(e); //如果发生错误，将错误放入reject中
		}
	}
	then(onFulfilled, onRejected) {
		if (this.status === 'pending') {
			this.successStore.push(() => {
				//当状态为pending时将成功的函数存放到数组里
				onFulfilled(this.value);
			});
			this.failStore.push(() => {
				//当状态为pending时将失败的函数存放到数组中
				onRejected(this.reason);
			});
		} else if (this.status === 'resolved') {
			//如果状态是resolved
			onFulfilled(this.value); //执行成功的resolve，并将成功后的值传递过去
		} else if (this.status === 'rejected') {
			//如果状态是rejected
			onRejected(this.reason); //执行失败的reject,并将失败原因传递过去
		}
	}
}

module.exports = Promise; //将Promise导出
