export interface CreateLoanRequest {
  bookId: number;
  contactName: string;
  loanDate: string; // ISO format: YYYY-MM-DD
  dueDate: string;  // ISO format: YYYY-MM-DD
}
