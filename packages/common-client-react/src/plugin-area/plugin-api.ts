import { ComponentElement } from 'react';

import { isFunction } from 'lodash';
import { applyFilters, doAction } from '@wordpress/hooks';

/**
 * Defined behavior of a plugin type.
 *
 * @typedef ComponentExtension
 *
 *
 */
export interface WorbenchExtension {
    name: string;
    icon: string | ComponentElement<any, any> | Function;
    render: React.SFC | any;
}

/**
 * Plugin definitions keyed by plugin name.
 */
const plugins: { [key: string]: WorbenchExtension } = {};

/**
 * Registeres a plugin to the App.
 *
 * @param name A string identifying the plugin. Must be unique across all registered plugins.
 * @param settings The settings for this plugin.
 */
export function registerPlugin(name, settings) {
    if (typeof settings !== 'object') {
        console.error('No settings object provided!');
        return null;
    }
    if (typeof name !== 'string') {
        console.error('Plugin names must be strings.');
        return null;
    }
    if (!/^[a-z][a-z0-9-]*$/.test(name)) {
        console.error(
            'Plugin names must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-pluin".',
        );
        return null;
    }
    if (plugins[name]) {
        console.error(`Plugin "${name}" is alread registered.`);
    }
    settings = applyFilters('plugins.registerPlugin', settings, name);

    if (!isFunction(settings.render)) {
        console.error(
            'The "render" property must be specified and must be a valid function.',
        );
        return null;
    }
    plugins[name] = {
        name,
        icon: 'admin-plugins',
        ...settings,
    };

    doAction('plugins.pluginRegistered', settings, name);

    return settings;
}

/**
 * Unregisteres a plugin by name.
 * @param name Plugin name.
 *
 * @return The previous plugin settings object, if it has been successfully unregistered; otherwise `undefined`.
 */
export function unregisterPlugin(name) {
    if (!plugins[name]) {
        console.error('Plugin "' + name + '" is not registered.');
        return;
    }
    const oldPlugin = plugins[name];
    delete plugins[name];

    doAction('plugin.pluginUnregistered', oldPlugin, name);

    return oldPlugin;
}

/**
 * Returns a registered plugin settings.
 *
 * @param name Plugin name.
 *
 * @returns Plugin setting.
 */
export function getPlugin(name) {
    return plugins[name];
}

/**
 * Return all registered plugins.
 *
 * @return Plugin settings.
 */
export function getPlugins() {
    return Object.values(plugins);
}
