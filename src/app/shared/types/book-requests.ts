export type BookStatus = 'DESEADO' | 'COMPRADO' | 'LEYENDO' | 'LEIDO' | 'ABANDONADO';

export interface CreateBookRequest {
  isbn: string;
  title: string;
  authors: string[];
  description?: string;
  thumbnail?: string;
  status?: BookStatus;
  rating?: number;
}

export interface UpdateBookStatusRequest {
  status: BookStatus;
}
