import { body } from "express-validator";

export default [
    body('name')
        .exists()
        .withMessage('name is required')
        .isString()
        .withMessage('name should be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('name should be between 3 to 50 characters'),

    body('priceConfigration')
        .exists()
        .withMessage('priceConfigration is required'),

    body('priceConfigration.*.priceType')
        .exists()
        .withMessage('priceType is required')
        .isIn(['base', 'aditional'])
        .withMessage('priceType should be base or aditional'),

    body('priceConfigration.*.availableOptions')
        .exists()
        .withMessage('availableOptions is required')
        .isArray({ min: 1 })
        .withMessage('availableOptions should be an array with at least one element'),

    body('attributes')
        .exists()
        .withMessage('attributes is required'),

    body('attributes.*.name')
        .exists()
        .withMessage('name is required')
        .isString()
        .withMessage('name should be a string')
        .isLength({ min: 3, max: 50 })
        .withMessage('name should be between 3 to 50 characters'),

    body('attributes.*.widgetType')
        .exists()
        .withMessage('widgetType is required')
        .isIn(['radio', 'switch'])
        .withMessage('widgetType should be radio or switch'),

    body('attributes.*.defaultValue')
        .exists()
        .withMessage('defaultValue is required')
        .isString()
        .withMessage('defaultValue should be a string'),

    body('attributes.*.availableOptions')
        .exists()
        .withMessage('availableOptions is required')
        .isArray({ min: 1 })
        .withMessage('availableOptions should be an array with at least one element')
]