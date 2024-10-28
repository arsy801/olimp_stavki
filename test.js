function calc(kef1, kef2, target = 23700) {
  if (kef1 == 0 || kef2 == 0 || kef1 > 2 || kef2 > 2) {
    return;
  }

  let sum1, sum2, result1, result2;

  if (kef1 > kef2) {
    sum1 = (target + 10500) / kef1;
    sum2 = target / kef2;
  } else {
    sum1 = target / kef1;
    sum2 = (target + 10500) / kef2;
  }

  while (sum1 + sum2 > 30500) {
    if (kef1 > kef2) {
      sum1 = Math.round((target + 10500) / kef1);
      sum2 = Math.round(target / kef2);
    } else {
      sum1 = Math.round(target / kef1);
      sum2 = Math.round((target + 10500) / kef2);
    }
    target -= 1;
  }

  if (kef1 > kef2) {
    result1 = Math.round(sum1 * kef1 - 10500);
    result2 = Math.round(sum2 * kef2);
  } else {
    result1 = Math.round(sum1 * kef1);
    result2 = Math.round(sum2 * kef2 - 10500);
  }

  if (result1 < 23250) {
    return false;
  }

  return {
    sum1,
    sum2,
    result1,
    result2,
    kef1,
    kef2,
  };
}

calc(1.76, 1.98);
console.log("___");
calc(1.76, 1.98);
