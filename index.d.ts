import { Compiler } from 'webpack';
declare class IgnoreEmitPlugin {
    private readonly options;
    private readonly DEBUG;
    private readonly ignorePatterns;
    constructor(ignoreRegex?: RegExp | string | Array<RegExp | string>, options?: {
        debug?: boolean;
    });
    private normalizeRegex;
    private checkIgnore;
    apply(compiler: Compiler): void;
}
export { IgnoreEmitPlugin };
export default IgnoreEmitPlugin;
