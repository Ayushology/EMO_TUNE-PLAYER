const ImageKit = require("imagekit");

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

function uploadFile(file){
    return new Promise((resolve, reject) => {

        if (!file) {
            return reject(new Error("No file provided"));
        }

        // ! convert buffer → base64
        const base64File = file.buffer.toString("base64");

        imagekit.upload({
            file: base64File,
            // ! this is done to put the exact date and time so that no overwritting happens
            fileName: Date.now() + "_" + file.originalname, // unique name each time with this
            // * remember no spaces should be there in the folder name as the imagekit doesnt allows spaces
            folder: "MoodyPlayerProject"
        }, (error, result) => {

            if (error) {
                reject(error);
            } else {
                resolve(result.url); // only return URL
            }

        });
    });
}

module.exports = uploadFile;