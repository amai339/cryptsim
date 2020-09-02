# Cryptocurrency simulator

Buy and sell 100+ cryptocurriences without using real money

Deployed on heroku: https://cryptsim.herokuapp.com


 <img width="850" height="697" src="https://i.imgur.com/oba39XU.png">
 
 
### Installation instructions
```
npm install
npm run client-install
```
### Add your own mongo URI, JWT secret key, and CoinMarketCap key in config/dev.js
```
module.exports = {
  mongoURI: //mongodb
  authenticationKey: //cookie auth key,
  coinMarketKey: //CoinMarketApi api key
};
```

### To start up server and client run
```
npm run dev
```
