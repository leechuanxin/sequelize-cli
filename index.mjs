import db from './models/index.mjs';

const command = process.argv[2];

const createTrip = async () => {
  try {
    const existingTrip = await db.Trip.findOne({
      where: {
        name: [process.argv[3]],
      },
    });

    if (existingTrip) {
      throw new Error('This trip already exists!');
    }

    const { dataValues } = await db.Trip.create({
      name: process.argv[3],
    });
    console.log(`The trip "${dataValues.name}" has been created!`);
  } catch (error) {
    console.error(error);
  }
};

if (command === 'create') {
  if (process.argv[3]) {
    createTrip();
  } else {
    console.error('Please create a new trip with the command:');
    console.error('node index.mjs create <tripName>');
  }
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
