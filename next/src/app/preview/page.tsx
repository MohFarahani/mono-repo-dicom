'use client';
import dynamic from 'next/dynamic'

const PreviewPage = dynamic(() => import('@/components/PreviewPage'), { ssr: false });

const Preview = () => {

  return (
    <PreviewPage
    />
  );
};

export default Preview;