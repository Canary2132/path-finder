export function randomFromInterval(min: number, max: number, floor = true): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rand =  Math.random() * (max - min) + min;
  return floor ? Math.round(rand) : rand;
}

export function randomIntegerFromIntervalExclude(min: number, max: number, exclude: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  const rand = Math.floor(Math.random() * (max - min) + min);

  return  rand === exclude ? randomIntegerFromIntervalExclude(min, max, exclude) : rand;
}
