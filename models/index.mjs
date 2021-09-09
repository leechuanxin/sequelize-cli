import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

// import model functions here
import initAttractionModel from './attraction.mjs';
import initTripModel from './trip.mjs';

const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

// add your model definitions to db here
db.Attraction = initAttractionModel(sequelize, Sequelize.DataTypes);
db.Trip = initTripModel(sequelize, Sequelize.DataTypes);

// The following 2 lines enable Sequelize to recognise the 1-M relationship
// between Item and Category models, providing the mixin association methods.
db.Attraction.belongsTo(db.Trip);
db.Trip.hasMany(db.Attraction);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;