// routes/user.route.ts
import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { checkTargetUserPermission } from '../../middlewares/checkTargetUserPermission';

const router = express.Router();

// Create Admin
router.post(
  '/create-admin',
  auth(USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);

//  (ADMIN & SUPER_ADMIN)
router.get(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  UserControllers.getAllUsers
);

// Get single user
router.get(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  checkTargetUserPermission,
  UserControllers.getSingleUser
);

// Soft delete 
router.patch(
  '/soft-delete/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  checkTargetUserPermission,
  UserControllers.softDeleteUser
);

// Hard delete 
router.delete(
  '/hard-delete/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  checkTargetUserPermission,
  UserControllers.hardDeleteUser
);



export const UserRoutes = router;
