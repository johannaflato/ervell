import React, { useState, useRef, useEffect } from 'react'
import styled from 'styled-components'
import { useMutation } from 'react-apollo'
import { useForm, useField } from 'react-final-form-hooks'

import Box from 'v2/components/UI/Box'
import { SplitPane } from 'v2/components/UI/SplitPane'
import { Textarea, Input } from 'v2/components/UI/Inputs'
import Close from 'v2/components/UI/Close'
import { DividerButton as Button } from 'v2/components/UI/Buttons'
import constants from 'v2/styles/constants'

import {
  LightboxContainer as Container,
  ContentContainer,
  SidebarContainer,
  TextBoxContainer,
} from 'v2/components/BlockLightboxLayout'

import BlockLightboxImage from 'v2/components/BlockLightbox/components/BlockLightboxImage'
import BlockLightboxLink from 'v2/components/BlockLightbox/components/BlockLightboxLink'
import BlockLightboxAttachment from 'v2/components/BlockLightbox/components/BlockLightboxAttachment'
import BlockLightboxEmbed from 'v2/components/BlockLightbox/components/BlockLightboxEmbed'
import BlockLightboxPending from 'v2/components/BlockLightbox/components/BlockLightboxPending'

import UPDATE_BLOCK_MUTATION from 'v2/components/ManageBlock/mutations/updateBlock'

import { ManageBlock as Block } from '__generated__/ManageBlock'
import {
  updateBlockMutation,
  updateBlockMutationVariables,
} from '__generated__/updateBlockMutation'

const TextField = styled(Textarea).attrs({ px: 7, py: 6, bg: 'gray.hint' })`
  width: 100%;
  height: 100%;
  border: none;
  box-sizing: border-box;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: ${constants.radii.subtle};
  line-height: 1.55;
`

const TextInput = styled(Input).attrs({
  bg: 'gray.hint',
  borderColor: 'gray.light',
})`
  border-radius: ${constants.radii.subtle};
`

const DescriptionField = styled(Textarea).attrs({
  bg: 'gray.hint',
  borderColor: 'gray.light',
  mt: 6,
})`
  border-radius: ${constants.radii.subtle};
  height: 10em;
`

interface ManageBlockProps {
  block: Block
  updateBlock?: (e?: any) => void
  onDone?: (e?: any) => void
  onChangePending?: () => void
  autoFocus?: 'title' | 'description' | 'body'
}

export const ManageBlock: React.FC<ManageBlockProps> = ({
  block,
  onDone,
  autoFocus,
}) => {
  const [mode, setMode] = useState<'resting' | 'saving' | 'error' | 'saved'>(
    'resting'
  )
  const titleRef = useRef(null)
  const contentRef = useRef(null)
  const descriptionRef = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      const element = {
        title: titleRef,
        description: descriptionRef,
        body: contentRef,
      }[autoFocus]

      element.current.focus()
    }, 0)
  }, [titleRef, contentRef, descriptionRef, autoFocus])

  const [updateBlock] = useMutation<
    updateBlockMutation,
    updateBlockMutationVariables
  >(UPDATE_BLOCK_MUTATION)

  const onSubmit = values => {
    setMode('saving')
    updateBlock({ variables: { id: block.id, ...values } })
      .then(() => {
        setMode('saved')
        onDone()
      })
      .catch(() => {
        setMode('error')
      })
  }

  const initialValues = {
    content: block.__typename === 'Text' ? block.editable_content : undefined,
    description: block.editable_description,
    title: block.editable_title,
  }

  const { form, handleSubmit, pristine, submitting } = useForm({
    initialValues: initialValues,
    onSubmit, // the function to call with your form values upon valid submit
  })

  const contentField = useField('content', form)
  const titleField = useField('title', form)
  const descriptionField = useField('description', form)

  const Content = {
    Image: props => <BlockLightboxImage {...props} />,
    Link: props => <BlockLightboxLink {...props} />,
    Attachment: props => <BlockLightboxAttachment {...props} />,
    Embed: props => <BlockLightboxEmbed {...props} />,
    PendingBlock: props => <BlockLightboxPending {...props} />,
  }[block.__typename]

  return (
    <Container layout="DEFAULT">
      <form onSubmit={handleSubmit}>
        <SplitPane context="MODAL" layout="DEFAULT" visible={true}>
          <ContentContainer layout="DEFAULT">
            {block.__typename === 'Text' && (
              <TextBoxContainer layout="DEFAULT">
                <TextField
                  layout="DEFAULT"
                  block={block}
                  ref={contentRef}
                  {...contentField.input}
                />
              </TextBoxContainer>
            )}

            {block.__typename !== 'Text' && <Content block={block} />}
          </ContentContainer>
          <SidebarContainer display="flex" style={{ paddingBottom: '1em' }}>
            <Box
              pt={8}
              display="flex"
              flex={1}
              justifyContent="space-between"
              flexDirection="column"
            >
              <div>
                <TextInput
                  ref={titleRef}
                  placeholder="Title"
                  {...titleField.input}
                />

                <DescriptionField
                  ref={descriptionRef}
                  placeholder="Description"
                  {...descriptionField.input}
                />
              </div>

              <Button type="submit" disabled={pristine || submitting}>
                {
                  {
                    resting: 'Save',
                    saving: 'Saving',
                    saved: 'Saved',
                    error: 'Error',
                  }[mode]
                }
              </Button>
            </Box>
          </SidebarContainer>
        </SplitPane>
        <Close
          size={8}
          py={5}
          px={4}
          thickness="2px"
          position="absolute"
          top={0}
          right={0}
          zIndex={1}
          onClick={onDone}
        />
      </form>
    </Container>
  )
}