function buildFFmpegCommand({ input, output, startTime, endTime, mute, overlayText }) {
  let cmd = `ffmpeg -i ${input}`;

  if (startTime !== undefined && endTime !== undefined) {
    cmd += ` -ss ${startTime} -to ${endTime}`;
  }

  if (mute) {
    cmd += ` -an`;
  }

  if (overlayText && overlayText.trim()) {
    cmd += ` -vf "drawtext=text='${overlayText}':fontcolor=white:fontsize=24:x=10:y=10"`;
  }

  cmd += ` -y ${output}`; // -y to overwrite
  return cmd;
}

module.exports = { buildFFmpegCommand };
