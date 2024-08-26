'use client'

import { Editor } from '@monaco-editor/react'
import type { editor } from 'monaco-editor'
import { useCallback, useRef } from 'react'
import { Box, Card, Flex, Grid } from '@radix-ui/themes'

import { JsxifyHtml } from 'jsxify-html'
import { OptionsBar } from './Options'

const defaultOptions = { xml: true, preservePreTags: false }

export function ConvertTextarea(): JSX.Element {
  const previewEditorRef = useRef<editor.IStandaloneCodeEditor>()
  const editorRef = useRef<editor.IStandaloneCodeEditor>()
  const jsxifier = useRef(new JsxifyHtml(defaultOptions))

  const setValue = useCallback(() => {
    previewEditorRef.current?.setValue(jsxifier.current.convert(
      editorRef.current?.getValue() ?? '',
    ) ?? '')
  }, [previewEditorRef, editorRef])

  return (
    <Box className="flex h-screen flex-col p-5">
      <Flex gap="3" direction="column" flexGrow="1">
        <OptionsBar
          options={defaultOptions}
          onChange={(options) => {
            jsxifier.current = new JsxifyHtml(options)
            setValue()
          }}
        />

        <Grid gap="3" flexGrow="1" columns="2" width="auto">
          <Card>
            <Editor
              theme="vs-dark"
              height="100%"
              defaultLanguage="html"
              defaultValue={`<h1
  class="title"
  style="--color: red; color: var(--color); --bgColor: #fff; background: rgb(var(--bgColor))"
>
  Hello World
</h1>

<code>
function test() {
    console.log("hello world")
}
</code>

<!-- view here after enable preserve-pre-tags option -->
<pre>
    
#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
  let addr = "[::1]:8081".parse().unwrap();

  Server::builder()
    .add_service(UserServiceServer::new(UserService::default()))
    .serve(addr)
    .await?;

  Ok(())
}

</pre>

<!-- view here after enable xml option -->
<HelloWorld>
    <div>hello world</div>
</HelloWorld>`}
              onMount={(editor) => {
                editorRef.current = editor
              }}
              onChange={(value) => {
                previewEditorRef.current?.setValue(
                  jsxifier.current.convert(value ?? '') ?? '',
                )
              }}
            />
          </Card>
          <Card>
            <Editor
              theme="vs-dark"
              height="100%"
              defaultLanguage="typescript"
              defaultValue="{ /* some comment */ }"
              options={{ readOnly: false }}
              onMount={(editor) => {
                previewEditorRef.current = editor
                setValue()
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
          </Card>
        </Grid>
      </Flex>
    </Box>
  )
}
