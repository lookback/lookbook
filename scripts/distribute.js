const AWS = require('aws-sdk');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');
const { version: pkgVersion } = require('../package.json');
const { colorize, Color, link } = require('../lib/colorize');

/*
    DISTRIBUTION SCRIPT FOR LOOKBOOK
    -----------------------------------

    * This script will release a given CSS file to a set S3 bucket.
    * All releases are immutable, i.e. they will refuse to overwrite
      an existing version in the bucket.
    * Versions are decided by the `version` field in `package.json`.
    * The script *will* overwrite the `latest` prefix in the bucket with
      the given CSS file.


    USAGE
    -----------------------------------
    ```
    node scripts/distribute.js <path to .css file>
    ```
    
    CREDENTIALS
    -----------------------------------
    This script needs the following as environment variables:
    
    * `AWS_ACCESS_KEY_ID`
    * `AWS_SECRET_ACCESS_KEY`
*/

dotenv.load();

const printError = (...args) => console.error(colorize(Color.Red, ...args));

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucket = process.env.AWS_BUCKET || 'lookbook.lookback.io';
const region = 'eu-west-1';

const LATEST_PREFIX_NAME = 'latest';

if (!accessKeyId || !secretAccessKey) {
    printError(
        '❌ Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY as env variables'
    );
    process.exit(1);
}

const filePath = process.argv[2];

if (!filePath) {
    printError('❌ Please specify path to file as first argument');
    process.exit(1);
}

const s3 = new AWS.S3({
    region,
    accessKeyId,
    secretAccessKey,
});

const readFile = promisify(fs.readFile);
const putObject = promisify(s3.putObject.bind(s3));
const headObject = promisify(s3.headObject.bind(s3));
const exec = promisify(child_process.exec);

const makeKeyName = async (filename, version) => {
    if (typeof version === 'string') {
        return `${version}/${filename}`;
    }

    const { stdout } = await exec('git rev-parse HEAD');
    const shortHash = stdout.trim().substr(0, 10);

    return `${shortHash}/${filename}`;
};

const stylesheetExistsInBucket = (filename, version) =>
    headObject({
        Bucket: bucket,
        Key: `${version}/${filename}`,
    })
        .then(() => true)
        .catch((err) => {
            if (err.code === 'NotFound') {
                return false;
            }

            throw err;
        });

const uploadToBucket = async ({ contents, key, s3opts = {} }) => {
    const opts = {
        Bucket: bucket,
        Key: key,
        ContentType: 'text/css',
        ACL: 'public-read',
        Body: contents,
        ...s3opts,
    };

    await putObject(opts);
};

const releaseFile = async (pathToFile) => {
    console.log(colorize(Color.Dim, '-> Releasing to S3...\n'));

    const version = pkgVersion;
    const contents = await readFile(pathToFile);
    const filename = path.basename(pathToFile);
    const versionedKey = await makeKeyName(filename, version);
    const latestKey = await makeKeyName(filename, LATEST_PREFIX_NAME);

    if (await stylesheetExistsInBucket(filename, version)) {
        printError(
            `❌ Version ${version} already exists on S3.
Please bump the version in package.json and re-run. Nothing has changed on S3 at this point.`
        );
        process.exit(1);
    }

    // Put new versioned file
    await uploadToBucket({ contents, key: versionedKey });

    // Overwrite latest
    await uploadToBucket({
        contents,
        key: latestKey,
    });

    return `✅ ${colorize(Color.Green, `Released ${version} to`)}

* ${link(`https://s3.${region}.amazonaws.com/${bucket}/${versionedKey}`)}
* ${link(`https://s3.${region}.amazonaws.com/${bucket}/${latestKey}`)}`;
};

releaseFile(filePath)
    .then((res) => console.log(res))
    .catch((err) => printError('❌ There was an error:\n', err.message));
