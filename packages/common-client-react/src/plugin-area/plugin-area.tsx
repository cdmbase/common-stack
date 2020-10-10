import { map } from 'lodash';
import * as React from 'react';
import { addAction, removeAction } from '@wordpress/hooks';
import { PluginContextProvider } from './plugin-context';
import { getPlugins } from './plugin-api';

/**
 * A component that renders all plugin fills in a hidden div.
 */

export class PluginArea extends React.Component<{}, { plugins: { [key: string]: any}}> {

    constructor(args) {
        super(args);
        this.setPlugins = this.setPlugins.bind(this);
        this.state = {plugins: []};
    }

    public getCurrentPluginsState() {
        return {
            plugins: map(getPlugins(), ({ icon, name, render }) => {
                return {
                    Plugin: render,
                    context: {
                        name,
                        icon,
                    },
                };
            }),
        };
    }

    public componentDidMount() {
        addAction(
            'plugins.pluginRegistered',
            'core/plugins/plugin-area/plugins-registered',
            this.setPlugins,
        );
        addAction(
            'plugins.pluginUnregistered',
            'core/plugins/plugin-area/plugins-unregistered',
            this.setPlugins,
        );
        this.setPlugins();
    }

    public componentWillUnMount() {
        removeAction(
            'plugins.pluginRegistered',
            'core/plugins/plugin-area/plugins-registered',
        );
        removeAction(
            'plugins.pluginUnregistered',
            'core/plugins/plugin-area/plugins-unregistered',
        );
    }

    public setPlugins() {
        this.setState(this.getCurrentPluginsState);
    }

    public render() {
        return (
            <div style={{ display: 'none' }}>
                {map(this.state.plugins, ({ context, Plugin }) => (
                    <PluginContextProvider
                        key={context.name}
                        value={context}
                    >
                        <Plugin />
                    </PluginContextProvider>
                ))}
            </div>
        );
    }
}
