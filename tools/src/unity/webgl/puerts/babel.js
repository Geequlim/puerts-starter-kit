module.exports = {
	transform: function(source, options) {
		return new Promise((resolve, reject) => {
			const babel = eval("require('@babel/core')");
			babel.transform(source, options, (err, ret) => {
				if (err) {
					reject(err);
				} else {
					resolve(ret);
				}
			});
		});
	}
}
