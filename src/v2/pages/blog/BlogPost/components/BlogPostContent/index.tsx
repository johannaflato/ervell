import React from 'react'
import styled from 'styled-components'
import { useQuery } from 'react-apollo'
import find from 'lodash/find'
import { Document, MARKS, BLOCKS } from '@contentful/rich-text-types'
import { documentToReactComponents } from '@contentful/rich-text-react-renderer'

import Text from 'v2/components/UI/Text'
import Box from 'v2/components/UI/Box'
import HorizontalRule from 'v2/components/UI/HorizontalRule'

import BLOG_POST_ASSETS_QUERY from 'v2/pages/blog/BlogPost/queries/BlogPostByID'

interface BlogPostContentProps {
  id: string
  content: Document
}

const BaseText = styled(Text).attrs({
  my: 6,
  lineHeight: 2,
  underlineLinks: true,
})``

const Container = styled(Box)`
  iframe {
    border: none;
    margin: 4em auto;
  }

  iframe.arena-iframe {
    height: 560px !important;
  }
`

const HR = styled(HorizontalRule).attrs({ color: 'gray.light' })`
  height: 2px;
`

const Figure = styled.figure`
  margin: ${({ theme }) => `${theme.space[8]} auto`};
  padding: 0;

  img {
    max-width: 100%;
    margin: 0 auto;
    display: block;
  }
`

const Figcaption = styled.figcaption`
  font-size: ${({ theme }) => theme.fontSizesIndexed.xs};
  margin: ${({ theme }) => `${theme.space[7]} 0`};
  color: ${({ theme }) => theme.colors.gray.base};
`

const Blockquote = styled.blockquote`
  border-left: 2px solid ${({ theme }) => theme.colors.gray.light};
  padding-left: ${({ theme }) => theme.space[6]};
  font-style italic;
  margin: ${({ theme }) => `${theme.space[8]} 0`};
`

const optionsWithEmbeds = (embedData: any) => {
  return {
    renderMark: {
      [MARKS.BOLD]: text => <BaseText fontWeight="bold">{text}</BaseText>,
    },
    renderNode: {
      [BLOCKS.EMBEDDED_ASSET]: node => {
        if (!embedData) {
          return null
        }

        const block = find(embedData.blogPost.body.links.assets.block, b => {
          return b.sys.id === node.data.target.sys.id
        })

        return (
          <Figure>
            <img src={block.url} />
            {block.description && (
              <Figcaption
                dangerouslySetInnerHTML={{ __html: block.description }}
              />
            )}
          </Figure>
        )
      },
      [BLOCKS.HEADING_1]: (_, children) => (
        <BaseText fontWeight="bold" f={9}>
          {children}
        </BaseText>
      ),
      [BLOCKS.HEADING_2]: (_, children) => (
        <BaseText fontWeight="bold" f={6}>
          {children}
        </BaseText>
      ),
      [BLOCKS.QUOTE]: (_, children) => <Blockquote>{children}</Blockquote>,
      [BLOCKS.HR]: () => <HR />,
      [BLOCKS.PARAGRAPH]: (_, children) => {
        if (
          children[0] &&
          typeof children[0] === 'string' &&
          children[0].indexOf('<') === 0
        ) {
          return <div dangerouslySetInnerHTML={{ __html: children[0] }} />
        }
        return <BaseText>{children}</BaseText>
      },
    },
    renderText: text => text.replace('!', '?'),
  }
}

export const BlogPostContent: React.FC<BlogPostContentProps> = ({
  content,
  id,
}) => {
  const { data: embedData } = useQuery(BLOG_POST_ASSETS_QUERY, {
    context: { clientName: 'contentful' },
    variables: { id },
  })

  const parsedContent = documentToReactComponents(
    content,
    optionsWithEmbeds(embedData)
  )

  return <Container>{parsedContent}</Container>
}