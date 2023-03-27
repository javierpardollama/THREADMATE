const async = require('async');
const newman = require('newman');
const path = require('path');

const COLLECTION_PATH = 'sample_collection.json';

const RUNNER_CONFIG = {
    collection: path.join(__dirname, `postman/${COLLECTION_PATH}`), // your exported collection
    reporters: 'cli',
    insecure: 'true', // allows your requests without SSL Certificate
    threads: 2
};

parallelCollectionRun = (done) => {
    newman.run(RUNNER_CONFIG, done);
};

let tasks = [];

for (let index = 0; index < RUNNER_CONFIG.threads; index++) {
    tasks.push(parallelCollectionRun);
}

// Runs your Postman collection twice (0-1), in parallel.
void async.parallel(tasks, (err, results) => {
    if (err) {
        console.error(err);
    }

    results.forEach(result => {
        let failures = result.run.failures;

        console.info(failures.length
            ? JSON.stringify(failures.failures, null, 2)
            : `${result.collection.name} ran successfully.`);
    });
});