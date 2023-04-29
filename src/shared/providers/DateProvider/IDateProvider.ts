export abstract class IDateProvider {
   abstract formatISO(props: any): string;
   abstract parse(props: any): Date;
   abstract addDays(days: number): Date;
   abstract addHours(hours: number): Date;
}
