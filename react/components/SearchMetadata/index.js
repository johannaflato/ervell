import React from 'react';
import PropTypes from 'prop-types';

import Grid from 'react/components/UI/Grid';
import HeaderMetadataContainer from 'react/components/UI/HeaderMetadata/HeaderMetadataContainer';
import SearchMetadataBreadcrumb from 'react/components/SearchMetadata/components/SearchMetadataBreadcrumb';
import SearchMetadataModeView from 'react/components/SearchMetadata/components/SearchMetadataModeView';
import SearchMetadataBlockFilter from 'react/components/SearchMetadata/components/SearchMetadataBlockFilter';

const SearchMetadata = ({ term, view, block_filter }) => (
  <HeaderMetadataContainer
    breadcrumb={<SearchMetadataBreadcrumb term={term} />}
  >
    <Grid>
      <SearchMetadataModeView search={term} view={view} block_filter={block_filter} />

      {view === 'blocks' &&
        <SearchMetadataBlockFilter block_filter={block_filter} />
      }
    </Grid>
  </HeaderMetadataContainer>
);

SearchMetadata.propTypes = {
  term: PropTypes.string,
  view: PropTypes.oneOf(['all', 'channels', 'blocks', 'users', 'groups']).isRequired,
  block_filter: PropTypes.oneOf(['IMAGE', 'EMBED', 'TEXT', 'ATTACHMENT', 'LINK']),
};

SearchMetadata.defaultProps = {
  term: null,
  block_filter: null,
};

export default SearchMetadata;
