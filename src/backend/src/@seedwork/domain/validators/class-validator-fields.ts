import { validateSync } from "class-validator";
import ValidatorFieldsInterface, {
  FieldsErrors,
} from "./validator-fields-interface";

export abstract class ClassValidatorFields<PropsValidated>
  implements ValidatorFieldsInterface<PropsValidated>
{
  //@ts-expect-error
  errors: FieldsErrors = null;
  //@ts-expect-error
  validatedData: PropsValidated = null;
  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        //@ts-expect-error
        this.errors[field] = Object.values(error.constraints);
      }
    } else {
      this.validatedData = data;
    }
    return !errors.length;
  }
}

export default ClassValidatorFields;
