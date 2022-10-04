const { VideoResizer, FileSize } = require("../");
const path = require("path");

const videoResizer = new VideoResizer(path.resolve("./resources/output"));

(async () => {
    const inputFilePath = path.resolve(path.resolve("./resources/video01.mp4"));
    const metaData = await videoResizer.readMetaData(inputFilePath);
    console.log(metaData);
    const outputFilePath = await videoResizer.reduceVideoResolution(inputFilePath, FileSize.P320);
    console.log(outputFilePath);
})();