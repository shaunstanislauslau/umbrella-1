import * as assert from "assert";
import * as v from "../src/index";

describe("gvec", () => {

    const op2 = (fn, x, y, z, w) => {
        assert.deepEqual(
            fn([1, 2, 3, 4], [10, 20, 30, 40], 4),
            [x, y, z, w]
        );
        assert.deepEqual(
            fn([0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0], [0, 10, 0, 20, 0, 30, 0, 40, 0], 4, 1, 1, 4, 2),
            [0, x, 0, 0, 0, y, 0, 0, 0, z, 0, 0, 0, w, 0, 0]
        );
    };

    const opn = (fn, x, y, z, w) => {
        assert.deepEqual(
            fn([1, 2, 3, 4], 10, 4),
            [x, y, z, w]
        );
        assert.deepEqual(
            fn([0, 1, 0, 0, 0, 2, 0, 0, 0, 3, 0, 0, 0, 4, 0, 0], 10, 4, 1, 4),
            [0, x, 0, 0, 0, y, 0, 0, 0, z, 0, 0, 0, w, 0, 0]
        );
    };

    it("add", () => op2(v.add, 11, 22, 33, 44));
    it("sub", () => op2(v.sub, -9, -18, -27, -36));
    it("mul", () => op2(v.mul, 10, 40, 90, 160));
    it("div", () => op2(v.div, 0.1, 0.1, 0.1, 0.1));

    it("addn", () => opn(v.addN, 11, 12, 13, 14));
    it("subn", () => opn(v.subN, -9, -8, -7, -6));
    it("muln", () => opn(v.mulN, 10, 20, 30, 40));
    it("divn", () => opn(v.divN, 0.1, 0.2, 0.3, 0.4));

    it("madd", () => {
        assert.deepEqual(
            v.madd([1, 2, 3, 4], [10, 20, 30, 40], [0.5, 0.25, 0.75, 0.125], 4),
            [1 + 10 * 0.5, 2 + 20 * 0.25, 3 + 30 * 0.75, 4 + 40 * 0.125]
        );
        assert.deepEqual(
            v.madd([1, 2, 3, 4], [10, 0, 20, 0, 30, 0, 40], [0.5, 0, 0, 0.25, 0, 0, 0.75, 0, 0, 0.125], 4, 0, 0, 0, 1, 2, 3),
            [1 + 10 * 0.5, 2 + 20 * 0.25, 3 + 30 * 0.75, 4 + 40 * 0.125]
        );
    });

    it("maddn", () => {
        assert.deepEqual(
            v.maddN([1, 2, 3, 4], [10, 20, 30, 40], 0.5, 4),
            [1 + 10 * 0.5, 2 + 20 * 0.5, 3 + 30 * 0.5, 4 + 40 * 0.5]
        );
        assert.deepEqual(
            v.maddN([1, 2, 3, 4], [10, 0, 20, 0, 30, 0, 40], 0.5, 4, 0, 0, 1, 2),
            [1 + 10 * 0.5, 2 + 20 * 0.5, 3 + 30 * 0.5, 4 + 40 * 0.5]
        );
    });

    it("equiv", () => {
        const buf = [1, 2, 3, 4, 1, 0, 2, 0, 3, 0, 4];
        assert(v.equiv(buf, buf, 4, 0, 4, 1, 2));
        assert(!v.equiv(buf, buf, 4, 0, 4));
        assert(new v.GVec(buf, 4).equiv(buf.slice(0, 4)));
        assert(new v.GVec(buf, 4).equiv(new v.GVec(buf, 4, 4, 2)));
        assert(!new v.GVec(buf, 4).equiv(new v.GVec(buf, 4, 4, 1)));
    });

    it("eqdelta", () => {
        assert(v.eqDelta([0, 1.001, 0, 1.999, 0, 3.0099, 0, 3.991], [1, 2, 3, 4], 4, 0.01, 1, 0, 2, 1));
        assert(!v.eqDelta([0, 1.001, 0, 1.999, 0, 3.02, 0, 4], [1, 2, 3, 4], 4, 0.01, 1, 0, 2, 1));
    });

    it("iterator", () => {
        assert.deepEqual([...v.gvec(1, 2, 3)], [1, 2, 3]);
        assert.deepEqual([...new v.GVec([0, 1, 0, 2, 0, 3], 3, 1, 2)], [1, 2, 3]);
    });

    it("length", () => {
        assert.deepEqual(v.gvec(1, 2, 3).length, 3);
    });
});
