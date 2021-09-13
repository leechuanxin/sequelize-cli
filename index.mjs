import db from './models/index.mjs';

const command = process.argv[2];
const { Op } = db.Sequelize;

const createTrip = async () => {
  try {
    const existingTrip = await db.Trip.findOne({
      where: {
        name: process.argv[3],
      },
    });

    console.log('existing trip?', existingTrip);

    if (existingTrip) {
      throw new Error(`The trip ${existingTrip} already exists!`);
    }

    const { dataValues } = await db.Trip.create({
      name: process.argv[3],
    });
    console.log(`The trip "${dataValues.name}" has been created!`);
  } catch (error) {
    console.error(error);
  }
};

const addAttraction = async () => {
  try {
    if (
      Number.isNaN(Number(process.argv[6]))
      || Number.isNaN(Number(process.argv[7]))
    ) {
      throw new Error('The latitude and longitude have to be numbers!');
    }

    const existingTrip = await db.Trip.findOne({
      where: {
        name: process.argv[3],
      },
    });

    if (!existingTrip) {
      throw new Error(`The trip "${process.argv[3]}" does not exist!`);
    }

    const existingCategory = await db.Category.findOne({
      where: {
        name: process.argv[5],
      },
    });

    if (!existingCategory) {
      throw new Error(`The category "${process.argv[5]}" does not exist!`);
    }

    const { dataValues } = await db.Attraction.create({
      name: process.argv[4],
      tripId: existingTrip.id,
      categoryId: existingCategory.id,
      latitude: process.argv[6],
      longitude: process.argv[7],
    });
    console.log(`A new attraction "${dataValues.name}" has been created, and assigned to the trip "${existingTrip.name}" and category "${existingCategory.name}". Its latitude is ${process.argv[6]} and longitude is ${process.argv[7]}!`);
  } catch (error) {
    console.error(error);
  }
};

const getItinerary = async () => {
  try {
    const existingTrip = await db.Trip.findOne({
      where: {
        name: process.argv[3],
      },
    });

    if (!existingTrip) {
      throw new Error(`The trip "${process.argv[3]}" does not exist!`);
    }

    const attractions = await existingTrip.getAttractions();

    if (attractions.length === 0) {
      console.log(`There is no itinerary for the trip "${existingTrip.name}".`);
    } else {
      console.log(`Itinerary for "${existingTrip.name}":`);
      attractions.forEach((attraction, index) => {
        console.log(`${index + 1}. ${attraction.name}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const addCategory = async () => {
  try {
    const existingCategory = await db.Category.findOne({
      where: {
        name: process.argv[3],
      },
    });

    if (existingCategory) {
      throw new Error(`The category ${existingCategory} already exists!`);
    }

    const { dataValues } = await db.Category.create({
      name: process.argv[3],
    });
    console.log(`The category "${dataValues.name}" has been created!`);
  } catch (error) {
    console.error(error);
  }
};

const getAttracsByTripCategory = async () => {
  try {
    const [existingTrip, existingCategory] = await Promise.all(
      [
        db.Trip.findOne({
          where: {
            name: process.argv[3],
          },
        }),
        db.Category.findOne({
          where: {
            name: process.argv[4],
          },
        }),
      ],
    );

    if (!existingTrip) {
      throw new Error(`The trip "${process.argv[3]}" does not exist!`);
    }
    if (!existingCategory) {
      throw new Error(`The category "${process.argv[4]}" does not exist!`);
    }
    const attractions = await existingCategory.getAttractions({
      where: {
        tripId: existingTrip.id,
      },
    });

    if (attractions.length === 0) {
      console.log(`There are no attractions for the trip "${existingTrip.name}" with the category "${existingCategory.name}".`);
    } else {
      console.log(`Attractions in "${existingTrip.name}" with the category "${existingCategory.name}":`);
      attractions.forEach((attraction) => {
        console.log(`- ${attraction.name}`);
      });
    }
  }
  catch (error) {
    console.error(error);
  }
};

const getAttracsByCategory = async () => {
  try {
    const existingCategory = await db.Category.findOne({
      where: {
        name: process.argv[3],
      },
    });

    if (!existingCategory) {
      throw new Error(`The category "${process.argv[3]}" does not exist!`);
    }

    const attractions = await existingCategory.getAttractions();
    if (attractions.length === 0) {
      console.log(`There are no attractions for the category "${existingCategory.name}".`);
    } else {
      console.log(`Attractions for the category "${existingCategory.name}":`);
      attractions.forEach((attraction) => {
        console.log(`- ${attraction.name}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const getAttracsFrom = async () => {
  try {
    const trip = process.argv[3];
    const lat = process.argv[4];
    const long = process.argv[5];
    const cardinalDir = process.argv[6];
    let attractions = [];

    if (
      Number.isNaN(Number(lat))
      || Number.isNaN(Number(long))
    ) {
      throw new Error('The latitude and longitude have to be numbers!');
    }

    if (cardinalDir !== 'north' && cardinalDir !== 'south' && cardinalDir !== 'east' && cardinalDir !== 'west') {
      throw new Error('The cardinal direction has to be one of: north, south, east, or west.');
    }

    const existingTrip = await db.Trip.findOne({
      where: {
        name: trip,
      },
    });

    if (!existingTrip) {
      throw new Error(`The trip "${trip}" does not exist!`);
    }

    switch (cardinalDir) {
      case 'north':
        attractions = await existingTrip.getAttractions({
          where: {
            latitude: {
              [Op.gt]: lat,
            },
          },
        });
        break;
      case 'south':
        attractions = await existingTrip.getAttractions({
          where: {
            latitude: {
              [Op.lt]: lat,
            },
          },
        });
        break;
      case 'east':
        attractions = await existingTrip.getAttractions({
          where: {
            longitude: {
              [Op.gt]: long,
            },
          },
        });
        break;
      case 'west':
      default:
        attractions = await existingTrip.getAttractions({
          where: {
            longitude: {
              [Op.lt]: long,
            },
          },
        });
        break;
    }

    if (attractions.length === 0) {
      console.log(`There are no attractions for the trip "${trip}" to the ${cardinalDir} of the latitude ${lat} and longitude ${long}.`);
    } else {
      console.log(`Attractions for the trip "${trip}" to the ${cardinalDir} of the latitude ${lat} and longitude ${long}:`);
      attractions.forEach((attraction) => {
        console.log(`- ${attraction.name}`);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const logCommands = () => {
  console.error('#########################################################');
  console.error('To create a trip:');
  console.error('node index.mjs create <tripName>');
  console.error('---------------------------------------------------------');
  console.error('To add an attraction:');
  console.error('node index.mjs add-attrac <tripName> <attractionName> <categoryName> <latitude> <longitude>');
  console.error('---------------------------------------------------------');
  console.error('To get an itinerary for a trip:');
  console.error('node index.mjs trip <tripName>');
  console.error('---------------------------------------------------------');
  console.error('To add a new category:');
  console.error('node index.mjs add-category <categoryName>');
  console.error('---------------------------------------------------------');
  console.error('To view all attractions in a trip with a given category:');
  console.error('node index.mjs category-trip <tripName> <categoryName>');
  console.error('---------------------------------------------------------');
  console.error('To view all attractions with a given category:');
  console.error('node index.mjs category-attractions <categoryName>');
  console.error('---------------------------------------------------------');
  console.error('To view all attractions in a given direction from a location:');
  console.error('node index.mjs get-attractions-from <tripName> <latitude> <longitude> <cardinalDirection>');
  console.error('#########################################################');
};

switch (command) {
  case 'create':
    if (process.argv[3]) {
      createTrip();
    } else {
      console.error('Please create a new trip with the command:');
      console.error('node index.mjs create <tripName>');
    }
    break;
  case 'add-attrac':
    if (
      process.argv[3] && process.argv[4] && process.argv[5] && process.argv[6] && process.argv[7]
    ) {
      addAttraction();
    } else {
      console.error('Please add an attraction with the command:');
      console.error('node index.mjs add-attrac <tripName> <attractionName> <categoryName> <latitude> <longitude>');
    }
    break;
  case 'trip':
    if (process.argv[3]) {
      getItinerary();
    } else {
      console.error('Please view your trip itinerary with the command:');
      console.error('node index.mjs trip <tripName>');
    }
    break;
  case 'add-category':
    if (process.argv[3]) {
      addCategory();
    } else {
      console.error('Please add a new category with the command:');
      console.error('node index.mjs add-category <categoryName>');
    }
    break;
  case 'category-trip':
    if (process.argv[3] && process.argv[4]) {
      getAttracsByTripCategory();
    } else {
      console.error('Please view all attractions in a trip with a given category with the command:');
      console.error('node index.mjs category-trip <tripName> <categoryName>');
    }
    break;
  case 'category-attractions':
    if (process.argv[3]) {
      getAttracsByCategory();
    } else {
      console.error('Please view all attractions with a given category with the command:');
      console.error('node index.mjs category-attractions <categoryName>');
    }
    break;
  case 'get-attractions-from':
    if (process.argv[3] && process.argv[4] && process.argv[5] && process.argv[6]) {
      getAttracsFrom();
    } else {
      console.error('Please view all attractions in a given direction from a location with the command:');
      console.error('node index.mjs get-attractions-from <tripName> <latitude> <longitude> <cardinalDirection>');
    }
    break;
  default:
    logCommands();
    break;
}
