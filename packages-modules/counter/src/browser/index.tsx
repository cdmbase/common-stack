import counter from './module';
import { Feature } from '@common-stack/client-react';

const counterFeature =  new Feature(counter);
console.log(counterFeature.getConfiguredRoutes());
export default new Feature(counter);
