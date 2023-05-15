export abstract class Model<I, O> {
   constructor() {}

   abstract create(props: I): Promise<O>;
   abstract updated(props: I): Promise<O>;
   abstract list(props: I): Promise<O[]>;
   abstract delete(props: I): Promise<O>;
}
