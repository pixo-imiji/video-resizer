const ffmpeg = require('fluent-ffmpeg');
const uuid = require("uuid4");

const FileSize = {
  P1080: "1080x?",
  P720: "720x?",
  P320: "320x?",
  P270: "270x?"
};


class VideoResizer {
    constructor(outputPath) {
        this.outputPath = outputPath + "/";
    }

    async reduceVideoResolution(filePath, fileSize = FileSize.P320) {
        return new Promise((resolve, reject) => {
            const ext = filePath.match(/\.[0-9a-z]+$/i)[0];
            const size = Object.keys(FileSize).find(key => FileSize[key] === fileSize);
            if (!size) {
                throw new Error("Unknown file size: " + fileSize);
            }
            const outputFileName = uuid() + "_" + size.substring(1) + ext;
            const command = ffmpeg()
                .input(filePath)
                .videoCodec('libx264')
                .output(this.outputPath + outputFileName)
                .size(fileSize);
            command.on("end", () => resolve({path: this.outputPath + outputFileName, fileName: outputFileName}));
            command.on("error", reject);
            command.exec();
        });
    }

    async readMetaData(filePath) {
        return new Promise((resolve, reject) => {
            ffmpeg.ffprobe(filePath, (err, metadata) => err ? reject(err) : resolve(metadata && metadata.format ? metadata.format : metadata));
        });
    }
};

module.exports = {
    VideoResizer,
    FileSize
};