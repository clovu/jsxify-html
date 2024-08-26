import { Box, Card, Checkbox, Flex, Text } from '@radix-ui/themes'
import { useEffect, useState } from 'react'

interface OptionProps {
  options: {
    xml?: boolean
    preservePreTags?: boolean
  }

  onChange?: (options: Options) => void
}

type Options = OptionProps['options']

export function OptionsBar({ options, onChange }: OptionProps): JSX.Element {
  const [opts, setOptions] = useState({ xml: true, preservePreTags: false } as Options)

  useEffect(() => {
    setOptions({ ...options })
  }, [options])

  function setOption(opts: Options): void {
    setOptions(opts)
    onChange?.(opts)
  }

  return (
    <Box className="h-[60px]">
      <Card>
        <Text as="label" size="2">
          <Flex as="span" gap="2">
            xml:
            <Checkbox onCheckedChange={(state) => {
              setOption({ ...opts, xml: Boolean(state) })
            }}
            />
          </Flex>
        </Text>

        <Text as="label" size="2">
          <Flex as="span" gap="2">
            preserve-pre-tags:
            <Checkbox onCheckedChange={(state) => {
              setOption({ ...opts, preservePreTags: Boolean(state) })
            }}
            />
          </Flex>
        </Text>
      </Card>
    </Box>
  )
}
