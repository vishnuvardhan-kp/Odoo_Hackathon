import User from './User.js';
import Trip from './Trip.js';
import Destination from './Destination.js';
import Activity from './Activity.js';
import Expense from './Expense.js';

// Set up associations
Trip.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Trip, { foreignKey: 'user_id' });

Destination.belongsTo(Trip, { foreignKey: 'trip_id' });
Trip.hasMany(Destination, { foreignKey: 'trip_id' });

Activity.belongsTo(Destination, { foreignKey: 'destination_id' });
Destination.hasMany(Activity, { foreignKey: 'destination_id' });

Expense.belongsTo(Trip, { foreignKey: 'trip_id' });
Trip.hasMany(Expense, { foreignKey: 'trip_id' });

export { User, Trip, Destination, Activity, Expense };


