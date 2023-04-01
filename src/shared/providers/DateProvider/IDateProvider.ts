export abstract class IDateProvider {
   abstract formatISO(props: any): string;
   abstract parse(props: any): Date;
}
