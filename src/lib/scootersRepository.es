import Scooter from './scooterModel'

export default class Scooters {
  async all() {
    return await Scooter.find().limit(3).exec()
  }

  async findById(_id) {
    return await Scooter.findOne(_id).exec()
  }

  async licensePlates() {
    const result = await Scooter.aggregate([
      {$group: {_id: '$license_plate'}},
      {$sort: {_id: 1}},
    ]).exec()

    return result.map(doc => doc._id)
  }

  async lastRequestTime() {
    const sortedRequestTimes = await Scooter.aggregate([
      {$group: {_id: '$_request_time'}},
      {$sort: {_id: 1}}
    ]).exec()

    if (sortedRequestTimes.length < 0) {
      return {error: 'No requests found', count: 0, positions: []};
    }

    return sortedRequestTimes[sortedRequestTimes.length - 1]._id
  }

  async positionsAt(requestTime) {
    const positions = await Scooter.aggregate([
      {$match: {_request_time: requestTime}}
    ]).exec()

    return positions
  }

  async count() {
    const result = await Scooter.aggregate([
      {$group: {_id: '$license_plate'}},
      {$group: {_id: 1, count: {$sum: 1}}}
    ]).exec()

    return result[0].count
  }

  async positionsByLicensePlate(license_plate) {
    return await Scooter.aggregate([
      {$match: {license_plate: license_plate}},
      {$sort: {_request_time: 1}},
      {$project: {_request_time: 1, energy_level: 1}},
    ]).exec()
  }

  async batterySwapsByLicensePlate(license_plate) {
    const result = await Scooter.aggregate([
      {$match: {license_plate: license_plate}},
      {$sort: {_request_time: 1}},
      {$project: {_request_time: 1, energy_level: 1}},
    ]).exec()

    return result.filter((doc, i) => {
      if (i == 0) {
        return false
      }

      const prevDoc = result[i-1]
      const diff = doc.energy_level - prevDoc.energy_level

      return doc.energy_level > 90 && diff > 0
    })
  }

  async findById(_id) {
    return await Scooter.aggregate([
      { $project: { license_plate: 1 } },
      { $limit: 3 }
    ]).exec()
  }

  async countPositions() {
    return await Scooter.countDocuments().exec()
  }

  async energyLevelDistribution() {
    return await Scooter.aggregate([
      {$group: {_id: '$energy_level', count: {$sum: 1}}},
      {$project: {_id: 0, energy_level: '$_id', count: '$count'}},
      {$sort: {energy_level: 1}}
    ]).exec()
  }

  async energyLevelDistributionPerHour() {
    return await Scooter.aggregate([
      {$group: {_id: {hour: {$hour: '$_request_time'}, energy_level: '$energy_level'}, count: {$sum: 1}, sum: {$sum: '$energy_level'}}},
      {$project: {_id: 0, hour: '$_id.hour', energy_level: '$_id.energy_level', count: 1}},
      {$group: {_id: '$hour', distribution: {$push: {energy_level: '$energy_level', count: '$count'}}}},
      {$project: {_id: 0, hour: '$_id', distribution: '$distribution'}},
      {$sort: {hour: 1, 'distribution.energy_level': 1}}
    ]).exec()
  }

  async locationsByLicensePlate() {
    return await Scooter.aggregate([
      {$group: {_id: "$license_plate", locations: { $addToSet: { location: {latitude: '$latitude', longitude: '$longitude'} }}}},
      {$project: {_id: 0, license_plate: '$_id', locations: {$size: "$locations"}}},
      {$sort: {size: -1}},
    ]).exec()
  }

  async nextAvailableScootersByLocation(requestTime, lat, lng, dist) {
    const latitude = parseFloat(lat)
    const longitude = parseFloat(lng)
    const distance = parseFloat(dist)

    return await Scooter.aggregate([
      {$geoNear: {
        near: { type: "Point", coordinates: [ longitude, latitude ] },
        distanceField: "distance",
        maxDistance: distance,
        spherical: true,
        num: 1000
      }},
      {$match: {_request_time: requestTime}}
    ]).exec()
  }
}
