import {
    ApiError,
    AuthenticationError,
    InvalidRequestError,
    type IssuedeckError,
    RateLimitError
} from "./types/errors.ts";

class Issuedeck {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string, options?:{baseUrl?: string}) {
        this.apiKey = apiKey;
        this.baseUrl = options?.baseUrl ?? "https://api.issuedeck.xyz/v1"
    }

    private async request<T>(method: string, path: string, body?: unknown): Promise<T> {
        const url = `${this.baseUrl}${path}`;

        const headers : Record<string, string> = {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
        }

        const response = await fetch(url, {
            method,
            headers,
            body: body ? JSON.stringify(body) : undefined,
        })

        const data = await response.json();

        if (!response.ok){
            throw this.handleError(response.status, data)
        }

        return data as T;
    }


    private handleError<T>(status: number, data: any): IssuedeckError {
        switch (status) {
            case 401:
                return new AuthenticationError(data.message);
            case 400:
            case 422:
                return new InvalidRequestError(data.message, data.errors);
            case 429:
                return new RateLimitError(data.message);
            default:
                return new ApiError(data.message, status);
        }
    }

    get<T>(path: string) : Promise<T> {
        return this.request('GET', path);
    }

    post<T>(path:string, body:unknown): Promise<T> {
        return this.request('POST', path, body);
    }

    patch<T>(path:string, body:unknown): Promise<T> {
        return this.request('PATCH', path, body);
    }
    delete<T>(path: string) : Promise<T> {
        return this.request('DELETE', path);
    }
}