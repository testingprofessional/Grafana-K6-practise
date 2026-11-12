import { check } from 'k6';
import http from 'k6/http';
import { Counter, Rate, Trend } from 'k6/metrics';

const successfulOrders = new Counter('successful_orders');
const orderSuccessRate = new Rate('order_success_rate');
const orderProcessingTime = new Trend('order_processing_time');

export const options = {
    thresholds: {
        http_req_duration: ['p(95)<500'],
        checks: ['rate>0.95'],
        http_req_failed: ['rate<0.01']
    }
};

export default function () {
    const response = http.get('https://jsonplaceholder.typicode.com/users/1');
    
    check(response, {
        'status is 200': (res) => res.status === 200,
        'response time below 500ms': (res) => res.timings.duration < 500,
        'response body contains name': (res) => typeof res.body === 'string' && res.body.includes('Leanne Graham'),
        'response body contains email': (res) => typeof res.body === 'string' && res.body.includes('Sincere@april.biz')
    });
}