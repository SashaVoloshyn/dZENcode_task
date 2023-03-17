export const regexConstant = {
    USERNAME: /^[a-zA-Z0-9]+$/,
    PASSWORD: /^[a-zA-Z0-9]+$/,
    EMAIL: /^.+@[^@]+\.[^@]{2,}$/,
    TEXT:/<([a-zA-Zа-яА-ЯёЁ]+)[^>]*>(.*?)<\/\1>|<(i|strong|code)[^>]*>(.*?)<\/\3>|<a[^>]*href\s*=\s*"[^"]*"[^>]*>(.*?)<\/a>|<(i|strong|code|a)[^>]*\/?>/gui
};