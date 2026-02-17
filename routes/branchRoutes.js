import express from 'express';
const router = express.Router();
import * as branchController from '../controllers/branchController.js';

// Get all branches
router.get('/', branchController.getAllBranches);

// Get single branch by ID
router.get('/:id', branchController.getBranchById);

// Create new branch
router.post('/', branchController.createBranch);

// Update branch
router.put('/:id', branchController.updateBranch);

// Delete branch
router.delete('/:id', branchController.deleteBranch);

export default router;
