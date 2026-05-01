// src/utils/cloudinary.js

export const getPdfThumbnail = (pdfUrl, width = 300, height = 400) => {
  if (!pdfUrl) return '/images/default-cover.png';
  
  // Cloudinary transformations to convert PDF first page to image
  // pg_1 = page 1, fl_pgif = generate image from PDF page
  return pdfUrl.replace(
    '/upload/',
    `/upload/w_${width},h_${height},c_fill,pg_1,fl_pgif/`
  );
};

export const getPdfPreview = (pdfUrl, page = 1) => {
  if (!pdfUrl) return '/images/default-cover.png';
  
  return pdfUrl.replace(
    '/upload/',
    `/upload/pg_${page},fl_pgif/`
  );
};