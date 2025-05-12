// routes/user.route.ts
import express from 'express';
import { UserControllers } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { UserValidation } from './user.validation';
import { checkTargetUserPermission } from '../../middlewares/checkTargetUserPermission';

const router = express.Router();

// Create Admin //ok api test
router.post(
  '/create-admin',
  auth(USER_ROLE.SUPER_ADMIN),
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.userRegister
);

//  (ADMIN & SUPER_ADMIN) , here not work api gard
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

// Update user role  =====>> issue in Cheak i use here eamil not id so come issu .. i fix this latter  
router.patch('/user-role/:email',
   auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), 
   validateRequest(UserValidation.updateUserRoleZodSchema), 
   checkTargetUserPermission,
   UserControllers.updateUserRole
);

router.patch(
  '/update-me', 
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.VENDOR, USER_ROLE.SUPER_ADMIN),  
  // validateRequest(UserValidation.updateUserProfileSchema), 
  UserControllers.updateMe  
);



export const UserRoutes = router;
