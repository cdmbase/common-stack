import * as envalid from 'envalid';
const { str, email, json, num } = envalid;

export interface IConfig {
    NODE_ENV: string;
    REDIS_URL: string;
    REDIS_CACHE_MAX_AGE_in_sec: number;
}

export const config = envalid.cleanEnv<IConfig>(process.env, {
    REDIS_URL: str(),
    REDIS_CACHE_MAX_AGE_in_sec: num({default: 172800, desc: 'Max. age in seconds. Default is 2 days'}),
    NODE_ENV: str({choices: ['production', 'test', 'staging', 'development'], default: 'production'}),
});

