import 'source-map-support/register';
console['STACK_REMAP'] = (path: string) => {
	let r = path.split('webpack:///')[1] || path;
	r = r.replace('webpack-internal:///./', '');
	return r;
};

