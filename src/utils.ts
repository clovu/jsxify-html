export function hasString(str?: string): boolean {
  const size = str?.trim().length ?? 0
  return typeof str === 'string' && size > 0
}

type ForEachCallback<K, V> = (value: V, key: K) => void

export function forEach<K extends keyof any = any, V = any>(target: Record<K, V>, callbackfn: ForEachCallback<K, V>): undefined {
  if (!target)
    return

  if (getType(target) === '[object Object]')
    forEachObject<K, V>(target, callbackfn)
}

function forEachObject<K extends keyof any, V>(target: Record<K, V>, callbackfn: ForEachCallback<K, V>): void {
  const kyes = Object.keys(target)
  kyes.forEach(key => callbackfn(target[key as K], key as K))
}

type MapCallback<K, V, R> = (key: K, value: V) => R

export function map<K extends keyof any, V, R>(target: Record<K, V>, callbackfn: MapCallback<K, V, R>): R[] {
  return Object.keys(target).map<R>(key => callbackfn(key as K, target[key as K]))
}

type Type = '[object Object]' | string

function getType(obj?: any): Type {
  return Object.prototype.toString.call(obj)
}
