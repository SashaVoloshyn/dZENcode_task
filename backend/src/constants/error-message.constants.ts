export const errorMessageConstants = {
    userAlreadyExists: 'Користувач вже існує.',
    userNotFound: 'Користувача не знайдено. Зареєструйтесь, будь ласка.',
    unauthorized: 'Невірний email або пароль.',
    unknown: 'Невідома помилка',
    clientKey: 'Невірні данні, clientKey',
    userNotRegistration: 'ПОМИЛКА СЕРВЕРА: НЕ ВДАЛОСЯ ЗАПИСАТИ КОРИСТУВАЧА',
    authorization: 'Немає авторизованих данних',
    fileMimetype: 'Невірний формат файлу',
    fileSize: 'Розмір файла не валідний',
    badRequest: 'Погані данні',
    notFound: 'Не знайдено.',
};

export const errorValidationMessageConst = {
    'string.empty': 'Поле не може бути пустим',
    'string.base': 'Поле повинно бути текстом',
    'string.min': 'Довжина поля повинна бути не менше {#limit} символів',
    'string.max': 'Довжина поля повинна бути не більше {#limit} символів',
    'any.required': "Поле є обов'язковим",
    'number.base': ' Поле має бути числом',
    'number.empty': 'Поле не може бути пустим',
    'number.min': 'мінімальне число {#limit}',
    'number.max': 'мінімальне число {#limit}',
};
