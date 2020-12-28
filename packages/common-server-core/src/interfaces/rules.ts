

export type IResolverFunc<T> = (source: Record<string, any>, args: Record<string, any>, ctx: Record<string, any>) => Promise<T>;

export interface IRule {
    [key: string]: IResolverFunc<Record<string, any>>;
}

export type IGraphqlShieldRules = Record<GraphqlRootType & { [key: string]: string }, IRule>;

export enum GraphqlRootType {
    Query= 'Query',
    Mutation = 'Mutation',
    Subscription = 'Subscription',
}
