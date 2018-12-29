const psw = require('./password');
const conf = require('../config');
const createUserID = require('./createID');
const createToken = require('./createToken');

exports.loginData = user => {
  let responseData = {};
  responseData['access_token'] = createToken(user.userId);
  responseData.firstName = user.firstName;
  responseData.id = user.userId;
  responseData.image = (user.img)? user.img : conf.get('defultUser').image;
  responseData.middleName = user.middleName;
  responseData.password = (user.password)? user.password :  conf.get('defultUser').password;
  responseData.permission = user.permission;
  responseData.permissionId = user.permissionId;
  responseData.surName = user.surName;
  responseData.username = user.username;

  return responseData;
};

exports.registrationData = (user) => {
  let userId = createUserID();
  let hashPsw = psw.setHashPassword(user.password, userId);
  let createdAt = new Date().toLocaleString();
  let baseDataUser = {};
  let clientData = {};

  baseDataUser.username = user.username;
  baseDataUser.userId = userId;
  baseDataUser.firstName = user.firstName;
  baseDataUser.surName = user.surName;
  baseDataUser.middleName = user.middleName;
  baseDataUser.img = (user.img)? user.img : '../../assets/img/no-user-image.png';
  baseDataUser.hash = hashPsw;
  baseDataUser.createdAt = createdAt;
  baseDataUser.permissionId = userId;
  baseDataUser.permission = user.permission;

  clientData['access_token'] = createToken(user.userId);
  clientData.firstName = user.firstName;
  clientData.id = userId;
  clientData.image = (user.img)? user.img : '../../assets/img/no-user-image.png';
  clientData.middleName = user.middleName;
  clientData.password = 'password';
  clientData.permission = user.permission;
  clientData.permissionId = userId;
  clientData.surName = user.surName;
  clientData.username = user.username;

  return { baseDataUser: baseDataUser, clientData: clientData };
};

exports.newsData = user => {
  let responseData = {};
  responseData['access_token'] = createToken(user.userId);
  responseData.firstName = user.firstName;
  responseData.id = user.userId;
  responseData.image = (user.img)? user.img : '../../assets/img/no-user-image.png';
  responseData.middleName = user.middleName;
  responseData.password = '***';
  responseData.surName = user.surName;
  responseData.username = user.username;

  return responseData;
};
