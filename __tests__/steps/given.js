require('dotenv').config()
const AWS = require('aws-sdk')
const chance = require('chance').Chance()
const velocityUtil = require('amplify-appsync-simulator/lib/velocity/util')

const a_random_user = () => {
  const firstname = chance.first({ nationality: 'en' });
  const lastname = chance.first({ nationality: 'en' });
  const suffix = chance.string({ length: 4, pool: 'abcefghijklmnopqrstuvwxyz' });
  const name = `${firstname} ${lastname} ${suffix}`;
  const password = chance.string({ length: 8 });
  const email = `${firstname}-${lastname}-${suffix}@appsyncmasterclass.com`;

  return { name, password, email };
}

const an_appsync_context = (identity, args) => {
  const util = velocityUtil.create([], new Date(), Object());
  const context = {
    identity,
    args,
    arguments: args
  };

  return {
    context,
    ctx: context,
    util,
    utils: util,
  }
}

const an_authenticated_user = async () => {
  const { name, email, password } = a_random_user()

  const cognito = new AWS.CognitoIdentityServiceProvider()

  const userPoolId = process.env.CognitoUserPoolId
  const clientId = process.env.WebCognitoUserPoolClientId

  const signUpResp = await cognito.signUp({
    ClientId: clientId,
    Username: email,
    Password: password,
    UserAttributes: [
      { Name: 'name', Value: name }
    ]
  }).promise()

  const username = signUpResp.UserSub
  console.log(`[${email}] - user has signed up [${username}]`)

  await cognito.adminConfirmSignUp({
    UserPoolId: userPoolId,
    Username: username
  }).promise()

  console.log(`[${email}] - confirmed sign up`)

  const auth = await cognito.initiateAuth({
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: clientId,
    AuthParameters: {
      USERNAME: username,
      PASSWORD: password
    }
  }).promise()

  console.log(`[${email}] - signed in`)

  return {
    username,
    name,
    email,
    idToken: auth.AuthenticationResult.IdToken,
    accessToken: auth.AuthenticationResult.AccessToken
  }
}

module.exports = {
  a_random_user,
  an_appsync_context,
  an_authenticated_user
}