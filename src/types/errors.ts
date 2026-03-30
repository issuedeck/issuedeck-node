export class IssuedeckError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'IssuedeckError';
    }
}

export class AuthenticationError extends IssuedeckError {
    constructor(message: string) {
        super(message);
        this.name = 'AuthenticationError';
    }
}

export class InvalidRequestError extends IssuedeckError {
    errors? : Record<string, string[]>;
    constructor(message: string, errors?: Record<string, string[]>) {
        super(message);
        this.name = 'InvalidRequestError';
        this.errors = errors;
    }
}

export class RateLimitError extends IssuedeckError {
    constructor(message: string) {
        super(message);
        this.name = 'RateLimitError';
    }
}


export class ApiError extends IssuedeckError {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}