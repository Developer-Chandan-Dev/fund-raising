// src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import User from '../models/User';

// export const getDashboardData = async (req: Request, res: Response) => {
//     try {
//         if (!req.user) {
//             return res.status(401).json({ message: 'Not authenticated' });
//         }

//         const userId = req.user._id;

//         // Get all data in parallel
//         const [activeCampaigns, userContributions, completedTasks] = await Promise.all([
//             // Active campaigns (limit 3)
//             Campaign.find({
//                 status: 'active',
//                 creator: userId
//             })
//                 .limit(3)
//                 .sort({ createdAt: -1 })
//                 .select('title imageUrl raisedAmount goalAmount'),

//             // User contributions (sum of donations)
//             Donation.aggregate([
//                 {
//                     $match: {
//                         donor: userId,
//                         paymentStatus: 'completed'
//                     }
//                 },
//                 {
//                     $group: {
//                         _id: null,
//                         totalAmount: { $sum: "$amount" },
//                         count: { $sum: 1 }
//                     }
//                 }
//             ]),

//             // Completed tasks (example - customize based on your task system)
//             Task.countDocuments({
//                 userId,
//                 completed: true
//             })
//         ]);

//         res.json({
//             activeCampaigns,
//             totalContributed: userContributions[0]?.totalAmount || 0,
//             contributionCount: userContributions[0]?.count || 0,
//             completedTasks: completedTasks || 0
//         });

//     } catch (error) {
//         console.error('Dashboard data error:', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

export const cardData = async (req: Request, res: Response) => {
    try {
        const activeCampaigns = await Campaign.countDocuments({ status: "active" });

        const users = await User.find({}, { contributions: 1 }).lean(); // lean for plain objects
        const contributions = users.map(u => ({
            id: u._id.toString(),
            contributions: u.contributions ?? 0, // guard in case it's missing
        }));

        return res.json({success: true, activeCampaigns, contributions: contributions[0].contributions });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success:false });
    }
};
