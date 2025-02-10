import { ApolloProvider } from '@/providers/ApolloProvider';
import ThemeRegistry from './ThemeRegistry';
import ErrorBoundary from '@/components/ErrorBoundary';
import Layout from '@/components/Layout';

export const metadata = {
  title: 'Software Engineer- MedBlock',
  description: 'Created with Next.js and MUI',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary>
          <ApolloProvider>
            <ThemeRegistry>
              <Layout>
                 {children}
                </Layout>             
              </ThemeRegistry>
          </ApolloProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}