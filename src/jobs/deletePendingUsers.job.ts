import cron from 'node-cron';
import { User } from '../app/modules/User/user.model';
import { USER_STATUS } from '../app/modules/User/user.constant';


export const startDeletePendingUsersJob = () => {
// '*/5 * * * *'
  cron.schedule('*/5 * * * *', async () => {
  try {
    //  const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); 
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const usersToDelete = await User.find({
      status: USER_STATUS.PENDING,
      createdAt: { $lt: fiveMinutesAgo },
    });

    console.log(`[CRON] Found ${usersToDelete.length} pending users to delete`);

    if (usersToDelete.length > 0) {
      const result = await User.deleteMany({
        status: USER_STATUS.PENDING,
        createdAt: { $lt: fiveMinutesAgo },
      });

      console.log(`[CRON] Deleted ${result.deletedCount} users.`);
    } else {
      console.log('[CRON] No users to delete.');
    }
  } catch (error) {
    console.error('[CRON] ❌ Error deleting pending users:', error);
  }
});


  console.log('[CRON] 🔁 DeletePendingUsersJob scheduled to run every hour.');
};
