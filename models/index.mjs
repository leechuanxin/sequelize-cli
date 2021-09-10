import { Sequelize } from 'sequelize';
import allConfig from '../config/config.js';

// import model functions here
import initAttractionModel from './attraction.mjs';
import initTripModel from './trip.mjs';
import initCategoryModel from './category.mjs';

const env = process.env.NODE_ENV || 'development';
const config = allConfig[env];
const db = {};

let sequelize = new Sequelize(config.database, config.username, config.password, config);

// add your model definitions to db here
db.Attraction = initAttractionModel(sequelize, Sequelize.DataTypes);
db.Trip = initTripModel(sequelize, Sequelize.DataTypes);
db.Category = initCategoryModel(sequelize, Sequelize.DataTypes);

// The following 2 lines enable Sequelize to recognise the 1-M relationship
// between Attraction and Trip models, providing the mixin association methods.
db.Attraction.belongsTo(db.Trip);
db.Trip.hasMany(db.Attraction);
// The following 2 lines enable Sequelize to recognise the 1-M relationship
// between Attraction and Trip models, providing the mixin association methods.
db.Attraction.belongsTo(db.Category);
db.Category.hasMany(db.Attraction);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;