export class DateService {
  static formatDateString(dateStr: string): Date {
    // Expecting format YYYYMMDD
    if (dateStr.length !== 8) {
      throw new Error('Invalid date format. Expected YYYYMMDD');
    }
    
    const year = parseInt(dateStr.substring(0, 4));
    const month = parseInt(dateStr.substring(4, 6)) - 1; // JS months are 0-based
    const day = parseInt(dateStr.substring(6, 8));
    
    const date = new Date(year, month, day);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    
    return date;
  }

  static toISODate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
} 