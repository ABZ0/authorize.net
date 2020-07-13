import {
  Length,
  Min,
  Max,
  IsCreditCard,
  IsEnum,
  IsAlphanumeric,
  IsEmail,
  IsNumberString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerTypeEnum } from '../enum/customer-type.enum';
import { ARBSubscriptionUnitEnum } from '../enum/ARB-subscription-unit.enum';

export class CreateSubscriptionDto {
  @Length(1, 50)
  @ApiProperty({ description: 'Merchant-assigned name for the subscription.' })
  subscriptionName: string;

  @Min(1)
  @Max(365)
  @ApiProperty({
    example: 12,
    description:
      'For a unit of days, use an integer between 7 and 365, inclusive. For a unit of months, use an integer between 1 and 12, inclusive.',
  })
  intervalLength: number;

  @IsEnum(ARBSubscriptionUnitEnum)
  @ApiProperty({
    enum: ARBSubscriptionUnitEnum,
    description:
      'The unit of time, in association with the length, between each billing occurrence',
  })
  intervalUnit: ARBSubscriptionUnitEnum;

  @Length(10, 10, { message: 'startDate must be equal to 10 characters' })
  @ApiProperty({
    example: '2020-08-20',
    maxLength: 10,
    minLength: 10,
    description:
      'The date of the first payment. Can not be prior to the subscription creation date.',
  })
  startDate: string;

  @Min(1)
  @Max(9999)
  @ApiProperty({
    example: 10,
    description:
      'Number of payments for the subscription. If a trial period is specified, this value should include the number of payments during the trial period. To create an ongoing subscription without an end date, set totalOccurrences to "9999".',
  })
  totalOccurrences: number;

  @Length(1, 16)
  @IsNumberString()
  @ApiProperty({
    example: '8.65',
    description:
      'Amount of the charge to be run after the trial period. This is the total amount and must include tax, shipping, tips, and any other charges.',
  })
  amount: string;

  @IsCreditCard()
  @ApiProperty({ example: '4111111111111111' })
  cardNumber: string;

  @Length(7, 7, { message: 'startDate must be equal to 7 characters' })
  @ApiProperty({ example: '2038-12', maxLength: 7, minLength: 7 })
  expirationDate: string;

  @Length(1, 16)
  @IsNumberString()
  @ApiProperty({
    example: '1.99',
    description:
      'Required when using trialOccurrences. During the trial period, we will bill trialAmount on each scheduled payment. Once the trial period is over, we will bill amount for the remaining scheduled payments.',
  })
  trialAmount?: string;

  @Min(1)
  @Max(99)
  @ApiPropertyOptional({ example: 1, default: 0 })
  trialOccurrences?: number = 0;

  @Length(1, 20)
  @ApiPropertyOptional({
    example: '78538',
    maxLength: 20,
    description: 'Merchant-defined invoice number associated with the order.',
  })
  invoiceNumber?: string;

  @Length(1, 255)
  @ApiPropertyOptional({
    example: 'Description for invoice 78538.',
    maxLength: 255,
    description: 'Merchant-provided description of the subscription.',
  })
  description?: string;

  @IsEnum(CustomerTypeEnum)
  customerType?: CustomerTypeEnum;

  @Length(1, 20)
  @IsAlphanumeric()
  @ApiPropertyOptional({
    example: '23523',
    description:
      "Generated userID. Can't use ObjectID as its length is larger than 20",
  })
  customerId?: string;

  @IsEmail()
  @ApiPropertyOptional({ example: 'Hemedah94@gmail.com' })
  customerEmail?: string;

  @Length(1, 25)
  @ApiPropertyOptional({ example: '(123) 555-1234' })
  customerPhoneNumber?: string;

  @ApiPropertyOptional({ example: '(123) 555-1234' })
  customerFaxNumber?: string;

  @Length(1, 50)
  @ApiPropertyOptional({ example: 'Abdallah', maxLength: 50 })
  firstName?: string;

  @Length(1, 50)
  @ApiPropertyOptional({ example: 'Hemedah', maxLength: 50 })
  lastName?: string;

  @Length(1, 50)
  @ApiPropertyOptional({ example: 'Pharaoh', maxLength: 50 })
  company?: string;

  @Length(1, 60)
  @ApiPropertyOptional({
    example: 'Customer’s billing address.',
    maxLength: 60,
  })
  address?: string;

  @Length(1, 40)
  @ApiPropertyOptional({ example: 'Damanhour', maxLength: 40 })
  city?: string;

  @Length(1, 40)
  @ApiPropertyOptional({ example: 'Behira', maxLength: 40 })
  state?: string;

  @Length(1, 20)
  @ApiPropertyOptional({ example: '22112', maxLength: 20 })
  zip?: string;

  @Length(1, 60)
  @ApiPropertyOptional({ example: 'Egypt', maxLength: 60 })
  country?: string;
}
