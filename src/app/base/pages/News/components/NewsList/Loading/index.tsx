import React from 'react';
import ContentLoader from 'react-content-loader';

export default () => (
  <ContentLoader height={90} width={375} speed={2} primaryColor="#f3f3f3" secondaryColor="#ecebeb">
    <rect x="249" y="15" rx="0" ry="0" width="120" height="75" />
    <rect x="10" y="15" rx="0" ry="0" width="215" height="38" />
    <rect x="10" y="70" rx="0" ry="0" width="215" height="22" />
  </ContentLoader>
);
