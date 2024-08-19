'use client'

import { createRef } from 'react'
import { convert } from '@html2jsx/convert'

export function ConvertTextarea(): JSX.Element {
  const ref = createRef<HTMLTextAreaElement>()
  return (
    <>
      <textarea ref={ref} style={{ color: 'red' }} />
      <button onClick={() => {
        const ast = convert(ref.current?.value ?? '')
        // eslint-disable-next-line no-console
        console.log(ast)
      }}
      >
        Convert
      </button>
    </>
  )
}
