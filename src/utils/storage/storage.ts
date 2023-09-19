import { extname } from 'path';
import { diskStorage, StorageEngine } from 'multer';

// Settings Storage Static Files
export const storage: StorageEngine = diskStorage({
  destination: 'storage/photos',
  filename: (req, file, cb) => {
    const name = file.originalname.split('.')[0];
    const extension = extname(file.originalname);
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${name}-${randomName}${extension}`);
  },
});
