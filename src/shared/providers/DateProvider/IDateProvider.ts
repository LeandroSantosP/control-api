export interface formatParams {
   date: Date | number;
   format: string;
   options?: {
      locale?: Locale;
      weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
      firstWeekContainsDate?: number;
      useAdditionalWeekYearTokens?: boolean;
      useAdditionalDayOfYearTokens?: boolean;
   };
}

export abstract class IDateProvider {
   abstract now: Date;
   abstract format(params: formatParams): any;
   abstract formatISO(props: any): string;
   abstract parse(props: any): Date;
   abstract addDays(days: number): Date;
   abstract addHours(hours: number): Date;
}
