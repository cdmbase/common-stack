import { LoadingComponentProps } from 'react-loadable';
import { IRouteData as IOrigROuteData } from '@common-stack/client-core';
export {  IMappedData } from '@common-stack/client-core';
export interface IRouteData extends IOrigROuteData<React.ComponentType<LoadingComponentProps> | (() => null)> {
}
