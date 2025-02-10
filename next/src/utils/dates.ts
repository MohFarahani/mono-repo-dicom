export class DateService {
  static formatDateString(dateString: string): Date {
    if (!/^\d{8}$/.test(dateString)) {
      throw new Error('Invalid date format. Expected YYYYMMDD');
    }
  
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    
    const formattedDate = `${year}-${month}-${day}`;
    const date = new Date(formattedDate);
    
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
  
    return date;
    
  }

  static formatDateToMonthDayYear(dateString: string | undefined): string {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  static toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  static isValidDate(date: Date): boolean {
    return date instanceof Date && !isNaN(date.getTime());
  }
}