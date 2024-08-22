export interface TextPart { value: string, type: 'string' | 'merge' }

export function splitMergeString(str: string): TextPart[] {
  const parts: TextPart[] = []
  let current = ''
  let bal = 0

  for (let i = 0; i < str.length; i++) {
    const char = str[i]

    if (char === '{') {
      if (bal === 0) {
        parts.push({ value: current, type: 'string' })
        current = ''
      }
      bal++
      current += char
    }
    else if (char === '}') {
      current += char
      bal--
      if (bal === 0) {
        parts.push({ value: current, type: 'merge' })
        current = ''
      }
    }
    else {
      current += char
    }
  }

  parts.push({ value: current, type: 'string' })

  return parts
}

// { hello }
