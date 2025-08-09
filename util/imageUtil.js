import { Jimp } from "jimp";

async function validatePfp(b64) {
    if (typeof b64 !== 'string') return false;

    const regex = /^data:image\/(png|jpeg|jpg);base64,/;
    if (!regex.test(b64)) return false;

    const buffer = Buffer.from(b64, 'base64');

    return await Jimp.read(buffer).then(function (img) {
        return img.bitmap.width > 0 && img.bitmap.height > 0 && img.bitmap.width <= process.env.MAX_PFP_SIZE && img.bitmap.height <= process.env.MAX_PFP_SIZE;
    }).catch(_ => false);
}

export default validatePfp;
