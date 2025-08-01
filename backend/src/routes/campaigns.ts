import express, { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { auth, admin } from '../middleware/auth';
import Campaign from '../models/Campaign';
import { IUser } from '../models/User';

const router = express.Router();

// Get all active campaigns
router.get('/', async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.find({ isActive: true })
      .populate('createdBy', 'name')
      .exec();
    res.json(campaigns);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Get single campaign
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findById(req.params.id)
      .populate('createdBy', 'name email')
      .exec();
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }

    res.json(campaign);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Create campaign (admin only)
router.post(
  '/',
  [
    auth,
    admin,
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('goalAmount').isFloat({ gt: 0 }).withMessage('Goal amount must be a positive number'),
    body('imageUrl').optional().isURL().withMessage('Invalid URL')
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, goalAmount, imageUrl } = req.body;
    const user = req.user as IUser;

    try {
      const newCampaign = new Campaign({
        title,
        description,
        goalAmount,
        imageUrl,
        createdBy: user._id
      });

      const campaign = await newCampaign.save();
      res.status(201).json(campaign);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  }
);

// Update campaign (admin only)
router.put('/:id', [auth, admin], async (req: Request, res: Response) => {
  // Similar to create but with update logic
});

// Delete campaign (admin only)
router.delete('/:id', [auth, admin], async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    
    res.json({ message: 'Campaign deactivated' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

export default router;