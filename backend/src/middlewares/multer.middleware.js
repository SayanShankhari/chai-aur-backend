import multer from "multer";
// import path from "node:path";
// import fs from "fs";
import fs from "node:fs";

const storage = multer.diskStorage (
	{
		destination: (_request, _file, callback) => {
			// const upload_path = path.join (__dirname, '..', 'uploads');
			const upload_path = "../../public/temp";
	
			// create the uploads inner directory if it doesn't exist
			// for now keeping inside static directory
			if (!fs.existsSync (upload_path)) {
				fs.mkdirSync (upload_path, { recursive: true });
			}

			callback (null, upload_path);	// null is the error field
		}
		, filename: (_request, file, callback) => {
			// const unique_suffix = Date.now() + '-' + Math.round (Math.random() * 1E9);	// string concatenation
			const unique_suffix = `${Date.now()}-${Math.round (Math.random() * 1E9)}`;	// template literal
			// callback (null, `${file.originalname}-${unique_suffix}`);
			callback (null, `${file.fieldname}-${unique_suffix}`);
		}
	}
);

export const multerMiddleware = {
	upload: multer ( { storage } )
};