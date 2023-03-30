export const getCookie = (cookieName) => {
    const cookieValue = document.cookie.match('(^|;)\\s*' + cookieName + '\\s*=\\s*([^;]+)');
    console.log(cookieValue);
    return cookieValue ? cookieValue.pop() : '';
}