export type BookStatus = 'DESEADO' | 'COMPRADO' | 'LEYENDO' | 'LEIDO' | 'ABANDONADO';

export interface Book {
  id: number;
  title: string;
  authors: string[];
  isbn: string;
  description: string;
  thumbnail: string;
  status: BookStatus;
  rating: number;
  isLent: boolean;
}
