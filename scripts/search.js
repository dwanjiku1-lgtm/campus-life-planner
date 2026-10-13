//search.js

export function compileRegex(input, flags = 'i'){
    try{
        return input ? new RegExp(input, flags) : null;
    }catch (error) {
        return null;
    }
}

export function highlight(text, re) {
    if (!re) return text;
    try{
        return String(text).replace(re, (match) => `<mark>${match}</mark>`);
    }catch (error) {
        return text;
    }
}