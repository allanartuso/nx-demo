const errorMessages: Record<string, string> = {
  required: '{{fieldName}} is required.',
  max: 'Maximum {{fieldName}} is {{max}}.',
  min: 'Minimum {{fieldName}} is {{min}}.',
  maxlength: '{{fieldName}} can be max {{requiredLength}} characters long.',
  minlength: '{{fieldName}} must be at least {{requiredLength}} characters long.',
  email: '{{fieldName}} must be an email.'
};

export function getErrorMessage(errorKey: string, replacements: Record<string, string>): string {
  if (!errorMessages[errorKey]) {
    return `Missing error message to the error with key ${errorKey}`;
  }

  return errorMessages[errorKey].replace(/{{(\w+)}}/g, (placeholderWithDelimiters, placeholderWithoutDelimiters) =>
    replacements[placeholderWithoutDelimiters] ? replacements[placeholderWithoutDelimiters] : placeholderWithDelimiters
  );
}
