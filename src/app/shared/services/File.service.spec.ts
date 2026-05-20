import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { FileService } from './File.service';
import { environment } from '../../../environments/environment';
import { provideHttpClient } from '@angular/common/http';

describe('FileService', () => {
  let service: FileService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [FileService, provideHttpClient(), provideHttpClientTesting()],
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifica que no haya peticiones pendientes
    httpMock.verify();
  });

  it('debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('upload()', () => {
    it('debe enviar una petición POST con FormData', () => {
      const mockResponse = { url: 'http://bucket.com/image.webp' };
      const mockFile = new File([''], 'test-image.png', { type: 'image/png' });

      service.upload(mockFile).subscribe((response) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(
        `${environment.backendUrl.replace(/\/$/, '')}/api/file/upload`,
      );
      expect(req.request.method).toBe('POST');
      expect(req.request.body instanceof FormData).toBe(true);
      expect(req.request.body.get('file')).toBeTruthy();

      req.flush(mockResponse);
    });
  });

  describe('optimizeImage()', () => {
    it('debe redimensionar y convertir la imagen a WebP', async () => {
      // Creamos un Blob que simule una imagen (pequeño pixel rojo 1x1 base64)
      const base64Image =
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
      const response = await fetch(base64Image);
      const blob = await response.blob();
      const file = new File([blob], 'test.png', { type: 'image/png' });

      const optimizedBlob = await service.optimizeImage(file, 100);

      expect(optimizedBlob).toBeTruthy();
      expect(optimizedBlob.type).toBe('image/webp');
      expect(optimizedBlob instanceof Blob).toBe(true);
    });

    it('debe fallar si el archivo no es una imagen válida', async () => {
      const invalidFile = new File(['contenido basura'], 'test.txt', { type: 'text/plain' });

      try {
        await service.optimizeImage(invalidFile);
        fail('Debería haber lanzado un error');
      } catch (error: any) {
        expect(error.message).toContain('Error al cargar la imagen');
      }
    });
  });
});

function fail(arg0: string) {
  throw new Error('Function not implemented.');
}
