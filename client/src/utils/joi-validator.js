import Joi from "joi";

import {joiCommonValidator} from "./joi-common-validator";
import {errorValidationMessageConst} from "../constants";

export const RegistrationValidator = Joi.object({
    userName: joiCommonValidator.userName.required().trim().messages(errorValidationMessageConst),
    email: joiCommonValidator.email.required().trim(),
    password: joiCommonValidator.password.required().trim().messages(errorValidationMessageConst),
    avatar: Joi.optional().messages(errorValidationMessageConst)
});


export const LoginValidator = Joi.object({
    email: joiCommonValidator.email.required().trim().messages(errorValidationMessageConst),
    password: joiCommonValidator.password.required().trim().messages(errorValidationMessageConst)
});

