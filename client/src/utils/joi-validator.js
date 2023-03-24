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
    email: joiCommonValidator.email.required().trim(),
    password: joiCommonValidator.password.required().trim().messages(errorValidationMessageConst)
});

export const MainCommentCreateValidator=Joi.object({
    text:joiCommonValidator.text.required().trim().messages(errorValidationMessageConst),
    pageUrl: joiCommonValidator.pageUrl.messages(errorValidationMessageConst),
    fileImg: Joi.optional().messages(errorValidationMessageConst),
    fileText: Joi.optional().messages(errorValidationMessageConst)

});

export const CommentCreateValidator=Joi.object({
    text:joiCommonValidator.text.required().trim().messages(errorValidationMessageConst),
    fileImg: Joi.optional().messages(errorValidationMessageConst),
    fileText: Joi.optional().messages(errorValidationMessageConst)
})

