/**
 * COMPONENTES ACTUALIZADOS - Guía de Uso
 * 
 * Todos los componentes ahora conectan con el backend mediante peticiones HTTP reales.
 * Loading states y error handling están completamente implementados.
 */

// ============================================================
// 1. LIBRARY PAGE COMPONENT
// ============================================================

/**
 * Responsabilidades:
 * - Mostrar lista de libros del usuario
 * - Crear nuevo libro
 * - Filtrar libros localmente
 * 
 * Signals expuestos:
 * - books: signal<Book[]>          Libros del usuario
 * - isLoading: signal<boolean>     Estado de carga
 * - error: signal<string | null>   Mensaje de error
 */

// En template:
// @if (isLoading()) {
//   <div class="animate-pulse">Cargando libros...</div>
// }
// @if (error()) {
//   <div class="bg-red-100 p-4">{{ error() }}</div>
// }
// @for (book of books(); track book.id) {
//   <app-book-card [book]="book" />
// }

// Crear libro:
const createBookRequest = {
  title: 'Mi Libro',
  authors: ['Autor 1', 'Autor 2'],
  isbn: '978-3-16-148410-0',
  status: 'DESEADO',
  rating: 5,
  description: 'Descripción opcional',
  thumbnail: 'https://...'
};
await this.bookStore.createBook(createBookRequest);

// ============================================================
// 2. BOOK SEARCH PAGE COMPONENT
// ============================================================

/**
 * Responsabilidades:
 * - Buscar libros (híbrida: local -> cache -> external)
 * - Mostrar resultados de búsqueda
 * 
 * Signals expuestos:
 * - results: signal<Book[]>        Resultados de búsqueda
 * - isLoading: signal<boolean>     Estado de búsqueda
 * - error: signal<string | null>   Error de búsqueda
 */

// En template:
// <form [formGroup]="searchForm" (ngSubmit)="onSearch()">
//   <input formControlName="query" />
//   <button type="submit">Buscar</button>
// </form>

// @if (isLoading()) {
//   <div>Buscando...</div>
// }
// @if (error()) {
//   <div>{{ error() }}</div>
// }
// @for (book of results(); track book.id) {
//   <app-book-card [book]="book" />
// }

// ============================================================
// 3. LOANS PAGE COMPONENT
// ============================================================

/**
 * Responsabilidades:
 * - Mostrar préstamos activos
 * - Crear nuevo préstamo
 * - Marcar préstamo como devuelto
 * 
 * Signals expuestos:
 * - loans: signal<Loan[]>          Préstamos del usuario
 * - books: signal<Book[]>          Libros disponibles
 * - isLoading: signal<boolean>     Estado de carga
 * - error: signal<string | null>   Mensaje de error
 */

// Crear préstamo:
const createLoanRequest = {
  bookId: 1,
  contactName: 'Juan Pérez',
  loanDate: '2026-04-13',
  dueDate: '2026-05-13'
};
await this.loanService.createLoan(createLoanRequest);

// Devolver préstamo:
await this.loanService.returnLoan(loanId);

// ============================================================
// 4. DASHBOARD PAGE COMPONENT
// ============================================================

/**
 * Responsabilidades:
 * - Mostrar estadísticas de lectura
 * - Calcular métricas (libros leídos, meta, etc)
 * 
 * Signals expuestos:
 * - metrics: DashboardMetrics     Estadísticas computadas
 * - isLoading: signal<boolean>    Estado de carga
 * - error: signal<string | null>  Error de carga
 */

// En template:
// @for (metric of metrics(); track metric) {
//   <app-stats-widget [metric]="metric" />
// }

// ============================================================
// FLUJO DE DATOS
// ============================================================

/**
 * Usuario abre Library Page
 *   ↓
 * ngOnInit() → await bookStore.fetchAllBooks()
 *   ↓
 * Service: await http.get('/api/books')
 *   ↓
 * Backend valida JWT + retorna libros
 *   ↓
 * Signal 'books' se actualiza automáticamente
 *   ↓
 * Componentes reactivos (OnPush) se redibujam
 *
 * Si hay error:
 *   Signal 'error' se establece
 *   Template muestra el error
 */

// ============================================================
// MANEJO DE ERRORES
// ============================================================

/**
 * Todos los servicios implementan:
 * 
 * try {
 *   setLoading(true);
 *   clearError();
 *   -> HTTP request
 *   -> Success: update signal
 * } catch (error) {
 *   setError(message);
 *   throw error;
 * } finally {
 *   setLoading(false);
 * }
 * 
 * El componente puede suscribirse a cambios:
 * readonly error = this.service.error;
 */

// ============================================================
// CÓMO ACTUALIZAR LA UI CUANDO SE CREA UN RECURSO
// ============================================================

/**
 * El servicio automáticamente actualiza el store:
 * 
 * async createBook(request: CreateBookRequest): Promise<Book> {
 *   try {
 *     const book = await http.post('/api/books', request);
 *     addBook(book);  // ← Signal se actualiza aquí
 *     return book;
 *   }
 * }
 * 
 * El componente simplemente espera el promise:
 * 
 * async addBook() {
 *   await this.bookStore.createBook(request);
 *   this.bookForm.reset();  // Limpiar form
 *   // Signal 'books' ya se actualizó automáticamente
 * }
 */
