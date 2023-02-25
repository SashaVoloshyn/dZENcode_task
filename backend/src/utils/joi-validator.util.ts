import Joi from 'joi';
import { joiCommonValidator } from './joi-common-validator';
import { errorValidationMessageConst } from '../constants';

class JoiValidatorUtil {
    public static userSchema: Joi.ObjectSchema = Joi.object({
        userName: joiCommonValidator.userName.trim().required().messages(errorValidationMessageConst),
        password: joiCommonValidator.password.trim().required().messages(errorValidationMessageConst),
        email: joiCommonValidator.email.trim().required().messages(errorValidationMessageConst),
        avatar: Joi.binary().optional().messages(errorValidationMessageConst),
    });

    public static loginSchema: Joi.ObjectSchema = Joi.object({
        email: joiCommonValidator.email.required().messages(errorValidationMessageConst).trim(),
        password: joiCommonValidator.password.required().messages(errorValidationMessageConst).trim(),
    });

    public static passwordSchema: Joi.ObjectSchema = Joi.object({
        password: joiCommonValidator.password.trim().required().messages(errorValidationMessageConst),
    });

    public static emailSchema: Joi.ObjectSchema = Joi.object({
        email: joiCommonValidator.email.trim().required().messages(errorValidationMessageConst),
    });

    public static clientKeySchema: Joi.ObjectSchema = Joi.object({
        clientKey: joiCommonValidator.clientKey.required().messages(errorValidationMessageConst),
    });

    public static tokenSchema: Joi.ObjectSchema = Joi.object({
        token: joiCommonValidator.token.required().messages(errorValidationMessageConst),
    });

    public static mainCommentsSchema: Joi.ObjectSchema = Joi.object({
        pageUrl: joiCommonValidator.pageUrl.trim().optional().messages(errorValidationMessageConst),
        text: Joi.string().trim().required().messages(errorValidationMessageConst),
        userId: Joi.number().required().messages(errorValidationMessageConst),
        fileText: Joi.binary().optional().messages(errorValidationMessageConst),
        fileImg: Joi.binary().messages(errorValidationMessageConst).optional(),
        clientKey: joiCommonValidator.clientKey.required().messages(errorValidationMessageConst),
    });

    public static commentsSchema: Joi.ObjectSchema = Joi.object({
        text: Joi.string().trim().required().messages(errorValidationMessageConst),
        userId: Joi.number().required().messages(errorValidationMessageConst),
        mainCommentId: Joi.number().required().messages(errorValidationMessageConst),
        fileText: Joi.binary().optional().messages(errorValidationMessageConst),
        fileImg: Joi.binary().messages(errorValidationMessageConst).optional(),
        clientKey: joiCommonValidator.clientKey.required().messages(errorValidationMessageConst),
    });
}

export const {
    userSchema,
    tokenSchema,
    passwordSchema,
    loginSchema,
    clientKeySchema,
    emailSchema,
    mainCommentsSchema,
    commentsSchema,
} = JoiValidatorUtil;
