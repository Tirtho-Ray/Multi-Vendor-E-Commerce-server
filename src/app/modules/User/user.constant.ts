export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER',
  VENDOR: 'VENDOR',
} as const;

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  BLOCKED: 'BLOCKED',
} as const;

export const UserSearchableFields = [
  'name',
  'email',
  'phone',
  'role',
  'status',
];
