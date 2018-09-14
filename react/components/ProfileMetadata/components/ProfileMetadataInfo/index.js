import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propType } from 'graphql-anywhere';
import styled from 'styled-components';

import { calculateLineHeight } from 'react/styles/functions';

import profileMetadataInfoFragment from 'react/components/ProfileMetadata/components/ProfileMetadataInfo/fragments/profileMetadataInfo';

import Pocket from 'react/components/UI/Pocket';
import Expandable from 'react/components/UI/Expandable';
import WithLoginStatus from 'react/hocs/WithLoginStatus';

const N_LINES = 5;
const FIVE_LINES = `${calculateLineHeight('xs', 'tall') * N_LINES}rem`;

const Buttons = styled.div`
  margin: 1em 0;

  &:first-child {
    margin-top: 0;
  }

  &:last-child {
    margin-bottom: 0;
  }

  a {
    display: block;
  }
`;

class ProfileMetadataInfo extends Component {
  static propTypes = {
    identifiable: propType(profileMetadataInfoFragment).isRequired,
    isLoggedIn: PropTypes.bool.isRequired,
  }

  render() {
    const { identifiable, isLoggedIn } = this.props;

    return (
      <Pocket title="Info">
        <Expandable height={FIVE_LINES}>
          <div dangerouslySetInnerHTML={{ __html: identifiable.about || '—' }} />
        </Expandable>

        {isLoggedIn && (identifiable.counts.followers > 0 || identifiable.counts.following > 1) &&
          <Buttons>
            {identifiable.counts.followers > 0 &&
              <a href={`${identifiable.href}/followers`}>
                Followers
              </a>
            }

            {/* Subtract 1 to ignore the default Are.na follow */}
            {(identifiable.counts.following - 1) > 0 &&
              <a href={`${identifiable.href}/following`}>
                Following
              </a>
            }
          </Buttons>
        }
      </Pocket>
    );
  }
}

export default WithLoginStatus(ProfileMetadataInfo);
