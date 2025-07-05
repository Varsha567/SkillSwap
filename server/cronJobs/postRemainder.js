const cron = require('node-cron');
const Post = require('../models/PostS');
const { sendEmail } = require('../utils/emailService');
const User = require('../models/User'); 

const setupPostReminderCron = () => {
    // --- TEMPORARY TEST SETTINGS ---
    // Schedule: Runs every minute for testing purposes
    // IMPORTANT: Change this back to '0 3 * * *' for production!
    cron.schedule('0 3 * * *', async () => { 
        console.log('--- Running Post Status Reminder Check (TEST MODE - Every Minute) ---');
        const now = new Date();
        
        // Define reminder intervals in days
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000); 
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); 

        try {
            const postsToRemind = await Post.find({
                status: 'active', 
                lastStatusUpdate: { $lte: threeDaysAgo }, 
                $or: [
                    { lastReminderSentAt: { $exists: false }, reminderCount: 0 }, 
                    {
                        reminderCount: { $lt: 3 }, 
                        lastReminderSentAt: { $lte: sevenDaysAgo } 
                    }
                ]
            }).populate('userId', 'email username preferences'); 

            console.log(`Found ${postsToRemind.length} posts requiring reminders.`);

            if (postsToRemind.length === 0) {
                console.log('No posts met the reminder criteria.');
            }

            for (const post of postsToRemind) {
                if (post.userId && post.userId.email && post.userId.preferences && post.userId.preferences.receiveEmailReminders !== false) {
                    console.log(`Attempting to send reminder for post: "${post.title}" by ${post.userId.email}`);
                    const subject = 'Action Required: Update Your SkillSwap Post Status!';
                    const htmlContent = `
                        <p>Hi ${post.userId.username || post.userId.email},</p>
                        <p>It looks like your post titled "<strong>${post.title}</strong>" is still marked as 'active' on SkillSwap.</p>
                        <p>If the skill exchange has progressed or completed, please remember to update its status:</p>
                        <p><a href="${process.env.FRONTEND_URL}/my-profile">Go to My Profile (where your posts are listed)</a></p>
                        <p>Keeping your post status current helps other users find active opportunities and improves the community experience.</p>
                        <p>Thanks,</p>
                        <p>The SkillSwap Team</p>
                    `;

                    // FIX IS HERE: Pass an object to sendEmail
                    const emailSent = await sendEmail({
                        email: post.userId.email,
                        subject: subject,
                        html: htmlContent
                    });

                    if (emailSent) {
                        post.reminderCount = (post.reminderCount || 0) + 1;
                        post.lastReminderSentAt = new Date();
                        await post.save();
                        console.log(`Reminder sent and post updated for: ${post.title} (${post._id}). New reminderCount: ${post.reminderCount}`);
                    } else {
                        console.error(`Failed to send email for post: ${post._id}. Check email service.`);
                    }
                } else {
                    console.log(`Skipping reminder for post ${post._id}: User data incomplete or opted out. User ID: ${post.userId?._id}, Email: ${post.userId?.email}, Preferences: ${post.userId?.preferences?.receiveEmailReminders}`);
                }
            }
            console.log('--- Finished post status reminder check. ---');
        } catch (error) {
            console.error('Error in post status reminder cron job:', error);
        }
    });
};

module.exports = setupPostReminderCron;
