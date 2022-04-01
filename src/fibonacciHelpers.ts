function isPerfectSquare(x: number)
{
    const s = Math.floor(Math.sqrt(x));
    return (s * s == x);
}

export function isFibonacciNumber(n: number)
{
    return isPerfectSquare(5 * n * n + 4) ||
        isPerfectSquare(5 * n * n - 4);
}

export function previousFibonacci(n: number): number
{
    if (n == 1) return 0;
    const answer = n / ((1 + Math.sqrt(5)) / 2);
    return Math.round(answer);
}
