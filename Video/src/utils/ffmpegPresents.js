export const trimVideo = (input, startTime, endTime) => `
  ffmpeg -i ${input} -ss ${startTime} -to ${endTime} -c copy output.mp4
`;

export const muteVideo = (input) => `
  ffmpeg -i ${input} -an output.mp4
`;

export const overlayText = (input, text) => `
  ffmpeg -i ${input} -vf "drawtext=text='${text}':fontcolor=white:fontsize=24:x=10:y=10" -codec:a copy output.mp4
`;

export const generateThumbnail = (input) => `
  ffmpeg -i ${input} -ss 00:00:01.000 -vframes 1 thumbnail.jpg
`;

