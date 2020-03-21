import { Feature } from '../connector';
import 'jest';



describe('Websocket Configuration', function () {
    it('Websocket not set', async () => {
        const feature1 = new Feature({
        });

        const feature2 = new Feature({
        });

        const feature = new Feature(feature1, feature2);

        const result =  feature.getWebsocketConfig();
        console.log('--Result', result);
 
    });

    it('Websocket set one per feature', async () => {
        const feature1 = new Feature({
            createWebsocketConfig: {
                '/test1': (ws) => ([context, services]) => {
                    console.log('test1');
                }
            }
        });

        const feature2 = new Feature({
            createWebsocketConfig: {
                '/test2': (ws) => ([context, services]) => {
                    console.log('test2');
                }
            }
        });

        const feature = new Feature(feature1, feature2);

        const result =  feature.getWebsocketConfig();
        console.log('--Result', result);
 
    });

    it('Websocket set two per feature', async () => {
        const feature1 = new Feature({
            createWebsocketConfig: {
                '/test11': (ws) => ([context, services]) => {
                    console.log('test1');
                },
                '/test12': (ws) => ([context, services]) => {
                    console.log('test1');
                },
            }
        });

        const feature2 = new Feature({
            createWebsocketConfig: {
                '/test21': (ws) => ([context, services]) => {
                    console.log('test2');
                },
                '/test22': (ws) => ([context, services]) => {
                    console.log('test2');
                }
            }
        });

        const feature = new Feature(feature1, feature2);

        const result =  feature.getWebsocketConfig();
        console.log('--Result', result);
 
    });
    it('Websocket set two per feature as array', async () => {
        const feature1 = new Feature({
            createWebsocketConfig: [{
                '/test11': (ws) => ([context, services]) => {
                    console.log('test1');
                },
                '/test12': (ws) => ([context, services]) => {
                    console.log('test1');
                },
            }]

        });

        const feature2 = new Feature({
            createWebsocketConfig: {
                '/test21': (ws) => ([context, services]) => {
                    console.log('test2');
                },
                '/test22': (ws) => ([context, services]) => {
                    console.log('test2');
                }
            }
        });

        const feature = new Feature(feature1, feature2);

        const result =  feature.getWebsocketConfig();
        console.log('--Result', result);
 
    });
});
