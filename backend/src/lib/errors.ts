import { ValidationError as classValidatorError } from 'class-validator';

export class ValidationError extends Error {
  public data: any[] = [];

  constructor(errors: classValidatorError[]) {
    super('Validation Error!');

    this.name = this.constructor.name;
    errors.forEach((e) => {
      if (e.constraints === undefined && e.children) {
        e.children.forEach((ec) => {
          this.data.push({ field: `${e.property}.${ec.property}`, constraints: ec.constraints });
        });
      } else {
        this.data.push({ field: e.property, constraints: e.constraints });
      }
    });

    // This clips the constructor invocation from the stack trace.
    // It's not absolutely essential, but it does make the stack trace a little nicer.
    //  @see Node.js reference (bottom)
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PremiumError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
