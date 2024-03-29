const Director = require('./Director')
const log = require('./Logger')

class RobotSimulator {
  constructor(numRobots = 1, instructions) {
    this.numRobots = numRobots
    this.director = new Director(numRobots, instructions)
    this.deliveries = {}
  }
  execute_turn() {
    // Execute one turn from the remaining instructions
    let robot_delivery = this.director.operate_next_robot()
    if(robot_delivery) {
      this.make_delivery(robot_delivery)
    }
    else {
      log("Robot cannot deliver. Space is already occupied.")
    }
    log("--------------------------")
  }
  execute_all() {
    // Execute all remaining instructions
    log(this.director.turnInstruction);
    while(this.director.turnInstruction) {
      this.execute_turn()
    }
  }
  robot_positions() {
    // log the current position of the robots
    let positions = this.director.robots.map((robot) => { return [robot.position.x, robot.position.y] })
    log('Robot positions:')
    log(positions)
    return positions
  }
  houses_with_packages(packageThreshold = 1) {
    // Return the number of houses that have atleast packageThreshold packages
    // delivered
    let housesOverPackageThreshold = 0
    for (let key in this.deliveries) {
      if(this.deliveries[key] >= packageThreshold){
        housesOverPackageThreshold++
      }
    }
    log(`Houses that have received atleast ${packageThreshold} package${packageThreshold > 1 ? 's' : ''}: ${housesOverPackageThreshold}`)
    return housesOverPackageThreshold
  }
  deliveries_made() {
    // Return the total number of deliveries made
    let totalDeliveries = 0
    for (let key in this.deliveries) {
      totalDeliveries += this.deliveries[key]
    }
    log(`Total deliveries made: ${totalDeliveries}`)
    return totalDeliveries
  }

  make_delivery(robot) {
    // Deliver a package to the robot's current position
    log(`Delivery made to ${robot.position.x},${robot.position.y}`)

    // Store deliveries in an object using the format: { 'x,y': numDeliveries }
    let positionKey = `${robot.position.x},${robot.position.y}`
    if (positionKey in this.deliveries) {
      this.deliveries[positionKey] = this.deliveries[positionKey] + 1
    }
    else {
      this.deliveries[positionKey] = 1
    }
  }
}

function run_input(numRobots, instructions){
  let sim = new RobotSimulator(numRobots, instructions)
  sim.execute_all()
}

let args = process.argv.slice(2)
if(process.env.NODE_ENV !== 'test' && args.length >= 2) {
  run_input(args[0], args[1])
}

module.exports = RobotSimulator

