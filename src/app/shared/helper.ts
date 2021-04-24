export function floorToEven(number: number): number {
  const roundedNumber = Math.floor(number);
  return roundedNumber % 2 === 1 ? roundedNumber - 1 : roundedNumber;
}

