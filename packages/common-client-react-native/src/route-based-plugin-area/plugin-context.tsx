
import * as React from 'react';
import { createHigherOrderComponent } from './higher-order-component-util';

const  { createContext } = React;
const { Consumer, Provider } = createContext({
    name: null,
    icon: null,
});

export { Provider as PluginContextProvider };


/**
 * A Higher Order Component used to inject Plugin context to the
 * wrapped component.
 *
 * @param mapContextToProps Function called on every context change, expected to return object of
 * props to merge with the component's own props.
 *
 * @return Enhanced component with injected context as props.
 */
export const withPluginContext = (mapContextToProps) =>
    createHigherOrderComponent((OriginalComponent) => {
        return (props) => (
            <Consumer>
                {(context) => (
                    <OriginalComponent
                        {...props}
                        {...mapContextToProps(context, props)}
                    />
                )}
            </Consumer>
        );
    }, 'withPluginContext');
