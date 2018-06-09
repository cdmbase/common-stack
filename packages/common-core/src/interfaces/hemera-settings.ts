
export interface IHemeraSettings {
    namespace?: string;
    connectionId?: string;
    topic: string;
    [key: string]: string | number | any;
}

