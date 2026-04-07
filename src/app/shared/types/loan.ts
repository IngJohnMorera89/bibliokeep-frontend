export interface Loan {
  id: number;
  bookId: number;
  contactName: string;
  loanDate: string;
  dueDate: string;
  returned: boolean;
}
