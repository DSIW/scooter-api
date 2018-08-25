import Scooter, { RawScooter } from './scooterModel'

const MIN_ENERGY_LOSS = -2 // %
const MIN_DISTANCE = 300 // meters

const freshBattery = (doc, prevDoc) => {
  const diff = doc.energy_level - prevDoc.energy_level
  return doc.energy_level > 90 && diff > 0
}

const calcDistance = (pos1, pos2) => {
  const lat1 = pos1.latitude
  const lon1 = pos1.longitude
  const lat2 = pos2.latitude
  const lon2 = pos2.longitude

  const toRadians = (degrees) => degrees * (Math.PI/180)

  const phi1 = toRadians(lat1)
  const phi2 = toRadians(lat2)
  const delta = toRadians(lon2-lon1)
  const R = 6371e3 // gives d in metres

  const sin = Math.sin(phi1) * Math.sin(phi2)
  const cos = Math.cos(phi1) * Math.cos(phi2)
  const distance = Math.acos( sin + cos * Math.cos(delta) ) * R

  return distance
}

export default class Scooters {
  async all() {
    return await Scooter.find().limit(3).exec()
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
      {$sort: {_request_time: 1}}
    ]).exec()
  }

  async batterySwapsByLicensePlate(license_plate) {
    const result = await Scooter.aggregate([
      {$match: {license_plate: license_plate}},
      {$sort: {_request_time: 1}}
    ]).exec()

    return result.filter((doc, i) => {
      if (i == 0) {
        return false
      }

      return freshBattery(doc, result[i-1])
    })
  }

  async energyLevelDistributionPerLicensePlate(license_plate) {
    return await Scooter.aggregate([
      {$match: {license_plate: license_plate}},
      {$group: {_id: '$energy_level', count: {$sum: 1}}},
      {$project: {_id: 0, energy_level: '$_id', count: '$count'}},
      {$sort: {energy_level: 1}}
    ]).exec()
  }

  async drivesByLicensePlate(license_plate) {
    const result = await Scooter.aggregate([
      {$match: {license_plate: license_plate}},
      {$sort: {_request_time: 1}}
    ]).exec()

    const pairs = []

    result.forEach((doc, index) => {
      if (index >= result.length - 1) {
        return
      }

      const nextDoc = result[index+1]

      const energyLoss = nextDoc.energy_level - doc.energy_level
      const distance = calcDistance(nextDoc, doc)

      pairs.push({ from: doc, to: nextDoc, energyLoss, distance })
    })

    const driveFilter = ({ from, to, energyLoss, distance }) => {

      const enoughDistance = distance >= MIN_DISTANCE
      const enoughEnergyLoss = energyLoss <= MIN_ENERGY_LOSS

      return enoughDistance && enoughEnergyLoss
    }

    return pairs.filter(driveFilter)
  }

  async usageByLicensePlate(license_plate) {
    return {
      drives
    }
  }

  async countPositions() {
    return await Scooter.countDocuments().exec()
  }

  async countPositionsByTime(days) {
    return await Scooter.aggregate([
      {$group: {_id: '$_request_time', count: {$sum: 1}}},
      {$project: {_id: 0, time: '$_id', count: '$count'}},
      {$sort: {time: -1}},
      {$limit: days*720},
      {$sort: {time: 1}}
    ]).exec()
  }

  async countPositionsByTimeUnit(unit) {
    return await Scooter.aggregate([
      {$group: {_id: { [`$${unit}`]: '$_request_time' }, count: {$sum: 1}}},
      {$project: {_id: 0, [unit]: '$_id', count: '$count'}},
      {$sort: {[unit]: 1}}
    ]).exec()
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
