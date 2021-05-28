import image from '@rollup/plugin-image';
import graphql from '@rollup/plugin-graphql';
import typescript from '@rollup/plugin-typescript';
import { string } from 'rollup-plugin-string';

const bundle = (config) => ({
    ...config,
    input: 'src/index.tsx',
    // marking all node modules as external
    external: (id) => !/^[./]/.test(id),
});
const globals = { react: 'React' };

let override = { compilerOptions: { declaration: false } };

export default [
    bundle({
        plugins: [
            image(),
            graphql({
                include: "**/*.gql"
            }),
            string({
                include: "**/*.graphql"
            }),
            typescript({ exclude: [ '*test', '*__integration__', '*.graphql']}),
        ],
        output: [
            {
                dir: 'lib',
                format: 'es',
                name: 'Billing',
                compact: true,
                exports: 'named',
                sourcemap: true,
                preserveModules: true,
                chunkFileNames: '[name]-[hash].[format].js',
                globals,
            },
        ],
    }),
];

