const AWS = require('aws-sdk');
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const dotenv = require('dotenv');
const { version: pkgVersion } = require('../package.json');

dotenv.load();

const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucket = process.env.AWS_BUCKET || 'lookbook.lookback.io';
const region = 'eu-west-1';

if (!accessKeyId || !secretAccessKey) {
    console.error(
        '❌ Missing AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY as env variables'
    );
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

const uploadFile = async (pathToFile) => {
    console.log('-> Releasing to S3...');

    const contents = await readFile(pathToFile);
    const filename = path.basename(pathToFile);
    const key = await makeKeyName(filename);
    const version = pkgVersion;

    const opts = {
        Bucket: bucket,
        Key: key,
        ContentType: 'text/css',
        ACL: 'public-read',
        Body: contents,
    };

    if (await stylesheetExistsInBucket(filename, version)) {
        console.error(
            `❌ Version ${version} already exists on S3.
Please bump the version in package.json and re-run.`
        );
        process.exit(1);
    }

    await putObject(opts);

    return `✅ Released ${version} to\nhttps://s3.${region}.amazonaws.com/${
        opts.Bucket
    }/${opts.Key}`;
};

const filePath = process.argv[2];

if (!filePath) {
    console.error('❌ Please specify path to file as first argument');
    process.exit(1);
}

uploadFile(filePath)
    .then((res) => console.log(res))
    .catch((err) => console.error('❌ There was an error:\n', err.message));
