const ApiContracts = require('authorizenet').APIContracts;

export enum CustomerTypeEnum {
  INDIVIDUAL = ApiContracts.CustomerTypeEnum.INDIVIDUAL,
  BUSINESS = ApiContracts.CustomerTypeEnum.BUSINESS,
}
