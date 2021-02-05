/**
 * @upsetjs/docs
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';
// import Filter3FillIcon from 'remixicon-react/Filter3FillIcon';
// import NewspaperLineIcon from 'remixicon-react/NewspaperLineIcon';
// import BarChartBoxLineIcon from 'remixicon-react/BarChartBoxLineIcon';
// import StackLineIcon from 'remixicon-react/StackLineIcon';

// function Feature({ imageUrl, title, children }: PropsWithChildren<{ imageUrl: string | ReactNode; title: string }>) {
//   const imgUrl = useBaseUrl(typeof imageUrl === 'string' ? imageUrl : '/');
//   return (
//     <div className={clsx('col col--4', styles.feature)}>
//       {imageUrl && (
//         <div className="text--center">
//           {typeof imageUrl === 'string' && <img className={styles.featureImage} src={imgUrl} alt={title} />}
//           {typeof imageUrl !== 'string' && imageUrl}
//         </div>
//       )}
//       <h3>{title}</h3>
//       <p>{children}</p>
//     </div>
//   );
// }

export default function Home() {
  const context = useDocusaurusContext();
  const { siteConfig = {} } = context;
  return (
    <Layout title="Homepage" description="X">
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">{siteConfig.title}</h1>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to={useBaseUrl('docs/getting-started')}
            >
              Get Started
            </Link>
            <Link
              className={clsx('button button--outline button--secondary button--lg', styles.getStarted)}
              to="https://github.com/upsetjs/upsetjs"
            >
              GitHub
            </Link>
          </div>
        </div>
      </header>
      <main>
        <section className={styles.features}>
          <div className="container">
            <div className="row"></div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
