/**
 * @upsetjs/docs
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2021 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';
import TestTubeFillIcon from 'remixicon-react/TestTubeFillIcon';
import CursorFillIcon from 'remixicon-react/CursorFillIcon';
import NewspaperLineIcon from 'remixicon-react/NewspaperLineIcon';
import ChromeFillIcon from 'remixicon-react/ChromeFillIcon';
import MicroscopeFillIcon from 'remixicon-react/MicroscopeFillIcon';
// import BarChartBoxLineIcon from 'remixicon-react/BarChartBoxLineIcon';
// import StackLineIcon from 'remixicon-react/StackLineIcon';

function Feature({ imageUrl, title, children }: PropsWithChildren<{ imageUrl: string | ReactNode; title: string }>) {
  const imgUrl = useBaseUrl(typeof imageUrl === 'string' ? imageUrl : '/');
  return (
    <div className={clsx('col col--4', styles.feature)}>
      {imageUrl && (
        <div className="text--center">
          {typeof imageUrl === 'string' && <img className={styles.featureImage} src={imgUrl} alt={title} />}
          {typeof imageUrl !== 'string' && imageUrl}
        </div>
      )}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  );
}

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
            <div className="row">
              <Feature title="Web Frameworks" imageUrl={<ChromeFillIcon className={styles.featureImageSVG} />}>
                {`UpSet.js has adapters to web frameworks: `}
                <Link to={useBaseUrl('docs/integrations/react')}>React</Link>
                {`, `}
                <Link to={useBaseUrl('docs/integrations/vue')}>Vue.js</Link>
                {`, and a generic `}
                <Link to={useBaseUrl('docs/integrations/vanilla')}>Vanilla</Link>
                {` adapter, which just requires a DOM element.`}
              </Feature>
              <Feature title="Integrations" imageUrl={<TestTubeFillIcon className={styles.featureImageSVG} />}>
                {`UpSet.js has integrations to data science tools: `}
                <Link to={useBaseUrl('docs/integrations/observablehq')}>Observable HQ</Link>
                {`, `}
                <Link to={useBaseUrl('docs/integrations/r')}>R</Link>
                {`, `}
                <Link to={useBaseUrl('docs/integrations/jupyter')}>Python Jupyter</Link>
                {`, `}
                <Link to={useBaseUrl('docs/integrations/powerbi')}>PowerBI</Link>
                {`, and `}
                <Link to={useBaseUrl('docs/integrations/tableau')}>Tableau</Link>
                {`.`}
              </Feature>
              <Feature title="Demo Application" imageUrl={<MicroscopeFillIcon className={styles.featureImageSVG} />}>
                {`UpSet.js has a `}
                <Link to={useBaseUrl('app')}>demo application</Link>
                {` supporting loading custom datasets, exploring them, sharing, and exporting them.`}
              </Feature>
              <Feature
                title="Inspired by IEEEVIS publication"
                imageUrl={<NewspaperLineIcon className={styles.featureImageSVG} />}
              >
                {`UpSet.js is a JavaScript re-implementation of `}
                <a href="https://www.rdocumentation.org/packages/UpSetR/">UpSetR</a>
                {` which itself is based on `}
                <a href="http://vcg.github.io/upset/about/">UpSet</a>
                {`.`}
              </Feature>
              <Feature title="Interactivity" imageUrl={<CursorFillIcon className={styles.featureImageSVG} />}>
                {`UpSet.js supports `}
                <Link to={useBaseUrl('docs/components/upsetjs#interactivity')}>selections and queries</Link>
                {`, which allows you to highlight elements interactively.`}
              </Feature>
              <Feature title="Written in TypeScript" imageUrl="img/typescript-seeklogo.com.svg">
                {`Developed using latest web technologies and written in clean TypeScript.`}
              </Feature>
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
