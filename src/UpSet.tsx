import React, { FC } from 'react';
import { ExtraStyles } from './theme';

export type UpSetProps = {} & ExtraStyles;

const UpSet: FC<UpSetProps> = ({ className, style, children }) => {
  return (
    <svg className={className} style={style}>
      {children}
    </svg>
  );
};

export default UpSet;
