module.exports = function (api) {
	if (api) api.cache(true);
	
	const presets = [
		'@babel/preset-env',
		'@babel/preset-typescript',
	];
	
	const plugins = [
		//'@babel/plugin-proposal-class-properties',
		'@babel/plugin-transform-runtime',
	];
	
	return {
		presets,
		plugins,
	};
};
