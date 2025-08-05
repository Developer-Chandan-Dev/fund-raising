// src/controllers/dashboardController.ts
import { Request, Response } from 'express';
import Campaign from '../models/Campaign';
import User from '../models/User';

export const cardData = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "Not authorized", success: false });
        }

        const activeCampaigns = await Campaign.countDocuments({ status: "active" });

        const users = await User.find({}, { contributions: 1 }).lean();

        // Convert to proper contribution objects
        const contributions = users.map(u => ({
            id: u._id.toString(),
            contributions: u.contributions ?? 0,
        }));

        // Find current user's contributions
        const userContribution = contributions.find(c => c.id === req.user?._id.toString());

        return res.json({
            success: true,
            activeCampaigns,
            contributions: userContribution?.contributions ?? 0, // fallback to 0
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error", success: false });
    }
};
