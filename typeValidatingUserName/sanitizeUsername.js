import { en, no } from "naughty-words";
const allBadWords = en.concat(no);
export const checkUsername = (username) => {
    let isUsernameBad = false;
    const normalizedUsername = username.toLowerCase();
    allBadWords.forEach((badWord) => {
        if (normalizedUsername.includes(badWord)) {
            isUsernameBad = true;
        }
    });
    return isUsernameBad;
};
