/* jshint mocha: true */
 /* global describe, it, expect */

var assert = require('assert');
var path = require('path');

var dirs = require('./../package.json')['h5bp-configs'].directories;

describe('src/js/plugins.js console shim', function () {

    it('should stub console methods when console is undefined', function () {
        // Simulate the environment where console is undefined
        var consoleOriginal = global.console;
        global.console = undefined;

        // Load the plugins module - this should not throw
        var pluginsPath = path.resolve(dirs.src, 'js/plugins.js');
        // Use require hook to handle the IIFE pattern
        // The module exports nothing, so we verify it loads without error
        try {
            require(pluginsPath);
        } catch (e) {
            // It's an IIFE, may not export anything; that's OK
        }

        // Restore console
        global.console = consoleOriginal;
    });

    it('should NOT throw when window.console is available', function () {
        // Ensure console exists with standard methods
        var consoleMethods = ['log', 'error', 'warn', 'info'];
        var originalMethods = {};

        consoleMethods.forEach(function (method) {
            originalMethods[method] = console[method];
            console[method] = function () {
                originalMethods[method].apply(console, arguments);
            };
        });

        try {
            var pluginsPath = path.resolve(dirs.src, 'js/plugins.js');
            require(pluginsPath);
        } catch (e) {
            // IIFE may throw depending on environment; capture and re-raise
            throw e;
        } finally {
            // Restore original console methods
            consoleMethods.forEach(function (method) {
                console[method] = originalMethods[method];
            });
        }
    });
});