const webpack = require('webpack');

module.exports = function override(config) {
    const fallback = config.resolve.fallback || {};
    Object.assign(fallback, {
        "process": require.resolve("process/browser"),
        "zlib": require.resolve("browserify-zlib"),
        "querystring": require.resolve("querystring-es3"),
        "path": require.resolve("path-browserify"),
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "http": false,
        "https": false,
        "os": require.resolve("os-browserify/browser"),
        "url": false,
        "util": false,
        "buffer": require.resolve("buffer/"),
        "fs": false,
        "net": false
    });
    config.resolve.fallback = fallback;
    config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
            process: 'process/browser',
            Buffer: ['buffer', 'Buffer']
        })
    ]);
    config.resolve.alias = {
        ...config.resolve.alias,
        'process/browser': 'process/browser.js'
    };

    config.resolve.extensions = [...config.resolve.extensions, ".ts", ".js"]
    return config;
};