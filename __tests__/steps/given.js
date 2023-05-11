const chance = require('chance').Chance();

const a_random_user = () => {
  const firstname = chance.first({ nationality: 'en' });
  const lastname = chance.first({ nationality: 'en' });
  const suffix = chance.string({ length: 4, pool: 'abcefghijklmnopqrstuvwxyz' });
  const name = `${firstname} ${lastname} ${suffix}`;
  const password = chance.string({ length: 8 });
  const email = `${firstname}-${lastname}-${suffix}@appsyncmasterclass.com`;

  return { name, password, email };
}

module.exports = {
  a_random_user
}