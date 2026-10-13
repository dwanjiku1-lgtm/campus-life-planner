// scripts/validators.js

// Make sure the title isn`t blank and doesn`t have messy leading/trailing spaces
export const validateTitle = (title) => {
  const regex = /^\S(?:.*\S)?$/;
  return regex.test(title);
};

//This makes sure the duration is a positive number only
export const validateDuration = (duration) => {
  const regex = /^(0|[1-9]\d*)(\.\d{1,2})?$/;
  return regex.test(duration);
};

// checks that the date follows the YYYY-MM-DD format.
export const validateDate = (dateStr) => {
  const regex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
  return regex.test(dateStr);
};

// checks that the tag contains only letters, single spaces, and hyphens
export const validateTag = (tag) => {
  const regex = /^[A-Za-z]+(?:[ -][A-Za-z]+)*$/;
  return regex.test(tag);
};

// 5. Advanced Regex: Back-reference to catch duplicate consecutive words (case-insensitive)
export const validateNoDuplicateWords = (title) => {
  const regex = /\b(\w+)\s+\1\b/i;
  // Returns true if there are NO duplicate words (for clean titles)
  return !regex.test(title);
};