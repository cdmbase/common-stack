export class FieldError {
    private errors: {};

    constructor() {
        this.errors = {};
    }

    public hasAny() {
        return !!Object.keys(this.errors).length;
    }

    public setError(field, message) {
        this.errors[field] = message;
    }

    public getErrors() {
        return Object.keys(this.errors).map(field => ({
            field,
            message: this.errors[field],
        }));
    }

    public throwIf() {
        if (this.hasAny()) {
            throw this.getErrors();
        }
    }
}
