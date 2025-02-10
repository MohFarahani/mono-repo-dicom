'use client';

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic'

const DicomViewerPage = dynamic(() => import('@/components/DicomViewerPage'), { ssr: false });

// Component that uses search params
function MultiPreviewContent() {
  const searchParams = useSearchParams();
  const queryFilePath = searchParams?.get('filePath');
    if (!queryFilePath) {
      return <div>No file path provided</div>;
    }
  return (
    <DicomViewerPage queryFilePath={queryFilePath} />
  );
}

// Main page component
export default function MultiPreviewPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MultiPreviewContent />
    </Suspense>
  );
}