import {registerRouteBasePlugin, unregisterRouteBasePlugin, getRouteBasePlugin, getRouteBasePlugins } from '../plugin-api';


describe('registerPlugin', () => {
    afterEach(() => {
        getRouteBasePlugins().forEach((plugin) => {
            unregisterRouteBasePlugin(plugin.name);
        });
    });

    it('successfully registers a plugin', () => {
        const name = 'plugin';
        const icon = 'smiley';
        const Component = () => 'plugin content';

        registerRouteBasePlugin(name, {
            render: Component,
            icon,
        });

        expect(getRouteBasePlugin(name)).toEqual({
            name,
            render: Component,
            icon,
        })
    });

	it( 'fails to register a plugin without a settings object', () => {
		(<any>registerRouteBasePlugin)();
		expect( console ).toHaveErroredWith( 'No settings object provided!' );
	} );

	it( 'fails to register a plugin with special character in the name', () => {
		registerRouteBasePlugin( 'plugin/with/special/characters', {
			render: () => {},
		} );
		expect( console ).toHaveErroredWith(
			'Plugin names must include only lowercase alphanumeric characters or dashes, and start with a letter. Example: "my-plugin".'
		);
	} );

	it( 'fails to register a plugin with a non-string name', () => {
		registerRouteBasePlugin(
			{},
			{
				render: () => {},
			}
		);
		expect( console ).toHaveErroredWith( 'Plugin names must be strings.' );
	} );

	it( 'fails to register a plugin without a render function', () => {
		registerRouteBasePlugin( 'another-plugin', {} );
		expect( console ).toHaveErroredWith(
			'The "render" property must be specified and must be a valid function.'
		);
	} );

	it( 'fails to register a plugin that was already been registered', () => {
		registerRouteBasePlugin( 'plugin', {
			render: () => 'plugin content',
		} );
		registerRouteBasePlugin( 'plugin', {
			render: () => 'plugin content',
		} );
		expect( console ).toHaveErroredWith(
			'Plugin "plugin" is already registered.'
		);
	} );
})
