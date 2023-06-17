import {
  IsString,
  IsNotEmpty,
  Validate,
  ValidatorConstraint,
  ValidationArguments,
} from 'class-validator';
import * as moment from 'moment';

@ValidatorConstraint({ name: 'customDateTimeFormat', async: false })
export class DateValidator {
  validate(value: string) {
    const date = moment(value, 'YYYY-MM-DD HH:mm', true);
    return date.isValid();
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid date in the format "YYYY-MM-DD HH:mm:"`;
  }
}

export class NewTaskDTO {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsNotEmpty()
  @Validate(DateValidator)
  dateTime: string;
}
