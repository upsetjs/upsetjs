/**
 * @upsetjs/docs
 * https://github.com/upsetjs/upsetjs
 *
 * Copyright (c) 2019-2022 Samuel Gratzl <sam@sgratzl.com>
 */

import React, { ReactNode } from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';

export default function CodeSandboxExample({ name }: { name: string }): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  const { colorMode } = useColorMode();

  const path = `${siteConfig.organizationName}/${siteConfig.projectName}/tree/${siteConfig.customFields.branch}/examples/${name}`;
  return (
    <>
      <ul>
        <li>
          <a href={`https://codesandbox.io/s/github/${path}`}>Open in CodeSandbox</a>
        </li>
        <li>
          <a href={`https://github.com/${path}`}>Show Source</a>
        </li>
      </ul>
      <iframe
        title="Example Preview"
        className="embedded-iframe"
        src={`https://codesandbox.io/embed/github/${path}?autoresize=1&fontsize=14&theme=${colorMode}`}
      >
        Example Preview not available
      </iframe>
    </>
  );
}
