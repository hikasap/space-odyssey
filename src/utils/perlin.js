export class Perlin {
    constructor() {
        this.grad3 = [
            [1,1,0],[-1,1,0],[1,-1,0],[-1,-1,0],
            [1,0,1],[-1,0,1],[1,0,-1],[-1,0,-1],
            [0,1,1],[0,-1,1],[0,1,-1],[0,-1,-1]
        ];
        this.p = [];
        for(let i=0; i<256; i++) {
            this.p[i] = Math.floor(Math.random()*256);
        }
        this.perm = [];
        for(let i=0; i<512; i++) {
            this.perm[i] = this.p[i & 255];
        }
    }

    dot(g, x, y, z) {
        return g[0]*x + g[1]*y + g[2]*z;
    }

    noise(x, y=0, z=0) {
        // Skew constants
        const F3 = 1/3;
        const G3 = 1/6;
        let n0, n1, n2, n3;
        let s = (x+y+z)*F3;
        let i = Math.floor(x+s);
        let j = Math.floor(y+s);
        let k = Math.floor(z+s);
        let t = (i+j+k)*G3;
        let X0 = i - t;
        let Y0 = j - t;
        let Z0 = k - t;
        let x0 = x - X0;
        let y0 = y - Y0;
        let z0 = z - Z0;
        let i1, j1, k1;
        let i2, j2, k2;

        if(x0>=y0) {
            if(y0>=z0) { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
            else if(x0>=z0){ i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
            else { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
        } else {
            if(y0<z0) { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
            else if(x0<z0){ i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
            else { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
        }

        let x1 = x0 - i1 + G3;
        let y1 = y0 - j1 + G3;
        let z1 = z0 - k1 + G3;
        let x2 = x0 - i2 + 2*G3;
        let y2 = y0 - j2 + 2*G3;
        let z2 = z0 - k2 + 2*G3;
        let x3 = x0 - 1 + 3*G3;
        let y3 = y0 - 1 + 3*G3;
        let z3 = z0 - 1 + 3*G3;

        i &= 255;
        j &= 255;
        k &= 255;
        let gi0 = this.perm[i+this.perm[j+this.perm[k]]] % 12;
        let gi1 = this.perm[i+i1+this.perm[j+j1+this.perm[k+k1]]] % 12;
        let gi2 = this.perm[i+i2+this.perm[j+j2+this.perm[k+k2]]] % 12;
        let gi3 = this.perm[i+1+this.perm[j+1+this.perm[k+1]]] % 12;

        // Calculate contributions
        let t0 = 0.5 - x0*x0 - y0*y0 - z0*z0;
        if(t0<0) { n0=0; } else {
            t0 *= t0;
            n0 = t0 * t0 * this.dot(this.grad3[gi0], x0, y0, z0);
        }
        let t1 = 0.5 - x1*x1 - y1*y1 - z1*z1;
        if(t1<0) { n1=0; } else {
            t1 *= t1;
            n1 = t1 * t1 * this.dot(this.grad3[gi1], x1, y1, z1);
        }
        let t2 = 0.5 - x2*x2 - y2*y2 - z2*z2;
        if(t2<0) { n2=0; } else {
            t2 *= t2;
            n2 = t2 * t2 * this.dot(this.grad3[gi2], x2, y2, z2);
        }
        let t3 = 0.5 - x3*x3 - y3*y3 - z3*z3;
        if(t3<0) { n3=0; } else {
            t3 *= t3;
            n3 = t3 * t3 * this.dot(this.grad3[gi3], x3, y3, z3);
        }
        return 72 * (n0 + n1 + n2 + n3);
    }
}

// Example usage:
// const perlin = new Perlin();
// const val = perlin.noise(x, y, z);