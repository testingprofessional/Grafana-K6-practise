import { check } from 'k6';
import http from 'k6/http';
import { Counter, Rate, Trend } from 'k6/metrics';

const successfulOrders = new Counter('successful_orders');
const orderSuccessRate = new Rate('order_success_rate');
const orderProcessingTime = new Trend('order_processing_time');

// export const options = {
//     thresholds: {
//         http_req_duration: ['p(95)<500'],
//         successful_orders: ['count>90'],
//         order_success_rate: ['rate>0.95'],
//         order_processing_time: ['p(95)<400']
//     }
// };

// export const options = {
//     scenarios: {
//         login_test: {
//             executor: 'ramping-vus',
//             startVUs: 0,
//             stages: [
//                 { duration: '2m', target: 25 },
//                 { duration: '8m', target: 25 },
//                 { duration: '3m', target: 75 },
//                 { duration: '5m', target: 75 },
//                 { duration: '2m', target: 0 }
//             ]
//         }
//     }
// };

// export const options = {
//     scenarios: {
//         login_constant: {
//             executor: 'constant-vus',
//             vus: 80,
//             duration: '15m'
//         }
//     }
// };

export const options = {
    scenarios: {
        login_test: {
            executor: 'constant-vus',
            vus: 20,
            duration: '15m'
        },
        order_test: {
            executor: 'constant-vus',
            vus: 10,
            duration: '15m'
        },
        product_test: {
            executor: 'ramping-vus',
            startVUs: 0,
            stages: [
                { duration: '3m', target: 100 },
                { duration: '7m', target: 100 },
                { duration: '2m', target: 0 }
            ]
        }
    }
};

export default function () {
    const url = 'https://test-api.example.com/orders';

    const payload = JSON.stringify({
        productId: 123,
        quantity: 2
    });

    const params = {
        headers: {
            'Content-Type': 'application/json'
        }
    };

    const response = http.post(url, payload, params);

    // 1. Verwerkingstijd registreren
    const processingTime = response.timings.duration;
    orderProcessingTime.add(processingTime);

    // 2. Bepalen of de bestelling succesvol is
    const isSuccessful = response.status === 201;

    // 3. Alleen succesvolle bestellingen optellen
    if (isSuccessful) {
        successfulOrders.add(1);
    }

    // 4. Resultaat registreren voor de Rate
    orderSuccessRate.add(isSuccessful);


    const loginResponse = http.post(
    'https://test.example.com/login',
    JSON.stringify({
        username: 'testuser',
        password: 'password123'
    })
);

    if (loginResponse.status !== 200) {
        return;
    }
}