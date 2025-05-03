export const USER_ROLE = {
  SUPER_ADMIN:"SUPER_ADMIN",
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
