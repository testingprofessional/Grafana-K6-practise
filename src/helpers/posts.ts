import http, { type Response } from 'k6/http';

export function getPost(postId: number): Response {
    const response = http.get(`https://jsonplaceholder.typicode.com/posts/${postId}`);
    return response;
}

interface User {
    id: number;
    name: string;
    email: string;
}

export function isUser(data: unknown): data is User {
    if (typeof data !== 'object' || data === null) {
        return false;
    }

    return (
        'id' in data &&
        'name' in data &&
        'email' in data &&
        typeof data.id === 'number' &&
        typeof data.name === 'string' &&
        typeof data.email === 'string'
    );
}

export function getData<T>(response: Response): T {
    if (typeof response.body === 'string') {
        const data: unknown = JSON.parse(response.body);
        return data as T;
    } else {
        throw new Error('Response body is geen string');
    }
}