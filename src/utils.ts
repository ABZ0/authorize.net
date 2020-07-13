export function getRandomString(text: string) {
  return text + Math.floor(Math.random() * 100000 + 1);
}

export function getRandomInt() {
  return Math.floor(Math.random() * 100000 + 1);
}

export function getRandomAmount() {
  return (Math.random() * 100 + 1).toFixed(2);
}

export function getDate() {
  return new Date().toISOString().substring(0, 10);
}
