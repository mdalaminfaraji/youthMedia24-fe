/* eslint-disable @typescript-eslint/no-explicit-any */
// components/BlockRendererClient.tsx
import React from 'react'
import { BlocksRenderer } from '@strapi/blocks-react-renderer'

interface BlockRendererClientProps {
  content: any // Adjust the type according to your content structure
}

const BlockRendererClient: React.FC<BlockRendererClientProps> = ({
  content,
}) => {
  return <BlocksRenderer content={content} />
}

export default BlockRendererClient
