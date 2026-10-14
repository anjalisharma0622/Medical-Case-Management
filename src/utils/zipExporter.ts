import JSZip from 'jszip';
import { CODEBASE_FILES } from '../data/codebaseFiles';

export async function downloadCodebaseZip(): Promise<void> {
  const zip = new JSZip();

  // Add all codebase files to the ZIP
  CODEBASE_FILES.forEach(file => {
    zip.file(file.path, file.content);
  });

  // Generate the zip blob
  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);

  const link = document.createElement('a');
  link.href = url;
  link.download = 'jajal-medical-case-management-laravel.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
