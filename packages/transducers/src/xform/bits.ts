import { Reducer, Transducer } from "../api";
import { compR } from "../func/compr";
import { $iter, iterator } from "../iterator";
import { isReduced } from "../reduced";

/**
 * Transforms incoming numbers into their bitstream using specified
 * word size (default 8) and order (MSB first or LSB first). Only the
 * lowest `wordSize` bits of each value are used (max 32).
 *
 * ```
 * [...bits(8, [0xf0, 0xaa])]
 * // [ 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0 ]
 * [...iterator(comp(bits(8), partition(4)), [0xf0, 0xaa])]
 * // [ [ 1, 1, 1, 1 ], [ 0, 0, 0, 0 ], [ 1, 0, 1, 0 ], [ 1, 0, 1, 0 ] ]
 * ```
 *
 * @param wordSize
 * @param msbFirst
 */
export function bits(size?: number, msb?: boolean): Transducer<number, number>;
export function bits(src: Iterable<number>): IterableIterator<number>;
export function bits(size: number, src: Iterable<number>): IterableIterator<number>;
export function bits(size: number, msb: boolean, src: Iterable<number>): IterableIterator<number>;
export function bits(...args: any[]): any {
    return $iter(bits, args, iterator) ||
        ((rfn: Reducer<any, number>) => {
            const reduce = rfn[2];
            const size = (args[0] || 8) - 1;
            const msb = args[1] !== false;
            return compR(rfn,
                msb ?
                    (acc, x: number) => {
                        for (let i = size; i >= 0 && !isReduced(acc); i--) {
                            acc = reduce(acc, (x >>> i) & 1);
                        }
                        return acc;
                    } :
                    (acc, x: number) => {
                        for (let i = 0; i <= size && !isReduced(acc); i++) {
                            acc = reduce(acc, (x >>> i) & 1);
                        }
                        return acc;
                    });
        });
}
