import * as mongoose from 'mongoose';

let connectionOptions: mongoose.ConnectionOptions | undefined;
// (mongoose as any).Promise = global.Promise;

const generateMongo: (monoUrl) => mongoose.Connection = (mongoUrl) => {

    // creates default connection
    mongoose.connect(mongoUrl, {
    }).then(() => {
        console.info('mogoose connect - success');
        // console.info(`uri - ${uri}`);
        // console.info(`connectionOptions - ${connectionOptions}`);
    }).catch((err: mongoose.Error) => {
        console.error('mogoose connect - error - ', err);
        // throw err;
        process.kill(process.pid);
    });
    // to access default connection
    const mongooseConnection: mongoose.Connection = mongoose.connection;

    return mongooseConnection;
};



export { generateMongo };
