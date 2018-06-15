///<reference types="webpack-env" />
process.env.ENV_FILE !== null && (require('dotenv')).config({ path: process.env.ENV_FILE });
import 'reflect-metadata';
<<<<<<< HEAD:experimental/servers/backend-server/src/index.ts

import { logger } from '@common-stack/utils';
=======
import { logger } from '@common-stack/utils';
>>>>>>> f4ab7cd01d19552faea5da1c006ed4e0322af3bd:servers/backend-server/src/index.ts
import './api-server';

process.on('uncaughtException', (ex) => {
    logger.error(ex);
    process.exit(1);
});

process.on('unhandledRejection', reason => {
    logger.error(reason);
});

if (module.hot) {
    module.hot.status(event => {
        if (event === 'abort' || event === 'fail') {
            logger.error('HMR error status: ' + event);
            // Signal webpack.run.js to do full-reload of the back-end
            process.exit(250);
        }
        // adddintionally when event is idle due to external modules
        if (event === 'idle') {
            process.exit(250);
        }
    });

    module.hot.accept();
}

