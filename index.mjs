import db from './models/index.mjs';

const command = process.argv[2];

const createTrip = async () => {
  try {
    const existingTrip = await db.Trip.findOne({
      where: {
        name: process.argv[3],
      },
    });

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
    });
    console.log(`A new attraction "${dataValues.name}" has been created, and assigned to the trip "${existingTrip.name}" and category "${existingCategory.name}"!`);
  } catch (error) {
    console.error(error);
  }
};

const getItinerary = async () => {
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
        name: process.argv[4],
      },
    });

    if (!existingCategory) {
      throw new Error(`The category "${process.argv[4]}" does not exist!`);
    }

    const attractions = await existingTrip.getAttractions();

    if (attractions.length === 0) {
      console.log(`There are no attractions for the trip "${existingTrip.name}".`);
    } else {
      const attractionsByCat = attractions
        .filter((attraction) => existingCategory.id === attraction.dataValues.category_id);
      if (attractionsByCat.length === 0) {
        console.log(`There are no attractions for the trip "${existingTrip.name}" with the category "${existingCategory.name}".`);
      } else {
        console.log(`Attractions in "${existingTrip.name}" with the category "${existingCategory.name}":`);
        attractionsByCat.forEach((attraction, index) => {
          console.log(`- ${attraction.name}`);
        });
      }
    }
  } catch (error) {
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

const logCommands = () => {
  console.error('#########################################################');
  console.error('To create a trip:');
  console.error('node index.mjs create <tripName>');
  console.error('---------------------------------------------------------');
  console.error('To add an attraction:');
  console.error('node index.mjs add-attrac <tripName> <attractionName> <categoryName>');
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
    if (process.argv[3] && process.argv[4] && process.argv[5]) {
      addAttraction();
    } else {
      console.error('Please add an attraction with the command:');
      console.error('node index.mjs add-attrac <tripName> <attractionName> <categoryName>');
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
  default:
    logCommands();
    break;
}
