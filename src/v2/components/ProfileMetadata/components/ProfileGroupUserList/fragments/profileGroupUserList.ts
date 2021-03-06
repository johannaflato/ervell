import gql from 'graphql-tag'

export default gql`
  fragment ProfileGroupUserList on Identifiable {
    ... on Group {
      id
      user {
        id
        label: name
        href
      }
      users {
        id
        label: name
        href
      }

      can {
        manage_users
      }
    }
  }
`
