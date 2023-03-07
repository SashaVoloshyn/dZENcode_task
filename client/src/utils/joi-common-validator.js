import Joi from "joi";

import {regexConstant} from "../constants";


export const joiCommonValidator = {
    email: Joi.string().min(5).max(40).trim().regex(regexConstant.EMAIL).messages({
        'string.empty': 'Поле не може бути пустим',
        'string.pattern.base': 'Поле повинно мати в собі "@", "." та латинські букви ',
        'string.min': 'Довжина поля повинна бути не меньше {#limit} символів',
        'string.max': 'Довжина поля повинна бути не більше {#limit} символів',
        'any.required': "Поле є обов'язковим",
    }),
    password: Joi.string().regex(regexConstant.PASSWORD).min(7).max(30).trim(),
    userName: Joi.string().regex(regexConstant.USERNAME).min(3).max(20).trim(),
    pageUrl: Joi.string().allow('', null).uri().trim(),
};
