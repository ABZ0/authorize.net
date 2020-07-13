const ApiContracts = require('authorizenet').APIContracts;
const ApiControllers = require('authorizenet').APIControllers;

import { Injectable, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

import constants from '../constants';

@Injectable()
export class AuthorizeService {
  private sendResponse(
    res: Response,
    status: HttpStatus,
    messageCode: string,
    messageText: string,
    subscription?: any,
    subscriptionId?: string,
    subscriptionStatus?: string,
  ) {
    res.status(status).send({
      messageCode,
      messageText,
      subscription,
      subscriptionId,
      subscriptionStatus,
    });
  }

  createSubscription(dto: CreateSubscriptionDto, res: Response) {
    const {
      startDate,
      totalOccurrences,
      trialOccurrences,
      cardNumber,
      expirationDate,
      invoiceNumber,
      description,
      customerType,
      customerId,
      customerEmail,
      customerPhoneNumber,
      customerFaxNumber,
      intervalLength,
      intervalUnit,
      subscriptionName,
      amount,
      trialAmount,
      firstName,
      lastName,
      company,
      address,
      country,
      state,
      city,
      zip,
    } = dto;

    // TODO add from .env
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    const interval = new ApiContracts.PaymentScheduleType.Interval();
    interval.setLength(intervalLength);
    interval.setUnit(intervalUnit);

    const paymentScheduleType = new ApiContracts.PaymentScheduleType();
    paymentScheduleType.setInterval(interval);
    paymentScheduleType.setStartDate(startDate);
    paymentScheduleType.setTotalOccurrences(totalOccurrences);
    paymentScheduleType.setTrialOccurrences(trialOccurrences);

    const creditCard = new ApiContracts.CreditCardType();
    creditCard.setExpirationDate(expirationDate);
    creditCard.setCardNumber(cardNumber);

    const payment = new ApiContracts.PaymentType();
    payment.setCreditCard(creditCard);

    const orderType = new ApiContracts.OrderType();
    orderType.setInvoiceNumber(invoiceNumber);
    orderType.setDescription(description);

    const customer = new ApiContracts.CustomerType();
    customer.setType(customerType);
    customer.setId(customerId);
    customer.setEmail(customerEmail);
    customer.setPhoneNumber(customerPhoneNumber);
    customer.setFaxNumber(customerFaxNumber);

    const nameAndAddressType = new ApiContracts.NameAndAddressType();
    nameAndAddressType.setFirstName(firstName);
    nameAndAddressType.setLastName(lastName);
    nameAndAddressType.setCompany(company);
    nameAndAddressType.setAddress(address);
    nameAndAddressType.setCity(city);
    nameAndAddressType.setState(state);
    nameAndAddressType.setZip(zip);
    nameAndAddressType.setCountry(country);

    // Subscription Creation
    const arbSubscription = new ApiContracts.ARBSubscriptionType();
    arbSubscription.setName(subscriptionName);
    arbSubscription.setPaymentSchedule(paymentScheduleType);
    arbSubscription.setAmount(amount);
    arbSubscription.setTrialAmount(trialAmount);
    arbSubscription.setPayment(payment);
    arbSubscription.setOrder(orderType);
    arbSubscription.setCustomer(customer);
    arbSubscription.setBillTo(nameAndAddressType);
    arbSubscription.setShipTo(nameAndAddressType);

    const createRequest = new ApiContracts.ARBCreateSubscriptionRequest();
    createRequest.setMerchantAuthentication(merchantAuthenticationType);
    createRequest.setSubscription(arbSubscription);

    // console.log(JSON.stringify(createRequest.getJSON(), null, 2));

    const ctrl = new ApiControllers.ARBCreateSubscriptionController(
      createRequest.getJSON(),
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();

      const response = new ApiContracts.ARBCreateSubscriptionResponse(
        apiResponse,
      );

      // console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        const subscriptionId = response.getSubscriptionId();

        this.sendResponse(
          res,
          subscriptionId ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST,
          response.getMessages().getMessage()[0].getCode(),
          response.getMessages().getMessage()[0].getText(),
          undefined,
          subscriptionId,
        );
      } else {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Null Response.');
      }
    });
  }

  updateSubscription(dto, res: Response) {}

  cancelSubscription(subscriptionId: string, res: Response) {
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    const cancelRequest = new ApiContracts.ARBCancelSubscriptionRequest();
    cancelRequest.setMerchantAuthentication(merchantAuthenticationType);
    cancelRequest.setSubscriptionId(subscriptionId);

    // console.log(JSON.stringify(cancelRequest.getJSON(), null, 2));

    const ctrl = new ApiControllers.ARBCancelSubscriptionController(
      cancelRequest.getJSON(),
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();

      const response = new ApiContracts.ARBCancelSubscriptionResponse(
        apiResponse,
      );

      // console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        const result = response?.getMessages()?.getResultCode();
        this.sendResponse(
          res,
          result === 'Error' ? HttpStatus.NOT_FOUND : HttpStatus.OK,
          response.getMessages().getMessage()[0].getCode(),
          response.getMessages().getMessage()[0].getText(),
          undefined,
          undefined,
        );
      } else {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Null Response.');
      }
    });
  }

  getSubscription(subscriptionId: string, res: Response) {
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    const getRequest = new ApiContracts.ARBGetSubscriptionRequest();
    getRequest.setMerchantAuthentication(merchantAuthenticationType);
    getRequest.setSubscriptionId(subscriptionId);

    // console.log(JSON.stringify(getRequest.getJSON(), null, 2));

    const ctrl = new ApiControllers.ARBGetSubscriptionController(
      getRequest.getJSON(),
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();

      const response = new ApiContracts.ARBGetSubscriptionResponse(apiResponse);

      // console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        const subscription = response.getSubscription();
        this.sendResponse(
          res,
          subscription ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          response.getMessages().getMessage()[0].getCode(),
          response.getMessages().getMessage()[0].getText(),
          subscription,
        );
      } else {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Null Response.');
      }
    });
  }

  getSubscriptionStatus(subscriptionId: string, res: Response) {
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    const getRequest = new ApiContracts.ARBGetSubscriptionStatusRequest();
    getRequest.setMerchantAuthentication(merchantAuthenticationType);
    getRequest.setSubscriptionId(subscriptionId);

    // console.log(JSON.stringify(getRequest.getJSON(), null, 2));

    const ctrl = new ApiControllers.ARBGetSubscriptionStatusController(
      getRequest.getJSON(),
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();

      const response = new ApiContracts.ARBGetSubscriptionStatusResponse(
        apiResponse,
      );

      // console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        const subscriptionStatus = response?.getStatus();

        this.sendResponse(
          res,
          subscriptionStatus ? HttpStatus.OK : HttpStatus.NOT_FOUND,
          response.getMessages().getMessage()[0].getCode(),
          response.getMessages().getMessage()[0].getText(),
          undefined,
          undefined,
          subscriptionStatus,
        );
      } else {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Null Response.');
      }
    });
  }

  getListOfSubscriptions(res: Response) {
    const merchantAuthenticationType = new ApiContracts.MerchantAuthenticationType();
    merchantAuthenticationType.setName(constants.apiLoginKey);
    merchantAuthenticationType.setTransactionKey(constants.transactionKey);

    // const refId = utils.getRandomInt();

    const sorting = new ApiContracts.ARBGetSubscriptionListSorting();
    sorting.setOrderDescending(true);
    sorting.setOrderBy(
      ApiContracts.ARBGetSubscriptionListOrderFieldEnum.CREATETIMESTAMPUTC,
    );

    const paging = new ApiContracts.Paging();
    paging.setOffset(1);
    paging.setLimit(100);

    const listRequest = new ApiContracts.ARBGetSubscriptionListRequest();

    listRequest.setMerchantAuthentication(merchantAuthenticationType);

    // listRequest.setRefId(refId);
    listRequest.setSearchType(
      ApiContracts.ARBGetSubscriptionListSearchTypeEnum.SUBSCRIPTIONACTIVE,
    );
    listRequest.setSorting(sorting);
    listRequest.setPaging(paging);

    // console.log(JSON.stringify(listRequest.getJSON(), null, 2));

    const ctrl = new ApiControllers.ARBGetSubscriptionListController(
      listRequest.getJSON(),
    );

    ctrl.execute(() => {
      const apiResponse = ctrl.getResponse();

      const response = new ApiContracts.ARBGetSubscriptionListResponse(
        apiResponse,
      );

      // console.log(JSON.stringify(response, null, 2));

      if (response != null) {
        this.sendResponse(
          res,
          HttpStatus.OK,
          response.getMessages().getMessage()[0].getCode(),
          response.getMessages().getMessage()[0].getText(),
          {
            items: response?.getSubscriptionDetails(),
            count: response.getTotalNumInResultSet(),
          },
        );
      } else {
        res.status(HttpStatus.SERVICE_UNAVAILABLE).send('Null Response.');
      }
    });

    //   if (response != null) {
    //     if (
    //       response.getMessages().getResultCode() ==
    //       ApiContracts.MessageTypeEnum.OK
    //     ) {
    //       console.log('Total Results: ' + response.getTotalNumInResultSet());
    //       console.log('List of Subscription IDs: ');
    //       const subscriptions = response
    //         .getSubscriptionDetails()
    //         .getSubscriptionDetail();
    //       for (const i = 0; i < subscriptions.length; i++) {
    //         console.log(subscriptions[i].getId());
    //       }
    //       console.log(
    //         'Message Code: ' + response.getMessages().getMessage()[0].getCode(),
    //       );
    //       console.log(
    //         'Message Text: ' + response.getMessages().getMessage()[0].getText(),
    //       );
    //     } else {
    //       console.log('Result Code: ' + response.getMessages().getResultCode());
    //       console.log(
    //         'Error Code: ' + response.getMessages().getMessage()[0].getCode(),
    //       );
    //       console.log(
    //         'Error message: ' +
    //           response.getMessages().getMessage()[0].getText(),
    //       );
    //     }
    //   } else {
    //     console.log('Null Response.');
    //   }

    //   callback(response);
    // });
  }
}
