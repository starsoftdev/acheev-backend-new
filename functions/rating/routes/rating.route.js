import express from 'express';

import RatingController from '../controllers/rating.controller';

// Assemble routing
const router = express.Router();

router.get('/', RatingController.list);
router.post('/', RatingController.create);
router.put('/:id', RatingController.update);
router.delete('/:id', RatingController.destroy);

export default router;
