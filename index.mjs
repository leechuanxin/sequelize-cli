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

    const { dataValues } = await db.Attraction.create({
      name: process.argv[4],
      tripId: existingTrip.id,
    });
    console.log(`A new attraction "${dataValues.name}" has been created, and assigned to the trip "${existingTrip.name}"!`);
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
  console.error('node index.mjs add-attrac <tripName> <attractionName>');
  console.error('---------------------------------------------------------');
  console.error('To get an itinerary for a trip:');
  console.error('node index.mjs trip <tripName>');
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
    if (process.argv[3] && process.argv[4]) {
      addAttraction();
    } else {
      console.error('Please add an attraction with the command:');
      console.error('node index.mjs add-attrac <tripName> <attractionName>');
    }
    break;
  default:
    logCommands();
    break;
}

// db.<MODEL_NAME_CAPITALIZED_SINGULAR>
//   .create({
//     <COLUMN_NAME>: <VALUE>,
//     [<OTHER_COLUMN_NAMES_AND_VALUES>]
//   })
//   .then((<RESULT_ROW>) => {
//     console.log('success!');
//     console.log(<RESULT_ROW>);
//   })
//   .catch((error) => console.log(error));
