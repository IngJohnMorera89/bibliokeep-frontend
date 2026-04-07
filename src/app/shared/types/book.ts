export interface Book {
  id: number;
  title: string;
  authors: string[];
  isbn: string;
  description: string;
  thumbnail: string;
  status: 'DESEADO' | 'COMPRADO' | 'LEYENDO' | 'LEIDO' | 'ABANDONADO';
  rating: number;
  isLent: boolean;
}
