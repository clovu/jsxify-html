'use client'

import { Editor } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useRef } from 'react'
import { convert } from '@html2jsx/convert'

export function ConvertTextarea(): JSX.Element {
  const previewEditorRef = useRef<editor.IStandaloneCodeEditor>()
  return (
    <div className="flex h-screen">
      <Editor
        height="100%"
        defaultLanguage="html"
        defaultValue="<!-- some comment -->"
        onChange={(value) => {
          previewEditorRef.current?.setValue(
            convert(value ?? '') ?? '',
          )
        }}
      />
      <Editor
        height="100%"
        defaultLanguage="typescript"
        defaultValue="// some comment"
        options={{ readOnly: false,

        }}
        onMount={(editor) => {
          previewEditorRef.current = editor
        }}
        beforeMount={(monaco) => {
          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true, // This line disables errors in jsx tags like <div>, etc.
          })

          // I don't think the following makes any difference
          monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
          // jsx: 'react',
            jsx: monaco.languages.typescript.JsxEmit.ReactJSX,
            jsxFactory: 'React.createElement',
            reactNamespace: 'React',
            allowNonTsExtensions: true,
            allowJs: true,
            target: monaco.languages.typescript.ScriptTarget.Latest,
          })
        }}
      />
    </div>
  )
}
