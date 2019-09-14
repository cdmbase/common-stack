///<reference types="webpack-env" />
process.env.ENV_FILE !== null && (require('dotenv')).config({ path: process.env.ENV_FILE });

<<<<<<< HEAD
import { logger } from '@common-stack/utils';
=======
import { logger } from '@cdm-logger/server';
>>>>>>> 307307aabc45101c0db3dc6477f55979f2eca6a8
import './server';

process.on('uncaughtException', ex => {
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
    });

    module.hot.accept();
}
