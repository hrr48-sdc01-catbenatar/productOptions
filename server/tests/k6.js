import http from 'k6/http';

export let options = {
  scenarios: {
      constant_request_rate: {
          executor: 'constant-arrival-rate',
          rate: 100,
          timeUnit: '1s', //100 rps
          duration: '60s',
          preAllocatedVUs: 100,
          maxVUs: 200,
      }
  }
};

export default function () {
  http.get('http://localhost:3002/stock/1');

  let data = { productid: 1000000, id: 217000000, color: 'test', colorurl: 'test', location: 'test', name: 'test', qty: 0, size: 'test', storeid: 7 };
  var params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  http.post('http://localhost:3002/stock', JSON.stringify(data), params);
}