import Joi from 'joi';
import { regexConstant } from '../constants';

export const joiCommonValidator = {
    email: Joi.string().email().regex(regexConstant.EMAIL).min(5).max(40).lowercase().trim(),
    password: Joi.string().regex(regexConstant.PASSWORD).min(7).max(30).trim(),
    userName: Joi.string().regex(regexConstant.USERNAME).min(3).max(20).trim(),
    token: Joi.string().min(10),
    clientKey: Joi.string(),
    pageUrl: Joi.string().allow('', null).uri().trim(),
};
