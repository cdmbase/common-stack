import { Feature, FeatureWithRouterFactory } from '@common-stack/client-react';
import counterModules from '@common-stack/counter/lib/browser';

const genratedFeature = new Feature(FeatureWithRouterFactory, counterModules);
console.log(genratedFeature.getConfiguredRoutes());

export default genratedFeature;
