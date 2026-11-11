import http from 'k6/http';

export default function () {
    const response = http.get('https://jsonplaceholder.typicode.com/posts/1');

    console.log(response.status);
}