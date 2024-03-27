export const photoNamer = (photo: Express.Multer.File, id: string) => {
  const photoExtension = photo.mimetype.split('/')[1];
  return `${id}.${photoExtension}`;
};
