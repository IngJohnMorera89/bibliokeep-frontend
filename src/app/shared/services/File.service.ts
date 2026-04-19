import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { UploadResponse } from '../types/Files-response';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class FileService {
  private readonly http = inject(HttpClient);

  // Limpiamos la base para asegurar que no haya barras dobles
  private get baseUrl(): string {
    const root = environment.backendUrl.replace(/\/$/, ''); // Quita barra final si existe
    return `${root}/api/file`;
  }

  upload(file: File | Blob): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);

    // No agregues HttpHeaders manuales aquí, HttpClient lo hace solo para FormData
    return this.http.post<UploadResponse>(`${this.baseUrl}/upload`, formData);
  }

  async optimizeImage(file: File, maxWidth = 800): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Usamos el archivo directamente
      reader.readAsDataURL(file);

      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;

        img.onload = () => {
          // Si la imagen es más pequeña que el maxWidth, usamos su ancho original
          const finalWidth = img.width > maxWidth ? maxWidth : img.width;
          const scale = finalWidth / img.width;

          const canvas = document.createElement('canvas');
          canvas.width = finalWidth;
          canvas.height = img.height * scale;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Error al optimizar imagen'));
            },
            'image/webp',
            0.8,
          );
        };
        img.onerror = () => reject(new Error('Error al cargar la imagen'));
      };
      reader.onerror = () => reject(new Error('Error al leer el archivo'));
    });
  }
}
