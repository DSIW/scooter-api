# scooter-api

API for scooters

## Requirements

* Node.js
* MongoDB

## Setup

1. Install Node.js 9.3 including NPM (I use [nodenv](https://github.com/nodenv/nodenv))
2. Install dependencies: `npm install`
3. Populate database

### Populate database

Insert documents into your database.

```
{
  "_id" : ObjectId("abc123..."),
  "license_plate" : "111XXX",
  "energy_level" : 100, // percent
  "longitude" : 52.521288,
  "latitude" : 13.410463,
  "_request_time" : ISODate("2018-08-12T17:42:24.327Z")
}
```

## Start/stop server cluster

1. Start mongodb on your system (Linux with systemd: `systemctl start mongodb`)

Connection to MongoDB will be configured by environment variables:

```
MONGODB_USER       (optional)
MONGODB_PASSWORD   (optional)
MONGODB_IP         (default: 127.0.0.1)
MONGODB_PORT       (default: 27017)
MONGODB_DATABASE   (default: scooter-api)
MONGODB_COLLECTION (default: 'positions')
PORT               (default: 3000)
```

2. Start server: `MONGODB_DATABASE=scooter-api MONGODB_COLLECTION=positions PORT=3000 npm run start-watching`

Now you can start requesting the server on port 3000. I like to use [httpie](https://httpie.org).

## API endpoints

```
GET /scooters
GET /scooters/count

GET /scooters/findById/:_id

GET /scooters/positions/current
GET /scooters/positions/current/near_by/:lat/:lng/:distance
GET /scooters/positions/count
GET /scooters/positions/count/history/days/:days
GET /scooters/positions/count/per_time_unit/:unit

GET /scooters/battery_swaps

GET /scooters/license_plates/count
GET /scooters/license_plates/:license_plate/positions
GET /scooters/license_plates/:license_plate/positions/count
GET /scooters/license_plates/:license_plate/positions/battery_swaps
GET /scooters/license_plates/:license_plate/positions/energy_level/distribution
GET /scooters/license_plates

GET /scooters/most_used

GET /scooters/energy_level/stats
GET /scooters/energy_level/distribution
GET /scooters/energy_level/per_hour
```

## License

MIT License

Copyright (c) 2018 DSIW

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
