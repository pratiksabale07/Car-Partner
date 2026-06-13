// One-time migration: copies Driver on Time's data (drivers, jobpostings, enquiries
// collections) from its old Atlas cluster into the CarPartner database.
//
// Usage:
//   node scripts/migrateDriverOnTimeData.js "<source-mongodb-uri>"
//
// The source URI is passed as an argument (not stored) since it belongs to a
// separate, soon-to-be-retired cluster. Destination is read from server/.env
// (MONGODB_URI). Safe to re-run — duplicate _ids are skipped.

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const COLLECTIONS = ['drivers', 'jobpostings', 'enquiries'];
const SOURCE_DB_NAME = 'test';

async function migrate() {
  const sourceUri = process.argv[2];
  if (!sourceUri) {
    console.error('Usage: node scripts/migrateDriverOnTimeData.js "<source-mongodb-uri>"');
    process.exit(1);
  }

  const sourceConn = await mongoose.createConnection(sourceUri, { dbName: SOURCE_DB_NAME }).asPromise();
  const destConn = await mongoose.createConnection(process.env.MONGODB_URI).asPromise();

  console.log(`Source DB: ${sourceConn.db.databaseName}`);
  console.log(`Destination DB: ${destConn.db.databaseName}`);

  for (const name of COLLECTIONS) {
    const docs = await sourceConn.db.collection(name).find({}).toArray();
    if (docs.length === 0) {
      console.log(`${name}: nothing to copy (source empty)`);
      continue;
    }

    try {
      const result = await destConn.db.collection(name).insertMany(docs, { ordered: false });
      console.log(`${name}: copied ${result.insertedCount} of ${docs.length} document(s)`);
    } catch (err) {
      if (err.code === 11000 || err.writeErrors) {
        const inserted = err.result?.nInserted ?? err.insertedDocs?.length ?? 0;
        console.log(`${name}: copied ${inserted} of ${docs.length} document(s) (some already existed, skipped)`);
      } else {
        throw err;
      }
    }
  }

  await sourceConn.close();
  await destConn.close();
  console.log('Migration complete.');
}

migrate().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
