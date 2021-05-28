/**
 * @upsetjs/docs
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren, ReactNode } from 'react';
import Head from '@docusaurus/Head';

// Default implementation, that you can customize
// eslint-disable-next-line @typescript-eslint/ban-types
function Root({ children }: PropsWithChildren<{}>): ReactNode {
  return (
    <>
      <Head>
        <link key="apple-touch-icon" rel="apple-touch-icon" sizes="180x180" href="/img/apple-touch-icon.png" />
        <link key="icon32" rel="icon" type="image/png" sizes="32x32" href="/img/favicon-32x32.png" />
        <link key="icon16" rel="icon" type="image/png" sizes="16x16" href="/img/favicon-16x16.png" />
        <link key="manifest" rel="manifest" href="/img/site.webmanifest" />
        <link key="mask-icon" rel="mask-icon" href="/img/safari-pinned-tab.svg" color="#5bbad5" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="theme-color" content="#ffffff"></meta>
      </Head>

      {children}
    </>
  );
}

export default Root;
