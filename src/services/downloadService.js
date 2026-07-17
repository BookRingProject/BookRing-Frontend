export const downloadFile = async (url, filename) => {
  try {
    console.log(`Downloading: ${filename} from ${url}`);
    const isCloudinaryUrl = url.includes('cloudinary.com');

    // --- Cloudinary Download Logic ---
    if (isCloudinaryUrl) {
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Cache-Control': 'no-cache' },
        });
        

        // --- THIS IS IMPORTANT: Check if Cloudinary blocked the file ---
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            const errorData = await response.json();
            // Check for the specific "untrusted" error message
            if (errorData?.error?.message?.includes("untrusted")) {
              throw new Error(
                "PDF delivery is blocked by Cloudinary. Please go to your Cloudinary Dashboard -> Settings -> Security -> and enable 'Allow delivery of PDF and ZIP files'."
              );
            }
          }
          // If it's a different error, throw a generic message
          throw new Error(`Download failed: ${response.statusText}`);
        }

        // --- If the response is successful, create the download ---
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
        console.log(`✅ Downloaded with filename: ${filename}`);
        return true;

      } catch (cloudinaryError) {
        console.error('Cloudinary download failed:', cloudinaryError);
        // Show the specific error message to the user
        alert(cloudinaryError.message);
        throw cloudinaryError;
      }
    }

    // --- Standard Download Logic (for non-Cloudinary URLs) ---
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Cache-Control': 'no-cache' },
    });
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);

    const blob = await response.blob();
    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
    return true;

  } catch (error) {
    console.error('Download error:', error);
    // Check if the error message is already user-friendly, otherwise show a generic one
    if (!error.message.includes("PDF delivery is blocked")) {
       alert('Failed to download file. Please try again.');
    }
    return false;
  }
};

// Helper for generating filenames
export const generateFilename = (title, extension) => {
  if (!title) return `download.${extension}`;
  const cleanTitle = title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .substring(0, 100)
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${cleanTitle || 'download'}.${extension}`;
};

// 
export const generateImageFilename = (title) => {
  // Determine extension from URL or default to jpg
  return generateFilename(title, 'jpg');
};

export const generatePdfFilename = (title) => generateFilename(title, 'pdf');
export const generateAudioFilename = (title) => generateFilename(title, 'mp3');
