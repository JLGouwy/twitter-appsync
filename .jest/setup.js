require('dotenv').config()
require('dotenv').config({ path: '.env-outputs' })
const AWS = require('aws-sdk')
const credentials = new AWS.SharedIniFileCredentials({ profile: process.env.IWB_PROFILE });
AWS.config.credentials = credentials;
AWS.config.region = process.env.AwsRegion