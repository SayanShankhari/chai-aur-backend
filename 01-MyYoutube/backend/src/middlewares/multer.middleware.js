import multer from 'multer';
import path from "node:path";
import fs from "node:fs";

const storage = multer.diskStorage (
	{
		destination: (_request, file, callback) => {
			// const uploadPath = path.join (__dirname, '..', 'uploads');
			const uploadPath = "../../public/temp";

			// create the uploads inner directory if it doesn't exist
			// for now keeping inside static directory
			// if (!fs.existsSync (uploadPath)) {
			// 	fs.mkdirSync (uploadPath, { recursive: true });
			// }

			callback (null, uploadPath);
		}
		, filename: (_request, file, callback) => {
			// callback (null, Date.now() + '-' + file.originalname);	// string concatenation
			callback (null, `${Date.now()}-${file.originalname}`);	// template literal
		}
	}
);

export const upload = multer ( { storage } );