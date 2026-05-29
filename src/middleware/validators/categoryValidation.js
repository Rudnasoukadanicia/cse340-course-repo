import { body } from 'express-validator';

const categoryValidation = [
    body('name')
        .notEmpty().withMessage('Name required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Must be between 3 and 100 characters')
];

export { categoryValidation };