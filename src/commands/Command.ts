export interface Command<P, R> {
  execute(parameters: P): Promise<R>;
}