export const photofilter = (
  req: Express.Request,
  photo: Express.Multer.File,
  callback: Function,
) => {
  if (!photo) return callback(new Error('Photo is empty'), false);
  const photoExtension = photo.mimetype.split('/')[1];
  const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];

  if (validExtensions.includes(photoExtension)) {
    return callback(null, true);
  }

  callback(null, false);
};
