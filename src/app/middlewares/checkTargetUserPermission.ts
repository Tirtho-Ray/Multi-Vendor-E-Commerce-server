/* eslint-disable no-unused-vars */
// middlewares/checkTargetUserPermission.ts
import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';


//  	Can Update Own	 |    Can Delete Own  |    Can Update Others	 |  Can Delete Others
// USER	    ✅	                    ✅	              ❌	                    ❌
// VENDOR	✅	                    ✅	              ❌                     ❌
// ADMIN	✅	                    ❌	              ✅ (USER + VENDOR)	    ✅ (USER + VENDOR)
// SUPER_ADMIN	✅	                ❌	              ✅ (All)	            ✅ (All, except own self)


const roleHierarchy: Record<string, number> = {
  [USER_ROLE.USER]: 1,
  [USER_ROLE.VENDOR]: 2,
  [USER_ROLE.ADMIN]: 3,
  [USER_ROLE.SUPER_ADMIN]: 4,
};

export const checkTargetUserPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const targetUserId = req.params.id;
    const requester = req.user;
    const requesterRole = requester.role;
    const requesterId = requester.userId;

    // Only Work his won work
    if (targetUserId === requesterId) {
      // "But a user cannot delete their own account if they are a SUPER_ADMIN."
      if (req.method === 'DELETE' && requesterRole === USER_ROLE.SUPER_ADMIN) {
        return res.status(httpStatus.FORBIDDEN).json({
          success: false,
          message: 'Super admin cannot delete their own account.',
        });
      }
      return next();
    }

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(httpStatus.NOT_FOUND).json({
        success: false,
        message: 'Target user not found',
      });
    }

    const targetRole = targetUser.role;
    const requesterLevel = roleHierarchy[requesterRole];
    const targetLevel = roleHierarchy[targetRole];

    // ✅ cheak requester to level target if big
    if (requesterLevel <= targetLevel) {
      return res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: 'You do not have permission to modify this user.',
      });
    }

    next();
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: 'Permission check failed.',
    });
  }
};
