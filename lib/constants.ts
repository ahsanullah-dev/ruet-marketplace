// Change this to your real university email domain.
// e.g. "student.ruet.ac.bd" or whatever RUET actually issues.
export const ALLOWED_EMAIL_DOMAIN = 'student.ruet.ac.bd';

export function isAllowedEmail(email: string) {
  return email.toLowerCase().trim().endsWith('@' + ALLOWED_EMAIL_DOMAIN);
}

export const CATEGORIES = [
  'Books',
  'Electronics',
  'Lab Equipment',
  'Calculators',
  'Cycles',
  'Furniture',
  'Hostel Essentials',
  'Rentals',
  'Services',
];

export const PICKUP_LOCATIONS = [
  'Department Entrance',
  'Central Library',
  'Cafeteria',
  'Academic Building 1',
  'Academic Building 2',
  'Academic Building 3',
  'Hall Gate',
];
