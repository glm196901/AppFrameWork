import crypto from 'crypto';

const webKey = '1111111122222222';
const serviceKey = '42980fcm2d3409d!';

export function decodeFromWeb(data) {
    const iv = '';
    const clearEncoding = 'utf8';
    const cipherEncoding = 'hex';
    const cipher = crypto.createDecipheriv('aes-128-ecb', webKey, iv);
    const chunks = [];
    cipher.setAutoPadding(true);
    chunks.push(cipher.update(data, cipherEncoding, clearEncoding));
    chunks.push(cipher.final(clearEncoding));
    return chunks.join('');
}

export function decodeFromService(data) {
    const iv = '';
    const clearEncoding = 'utf8';
    const cipherEncoding = 'base64';
    const cipher = crypto.createDecipheriv('aes-128-ecb', serviceKey, iv);
    const chunks = [];
    cipher.setAutoPadding(true);
    chunks.push(cipher.update(data, cipherEncoding, clearEncoding));
    chunks.push(cipher.final(clearEncoding));
    return chunks.join('');
}

export function encodeForWeb(data) {
    const iv = "";
    const clearEncoding = 'utf8';
    const cipherEncoding = 'hex';
    const cipherChunks = [];
    const cipher = crypto.createCipheriv('aes-128-ecb', webKey, iv);
    cipher.setAutoPadding(true);

    cipherChunks.push(cipher.update(data, clearEncoding, cipherEncoding));
    cipherChunks.push(cipher.final(cipherEncoding));

    return cipherChunks.join('');
}