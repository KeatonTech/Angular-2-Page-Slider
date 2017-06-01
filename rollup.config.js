
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
    entry: 'dist/ng2-page-slider.js',
    sourceMap: false,
    moduleId: 'ng2-page-slider',
    moduleName: 'ng.pageSlider',
    external: [
        '@angular/core',
        '@angular/platform-browser'
    ],
    globals: {
        '@angular/core': 'ng.core',
        '@angular/platform-browser': 'ng.platformBrowser'
    },
    plugins: function () {
        return [
            nodeResolve({jsnext: true, module: true})
        ];
    },
    targets: [
        { dest: 'bundles/ng2-page-slider.cjs.js', format: 'cjs' },
        { dest: 'bundles/ng2-page-slider.umd.js', format: 'umd' },
        { dest: 'bundles/ng2-page-slider.es.js', format: 'es' },
    ]
};